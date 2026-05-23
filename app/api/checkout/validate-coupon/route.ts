import { NextRequest, NextResponse } from 'next/server';

// Validates a checkout coupon code against CHECKOUT_COUPON_CODE (server-only env).
// Currently the only supported coupon gives 100% off and bypasses Razorpay so the
// rest of the funnel (Pabbly webhook → thank-you redirect) can be QA-tested without
// taking real money. Match is case-insensitive and tolerant of stray whitespace.
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json().catch(() => ({ code: '' }));
    const expected = process.env.CHECKOUT_COUPON_CODE?.trim();
    if (!expected) {
      return NextResponse.json({ valid: false, reason: 'disabled' });
    }
    const submitted = typeof code === 'string' ? code.trim() : '';
    if (submitted && submitted.toLowerCase() === expected.toLowerCase()) {
      return NextResponse.json({ valid: true, percentOff: 100 });
    }
    return NextResponse.json({ valid: false, reason: 'invalid' });
  } catch (err) {
    console.error('[validate-coupon]', err);
    return NextResponse.json({ valid: false, reason: 'error' }, { status: 500 });
  }
}
