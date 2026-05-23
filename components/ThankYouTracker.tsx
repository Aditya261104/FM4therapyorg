'use client';

import { useEffect } from 'react';
import { pricing } from '@/lib/config';

// Fires the client-side Pixel Purchase event on the thank-you page.
// The eventID is the Razorpay paymentId (passed via ?p=...) so it dedupes with
// the server-side CAPI event of the same name + id. The test-coupon path uses
// a `tgotest_*` payment_id; we skip firing for those so QA runs don't pollute
// production conversion counts.
export default function ThankYouTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const paymentId = sp.get('p') ?? '';
      if (!paymentId) return;
      if (paymentId.startsWith('tgotest_')) return;

      const w = window as unknown as {
        fbq?: (
          cmd: string,
          event: string,
          data?: Record<string, unknown>,
          opts?: { eventID?: string }
        ) => void;
      };
      if (typeof w.fbq === 'function') {
        w.fbq(
          'track',
          'Purchase',
          { currency: pricing.client.currency, value: pricing.client.inr },
          { eventID: paymentId }
        );
      }
    } catch {
      /* noop */
    }
  }, []);

  return null;
}
