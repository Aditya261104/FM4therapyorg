import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { brand, pricing } from '@/lib/config';

const CUSTOM_EVENT_NAME = 'sales';
const META_GRAPH_VERSION = 'v25.0';

// Lazy Razorpay client — same pattern as create-order. Used here to fetch the
// verified payment after HMAC succeeds so Pabbly + CAPI can ship the actual
// charged amount rather than an env-config constant. Stays null if env vars
// aren't set; consumers fall back to pricing.inr / pricing.currency.
let razorpay: Razorpay | null = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// ── Meta Conversions API ──────────────────────────────────────────────
// One HTTP call per paid order, containing TWO events:
//   1. Purchase  — standard, optimizer target (campaign opt + global ML priors)
//   2. sales     — custom, internal source-of-truth label
// Both share event_id (= razorpay payment_id) so they dedupe against any
// browser-side event of the same name+id (we don't fire any by default).
//
// user_data ships 11 matching signals:
//   Hashed (SHA-256 hex): em, ph, fn, ln, ct, country, external_id
//   Raw (no hash):        fbc, fbp, client_ip_address, client_user_agent
async function sendMetaCapiEvent(params: {
  pixelId: string;
  accessToken: string;
  paymentId: string;
  email: string;
  phone: string;          // dial code + number, raw
  firstName: string;
  lastName: string;
  city: string;
  countryCode: string;    // 2-letter ISO
  eventSourceUrl: string;
  value: number;          // verified amount in major units (e.g. rupees, not paise)
  currency: string;       // verified currency ISO code, e.g. INR
  fbc: string | undefined;
  fbp: string | undefined;
  clientIp: string | undefined;
  clientUserAgent: string | undefined;
}) {
  const normalisedEmail = params.email.trim().toLowerCase();
  const hashedEmail = sha256(normalisedEmail);

  // Phone: digits only (E.164 without +) before hashing.
  const rawPhone = params.phone.replace(/\D/g, '');
  const hashedPhone = rawPhone ? sha256(rawPhone) : undefined;

  // external_id: stable per-user identifier. Must match the browser MAM
  // value (which uses the same sha256(email) derivation in lib/analytics.ts).
  const externalId = sha256(normalisedEmail);

  const fn = params.firstName.trim().toLowerCase();
  const ln = params.lastName.trim().toLowerCase();
  const ct = params.city.trim().toLowerCase().replace(/[^a-z]/g, '');
  const country = params.countryCode.trim().toLowerCase();

  const hashedFn      = fn      ? sha256(fn)      : undefined;
  const hashedLn      = ln      ? sha256(ln)      : undefined;
  const hashedCt      = ct      ? sha256(ct)      : undefined;
  const hashedCountry = country ? sha256(country) : undefined;

  const baseEvent = {
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.paymentId,
    action_source: 'website',
    event_source_url: params.eventSourceUrl,
    user_data: {
      em: [hashedEmail],
      ...(hashedPhone   && { ph:      [hashedPhone] }),
      ...(hashedFn      && { fn:      [hashedFn] }),
      ...(hashedLn      && { ln:      [hashedLn] }),
      ...(hashedCt      && { ct:      [hashedCt] }),
      ...(hashedCountry && { country: [hashedCountry] }),
      external_id: [externalId],
      ...(params.fbc && { fbc: params.fbc }),
      ...(params.fbp && { fbp: params.fbp }),
      ...(params.clientUserAgent && { client_user_agent: params.clientUserAgent }),
      ...(params.clientIp        && { client_ip_address: params.clientIp }),
    },
    custom_data: {
      currency:   params.currency,
      value:      params.value,
      payment_id: params.paymentId,
    },
  };

  const events = [
    { ...baseEvent, event_name: 'Purchase' },
    { ...baseEvent, event_name: CUSTOM_EVENT_NAME },
  ];

  const res = await fetch(
    `https://graph.facebook.com/${META_GRAPH_VERSION}/${params.pixelId}/events?access_token=${params.accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: events }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return res.json();
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  countryCode: string;
  dialCode: string;
  customerType: string; // "Myself" | "Loved One"
}

interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId, paymentId, signature, customer, utm, eventSourceUrl, fbclid,
    }: {
      orderId: string;
      paymentId: string;
      signature: string;
      customer: CustomerData;
      utm: UtmData;
      eventSourceUrl?: string;
      fbclid?: string;
    } = body;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment fields.' },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('[verify-payment] RAZORPAY_KEY_SECRET not configured');
      return NextResponse.json(
        { success: false, error: 'Payment verification not configured.' },
        { status: 500 }
      );
    }

    // HMAC-SHA256 of "orderId|paymentId" — Razorpay protocol
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed.' },
        { status: 400 }
      );
    }

    // ✅ Signature verified.
    console.log('[verify-payment] Verified purchase:', { paymentId, email: customer.email });

    // Test-mode gate. When PRICE_INR=1 (Vercel preview / staging), skip ALL
    // downstream side effects (including the Razorpay payment fetch below) so
    // ₹1 sanity-check payments don't pollute Meta Events Manager / Pabbly and
    // don't burn unnecessary Razorpay API calls. Set PRICE_INR=97 in
    // production to re-enable. (The QA-coupon path in /api/checkout/free-order
    // is independent — it has its own is_test=yes tag.)
    if (!pricing.trackingEnabled) {
      console.log('[verify-payment] Tracking disabled (PRICE_INR=1) — skipping Pabbly + Meta CAPI');
      return NextResponse.json({ success: true, paymentId });
    }

    // ── Fetch the verified amount + currency from Razorpay ────────────────
    // Source of truth for what was actually charged, instead of relying on
    // the env-derived pricing.inr constant. If anything fails (Razorpay API
    // down, malformed response, missing client), fall back to pricing.inr /
    // pricing.currency so the transaction still gets logged + tracked.
    let verifiedAmountInRupees = pricing.inr;
    let verifiedCurrency = pricing.currency;
    if (razorpay) {
      try {
        const payment = await razorpay.payments.fetch(paymentId);
        const rawAmount = typeof payment.amount === 'string'
          ? parseInt(payment.amount, 10)
          : payment.amount;
        if (typeof rawAmount === 'number' && Number.isFinite(rawAmount) && rawAmount > 0) {
          verifiedAmountInRupees = Math.round(rawAmount / 100);
        }
        if (typeof payment.currency === 'string' && payment.currency.length > 0) {
          verifiedCurrency = payment.currency;
        }
        console.log(`[verify-payment] Razorpay payment fetched: amount=${verifiedAmountInRupees} ${verifiedCurrency}`);
      } catch (err) {
        console.error('[verify-payment] Razorpay payment fetch failed — falling back to env defaults:', err);
      }
    } else {
      console.warn('[verify-payment] Razorpay client not configured — using env defaults for amount/currency');
    }

    // ── Identity + context signals — shared by BOTH the Pabbly payload and
    //    the Meta CAPI events below. Computed once here so the downstream CRM
    //    (fed by Pabbly) gets the same matching signals the CAPI already uses.
    const fbc = req.cookies.get('_fbc')?.value;
    const fbp = req.cookies.get('_fbp')?.value;
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      undefined;
    const clientUserAgent = req.headers.get('user-agent') ?? undefined;
    // external_id matches the CAPI derivation exactly: sha256(lowercased email).
    const externalId = sha256(customer.email.trim().toLowerCase());
    const resolvedEventSourceUrl =
      eventSourceUrl && eventSourceUrl.length > 0
        ? eventSourceUrl
        : 'https://www.fm4therapyindia.org/product-checkout';

    // ── Build Pabbly payload with the verified amount + currency ──────────
    // EXISTING fields are preserved verbatim. The downstream-CRM fields
    // (lead_id, created_at, fbc, fbp, client_ip_address, client_user_agent,
    // external_id, event_source_url, is_test, purchase_event_id, fbclid) are
    // ADDED so the CRM Sheet columns A–W can be mapped by Pabbly. Nothing is
    // removed. Empty values are sent as '' (never undefined).
    const now = new Date();
    const pabblyPayload = {
      // --- existing fields (unchanged) ---
      first_name:        customer.firstName,
      last_name:         customer.lastName,
      full_name:         `${customer.firstName} ${customer.lastName}`,
      email:             customer.email,
      phone:             `${customer.dialCode}${customer.phone}`,
      city:              customer.city,
      country_code:      customer.countryCode,
      customer_type:     customer.customerType,
      payment_id:        paymentId,
      order_id:          orderId,
      amount:            String(verifiedAmountInRupees),
      currency:          verifiedCurrency,
      payment_date:      now.toLocaleDateString('en-IN', { timeZone: brand.paymentTimezone }),
      payment_time:      now.toLocaleTimeString('en-IN', { timeZone: brand.paymentTimezone }),
      payment_timestamp: now.toISOString(),
      utm_source:        utm?.source   ?? '',
      utm_medium:        utm?.medium   ?? '',
      utm_campaign:      utm?.campaign ?? '',
      utm_content:       utm?.content  ?? '',
      utm_term:          utm?.term     ?? '',
      // --- added for the downstream CRM (Sheet cols A–W) ---
      lead_id:           paymentId,
      created_at:        now.toISOString(),
      fbc:               fbc ?? '',
      fbp:               fbp ?? '',
      client_ip_address: clientIp ?? '',
      client_user_agent: clientUserAgent ?? '',
      external_id:       externalId,
      event_source_url:  resolvedEventSourceUrl,
      is_test:           'false',
      purchase_event_id: paymentId,
      fbclid:            fbclid ?? '',
    };

    // Fire Pabbly webhook (non-blocking — errors never surface to the user)
    const webhookUrl = process.env.PABBLY_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pabblyPayload),
        });
        if (webhookResponse.ok) {
          console.log('[verify-payment] Pabbly webhook ok:', webhookResponse.status);
        } else {
          console.error('[verify-payment] Pabbly webhook failed:', webhookResponse.status);
        }
      } catch (err) {
        console.error('[verify-payment] Pabbly webhook error:', err);
      }
    } else {
      console.warn('[verify-payment] PABBLY_WEBHOOK_URL not set — webhook skipped');
    }

    // ── Meta CAPI (only fires if both env vars are present) ──
    const metaPixelId = process.env.META_PIXEL_ID;
    const metaAccessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (metaPixelId && metaAccessToken) {
      // fbc / fbp / clientIp / clientUserAgent / externalId / resolvedEventSourceUrl
      // are computed once above (shared with the Pabbly payload). Reuse them here.
      const fullPhone = `${customer.dialCode}${customer.phone}`;

      try {
        await sendMetaCapiEvent({
          pixelId:           metaPixelId,
          accessToken:       metaAccessToken,
          paymentId,
          email:             customer.email,
          phone:             fullPhone,
          firstName:         customer.firstName,
          lastName:          customer.lastName,
          city:              customer.city,
          countryCode:       customer.countryCode,
          eventSourceUrl:    resolvedEventSourceUrl,
          value:             verifiedAmountInRupees,
          currency:          verifiedCurrency,
          fbc, fbp, clientIp, clientUserAgent,
        });
        console.log('[verify-payment] Meta CAPI events sent (Purchase + sales)');
      } catch (err) {
        console.error('[verify-payment] Meta CAPI error:', err);
      }
    }

    return NextResponse.json({ success: true, paymentId });
  } catch (error) {
    console.error('[verify-payment]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
