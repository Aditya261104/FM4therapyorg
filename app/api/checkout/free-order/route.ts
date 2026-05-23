import { NextRequest, NextResponse } from 'next/server';
import { brand, pricing } from '@/lib/config';

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  countryCode: string;
  dialCode: string;
  customerType: string;
}

interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

// Used when a 100%-off coupon (CHECKOUT_COUPON_CODE) is applied on checkout.
// Razorpay can't process ₹0 orders so we skip it entirely, generate a synthetic
// payment_id, and still fire the Pabbly webhook so the QA flow lands in sheets
// with is_test=yes and coupon_code set — easy to filter out from real revenue.
// Meta CAPI is intentionally NOT fired here to avoid polluting production
// conversion metrics with test events.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { couponCode, customer, utm } = body as {
      couponCode: string;
      customer: CustomerData;
      utm: UtmData;
    };

    const expected = process.env.CHECKOUT_COUPON_CODE?.trim();
    if (!expected) {
      return NextResponse.json(
        { success: false, error: 'Coupons are disabled.' },
        { status: 400 }
      );
    }
    if (
      typeof couponCode !== 'string' ||
      couponCode.trim().toLowerCase() !== expected.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon.' },
        { status: 400 }
      );
    }
    if (!customer?.email || !customer?.firstName) {
      return NextResponse.json(
        { success: false, error: 'Missing customer details.' },
        { status: 400 }
      );
    }

    const paymentId = `tgotest_${Date.now()}`;
    const orderId = `coupon_${Date.now()}`;

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
      amount:            '0',
      currency:          pricing.currency,
      coupon_code:       couponCode.trim(),
      is_test:           'yes',
      payment_date:      now.toLocaleDateString('en-IN', { timeZone: brand.paymentTimezone }),
      payment_time:      now.toLocaleTimeString('en-IN', { timeZone: brand.paymentTimezone }),
      payment_timestamp: now.toISOString(),
      utm_source:        utm?.source   ?? '',
      utm_medium:        utm?.medium   ?? '',
      utm_campaign:      utm?.campaign ?? '',
      utm_content:       utm?.content  ?? '',
      utm_term:          utm?.term     ?? '',
    };

    console.log('[free-order] Test purchase via coupon:', { paymentId, email: customer.email });

    const webhookUrl = process.env.PABBLY_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pabblyPayload),
        });
        if (webhookResponse.ok) {
          console.log('[free-order] Pabbly webhook ok:', webhookResponse.status);
        } else {
          console.error('[free-order] Pabbly webhook failed:', webhookResponse.status);
        }
      } catch (err) {
        console.error('[free-order] Pabbly webhook error:', err);
      }
    } else {
      console.warn('[free-order] PABBLY_WEBHOOK_URL not set — webhook skipped');
    }

    return NextResponse.json({ success: true, paymentId });
  } catch (err) {
    console.error('[free-order]', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
