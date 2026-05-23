import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { brand, pricing } from '@/lib/config';

// ── OPTIONAL: Meta Conversions API ────────────────────────────────────
async function sendMetaCapiEvent(params: {
  pixelId: string;
  accessToken: string;
  paymentId: string;
  email: string;
  phone: string;
  fbc: string | undefined;
  fbp: string | undefined;
  clientIp: string | undefined;
  clientUserAgent: string | undefined;
}) {
  const hashedEmail = crypto
    .createHash('sha256')
    .update(params.email.trim().toLowerCase())
    .digest('hex');

  const rawPhone = params.phone.replace(/\D/g, '');
  const hashedPhone = rawPhone
    ? crypto.createHash('sha256').update(rawPhone).digest('hex')
    : undefined;

  const event = {
    event_name: brand.capiEventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.paymentId,
    action_source: 'website',
    user_data: {
      em: [hashedEmail],
      ...(hashedPhone && { ph: [hashedPhone] }),
      ...(params.fbc && { fbc: params.fbc }),
      ...(params.fbp && { fbp: params.fbp }),
      ...(params.clientUserAgent && { client_user_agent: params.clientUserAgent }),
      ...(params.clientIp && { client_ip_address: params.clientIp }),
    },
    custom_data: {
      currency: brand.capiCurrency,
      value: pricing.inr,
      payment_id: params.paymentId,
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/v25.0/${params.pixelId}/events?access_token=${params.accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
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
      orderId, paymentId, signature, customer, utm,
    }: {
      orderId: string;
      paymentId: string;
      signature: string;
      customer: CustomerData;
      utm: UtmData;
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

    // ✅ Signature verified — build Pabbly payload
    const now = new Date();
    const pabblyPayload = {
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
      amount:            pricing.amountString,
      currency:          pricing.currency,
      payment_date:      now.toLocaleDateString('en-IN', { timeZone: brand.paymentTimezone }),
      payment_time:      now.toLocaleTimeString('en-IN', { timeZone: brand.paymentTimezone }),
      payment_timestamp: now.toISOString(),
      utm_source:        utm?.source   ?? '',
      utm_medium:        utm?.medium   ?? '',
      utm_campaign:      utm?.campaign ?? '',
      utm_content:       utm?.content  ?? '',
      utm_term:          utm?.term     ?? '',
    };

    console.log('[verify-payment] Verified purchase:', { paymentId, email: customer.email });

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
      const fbc = req.cookies.get('_fbc')?.value;
      const fbp = req.cookies.get('_fbp')?.value;
      const clientIp =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        req.headers.get('x-real-ip') ??
        undefined;
      const clientUserAgent = req.headers.get('user-agent') ?? undefined;
      const fullPhone = `${customer.dialCode}${customer.phone}`;
      try {
        await sendMetaCapiEvent({
          pixelId: metaPixelId,
          accessToken: metaAccessToken,
          paymentId,
          email: customer.email,
          phone: fullPhone,
          fbc, fbp, clientIp, clientUserAgent,
        });
        console.log('[verify-payment] Meta CAPI event sent');
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
