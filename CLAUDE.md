# CLAUDE.md — FM4 Therapy India

> **⚠️ Do not give any output until you are 90% confident yourself.**
> Read this file end-to-end before answering. If something is ambiguous, re-read the referenced source files instead of guessing.

---

## 1. Client / Product Brief

**Brand:** FM4 Therapy (legal entity "Fitness Master", Pune, Maharashtra). Coach **Sourobh Kulkorni** runs a 2-day live workshop — *"Pain Free with FM4 Workshop"* (Hindi & English) — teaching people to overcome **spine, knee, and neck pain** without medicines, surgery, physio, chiro or oil massages.

**Offer:** ₹97 (anchored against ₹499, "81% OFF"), live 2-day workshop + WhatsApp community access + replay. Target audience: busy professionals, entrepreneurs, and their parents (60+ pain sufferers). 100% money-back guarantee.

**Funnel:** single-product paid-traffic funnel.
1. **Landing page** (`/`) → long-form VSL + reviews + scarcity (animated seat counter starts at 115).
2. **Checkout** (`/product-checkout`) → form (name, email, city, phone+country, "for myself / loved one") → Razorpay modal OR free-coupon bypass for QA.
3. **Thank-you** (`/thank-you?p=<paymentId>`) → fires Pixel Purchase, prompts WhatsApp community join.

