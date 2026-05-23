'use client';

import { useEffect } from 'react';
import { reapplyMamFromCookie } from '@/lib/analytics';

// /thank-you is reached via client-side router.push() from CheckoutForm,
// so the inline pixel script in app/layout.tsx (afterInteractive) doesn't
// re-execute. We do two things on mount:
//   1. Reapply MAM from the fm4_mam cookie so this PageView ships with
//      the full hashed identity (em, ph, fn, ln, ct, country, external_id).
//   2. Fire fbq('track', 'PageView') manually so Meta sees the conversion
//      landing as its own browser-side event (not just the prior /checkout
//      PageView). fbq is undefined when pricing.client.trackingEnabled is
//      false (₹1 test mode), so both calls no-op naturally in that case.
//
// No browser-side Purchase event is ever fired — the conversion signal
// comes exclusively from server CAPI (see /api/razorpay/verify-payment),
// which ships Purchase + sales with EMQ 9.5+ via SHA-256 customer info.
export default function ThankYouTracker() {
  useEffect(() => {
    reapplyMamFromCookie();
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, []);

  return null;
}