UTMs are captured on first landing (sessionStorage `fm4_utm`) and forwarded through to Razorpay verify → Pabbly webhook. Conversions ping **GA4, Meta Pixel (client) + Meta CAPI (server, dedup'd by `paymentId`), Microsoft Clarity, Pabbly Connect** (for Google Sheets / email automation).

---

## 2. Tech Stack

- **Next.js 15** (App Router, RSC) + **React 19 RC** + **TypeScript 5.6 (strict)**
- **Razorpay** (`razorpay` Node SDK + `checkout.razorpay.com/v1/checkout.js` modal)
- **libphonenumber-js** for international phone validation
- Styling: a single hand-written `app/globals.css` (~67 KB, no Tailwind/CSS-modules)
- Path alias `@/*` → repo root (see `tsconfig.json`)
- No DB. No auth. All side-effects are outbound webhooks/APIs.
- Tracking scripts (GA4, Clarity, Meta Pixel) loaded in `app/layout.tsx` and gated on env presence.

---

## 3. Architecture (one-glance)

```
Browser ──► Landing (/) ──► /product-checkout ──► POST /api/razorpay/create-order ──► Razorpay
                                  │                                                       │
                                  │                                                       ▼
                                  │                                            Razorpay Checkout Modal
                                  │                                                       │
                                  ▼                                                       ▼
                          (coupon path)                                    POST /api/razorpay/verify-payment
                          POST /api/checkout/                                              │
                          validate-coupon                                                  │
                                  │                                                       ▼
                                  ▼                                            HMAC verify ─► Pabbly webhook
                          POST /api/checkout/                                                 + Meta CAPI
                          free-order                                                          │
                                  │                                                           ▼
                                  └──────────────────► /thank-you?p=<paymentId> (Pixel Purchase fires)
```

- **No server state.** Each API route is independent. Coupon path generates synthetic `tgotest_*` payment_ids so QA flows don't pollute conversion metrics.
- **Single source of truth:** [lib/config.ts](lib/config.ts) — every price, brand string, WhatsApp URL, timezone, event name lives here. **Change `PRICE_INR` once and the whole site updates.**

---

## 4. File Map (routes to the important things)

### Pages (App Router)
- [app/layout.tsx](app/layout.tsx) — root HTML, fonts, Razorpay SDK script, GA4 / Clarity / Meta Pixel base injection.
- [app/page.tsx](app/page.tsx) — landing page (long, ~26 KB JSX: hero, video tiles, reviews, instructor slider, curriculum timeline, sticky CTA).
- [app/product-checkout/page.tsx](app/product-checkout/page.tsx) — wraps `<CheckoutForm/>`.
- [app/thank-you/page.tsx](app/thank-you/page.tsx) — success screen + WhatsApp CTA + `<ThankYouTracker/>` (fires Pixel `Purchase`).
- [app/privacy-policy/](app/privacy-policy/), [app/terms-conditions/](app/terms-conditions/), [app/refund-policy/](app/refund-policy/) — static legal pages.

### API routes (server)
- [app/api/razorpay/create-order/route.ts](app/api/razorpay/create-order/route.ts) — POST: creates Razorpay order, returns `{orderId, amount, currency, keyId}`. Uses server `RAZORPAY_KEY_ID/SECRET`.
- [app/api/razorpay/verify-payment/route.ts](app/api/razorpay/verify-payment/route.ts) — POST: HMAC-SHA256 verify (`orderId|paymentId` w/ `RAZORPAY_KEY_SECRET`), then fires **Pabbly webhook** (with customer + UTM) and optional **Meta CAPI** event (deduped by `paymentId` against client Pixel).
- [app/api/checkout/validate-coupon/route.ts](app/api/checkout/validate-coupon/route.ts) — POST: case-insensitive match against `CHECKOUT_COUPON_CODE`. Returns `{valid, percentOff: 100}`.
- [app/api/checkout/free-order/route.ts](app/api/checkout/free-order/route.ts) — POST: coupon path. Bypasses Razorpay, mints `tgotest_*` payment_id, fires Pabbly with `is_test=yes`. **Does NOT fire Meta CAPI** (intentional — keeps test events out of conversion metrics).

### Components
- [components/LandingClient.tsx](components/LandingClient.tsx) — `'use client'`. All landing-page DOM behavior: stat counters, scroll reveal, seat scarcity (localStorage `fm4_seats`, decrements every 60 s), instructor slider, Vimeo modal, timeline progress, sticky CTA, Vimeo unmute. UTM capture on first landing.
- [components/CheckoutForm.tsx](components/CheckoutForm.tsx) — `'use client'`. Form state + validation (`libphonenumber-js`), coupon application, Razorpay modal launch, post-payment redirect to `/thank-you?p=<id>`.
- [components/Footer.tsx](components/Footer.tsx) — shared footer.
- [components/ThankYouTracker.tsx](components/ThankYouTracker.tsx) — `'use client'`. Fires `fbq('track','Purchase', …, {eventID: paymentId})`. Skips `tgotest_*` ids.

### Lib
- [lib/config.ts](lib/config.ts) — `pricing` + `brand` (the single config you edit).
- [lib/countries.ts](lib/countries.ts) — country list w/ dial codes for the phone picker.
- [lib/utm.ts](lib/utm.ts) — `captureUtm` / `restoreUtm` (sessionStorage key `fm4_utm`).

### Public assets
- [public/Images%20Sourabh/](public/Images%20Sourabh/) — all hero / testimonial / instructor images (note the literal space in the folder name; URLs use `%20`).

---

## 5. Environment Variables (see `.env.example`)

Server-only: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `PRICE_INR`, `ORIGINAL_PRICE_INR`, `PABBLY_WEBHOOK_URL`, `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `CHECKOUT_COUPON_CODE` (QA bypass, e.g. `tgotest2025`).

Public (inlined into the client bundle, prefix `NEXT_PUBLIC_`): `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `NEXT_PUBLIC_PRICE_INR`, `NEXT_PUBLIC_ORIGINAL_PRICE_INR`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_WHATSAPP_URL`.

Copy `.env.example` → `.env.local` and fill in real values. Missing analytics keys are gracefully skipped (no crash).

---

## 6. Running Locally

```bash
npm install      # already done
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

Razorpay/webhooks/CAPI all fail-soft if env vars are missing — the UI still renders. To exercise the full funnel without a real payment, set `CHECKOUT_COUPON_CODE` and apply that coupon on `/product-checkout`.

---

## 7. Gotchas

- **React 19 RC** is pinned — don't naively bump it; `@types/react` is still on 18 by design.
- The image folder is literally `public/Images Sourabh/` (space). Always reference as `/Images%20Sourabh/...`.
- `paymentId` starting with `tgotest_` = coupon test order. Pixel/CAPI must skip these (already enforced in [ThankYouTracker.tsx](components/ThankYouTracker.tsx) and [free-order/route.ts](app/api/checkout/free-order/route.ts)).
- Seat scarcity counter is **fake** (decremental in localStorage). Don't wire it to anything real.
- Pabbly webhook is fire-and-forget — errors are logged but never returned to the user. Same for Meta CAPI.
- Edit prices in **one place only**: `PRICE_INR` / `ORIGINAL_PRICE_INR` env vars (mirrored to `NEXT_PUBLIC_*`). [lib/config.ts](lib/config.ts) handles the rest.
