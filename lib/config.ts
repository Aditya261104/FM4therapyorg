// =====================================================================
// FM4 Therapy — single source of truth for pricing & brand strings.
// PRICE_INR drives Razorpay (paise), Pabbly (string), CAPI (numeric)
// and every price displayed in the UI.
// =====================================================================

const SERVER_PRICE = parseInt(process.env.PRICE_INR || '97', 10);
const SERVER_ORIGINAL = parseInt(process.env.ORIGINAL_PRICE_INR || '499', 10);

// Client-side reads NEXT_PUBLIC_* (Next.js inlines these at build time)
const CLIENT_PRICE = parseInt(
  process.env.NEXT_PUBLIC_PRICE_INR || process.env.PRICE_INR || '97',
  10
);
const CLIENT_ORIGINAL = parseInt(
  process.env.NEXT_PUBLIC_ORIGINAL_PRICE_INR ||
    process.env.ORIGINAL_PRICE_INR ||
    '499',
  10
);

export const pricing = {
  // Server-only price math
  inr: SERVER_PRICE,
  originalInr: SERVER_ORIGINAL,
  paise: SERVER_PRICE * 100,
  amountString: String(SERVER_PRICE),
  savings: SERVER_ORIGINAL - SERVER_PRICE,
  currency: 'INR',

  // Master kill-switch for ALL ad-platform / automation events.
  // Set PRICE_INR=1 in the test environment (Vercel preview) → no Meta
  // Pixel script renders, no CAPI fires, no Pabbly webhook from real
  // payments. Set PRICE_INR=97 in production → everything fires.
  // Same gate mirrored on the client via NEXT_PUBLIC_PRICE_INR.
  trackingEnabled: SERVER_PRICE > 1,

  // Mirror values for the client bundle
  client: {
    inr: CLIENT_PRICE,
    originalInr: CLIENT_ORIGINAL,
    savings: CLIENT_ORIGINAL - CLIENT_PRICE,
    paise: CLIENT_PRICE * 100,
    currency: 'INR' as const,
    trackingEnabled: CLIENT_PRICE > 1,
  },
};

// ── Workshop schedule — every date/time string on the site reads from here.
// Override any of these via .env (NEXT_PUBLIC_WORKSHOP_*) without touching code.
export const schedule = {
  /** Used on the Date info card across /, /hi, /mar (e.g. "16th, 17th May"). */
  dateRange:
    process.env.NEXT_PUBLIC_WORKSHOP_DATE_RANGE || '16th, 17th May',
  /** Time info card — Day 1 line (e.g. "16th – 8:00 PM"). Also reused in checkout. */
  day1:
    process.env.NEXT_PUBLIC_WORKSHOP_DAY1 || '16th – 8:00 PM',
  /** Time info card — Day 2 line (e.g. "17th – 10:00 AM"). Also reused in checkout. */
  day2:
    process.env.NEXT_PUBLIC_WORKSHOP_DAY2 || '17th – 10:00 AM',
  /** Sentence form used in FAQ answers across all 3 languages (e.g. "16th and 17th May"). */
  faqDates:
    process.env.NEXT_PUBLIC_WORKSHOP_FAQ_DATES || '16th and 17th May',
  /** Sign-off line at the bottom of the Thank You page (e.g. "See you LIVE on 16th May at 8:00 PM"). */
  thankYouSignoff:
    process.env.NEXT_PUBLIC_WORKSHOP_SIGNOFF || 'See you LIVE on 16th May at 8:00 PM',
  /** Compact event line used by Razorpay modal + cross-funnel surfaces. */
  eventLine:
    process.env.NEXT_PUBLIC_WORKSHOP_EVENT_LINE ||
    '16th & 17th May · 8 PM / 10 AM IST',
  /** Shorter date span used in the Razorpay modal description. */
  modalDateSpan:
    process.env.NEXT_PUBLIC_WORKSHOP_MODAL_DATES || '16th–17th May',
};

// All brand / copy strings live here so editing one field updates the whole site.
export const brand = {
  name: 'FM4 Therapy',
  short: 'FM4',
  productName: 'Pain Free with FM4 Workshop',
  eventLine: schedule.eventLine,
  modalName: 'FM4 Therapy',
  modalDescription: `Pain Free with FM4 Workshop · ${schedule.modalDateSpan}`,
  themeColor: '#00984B',
  coach: {
    name: 'Sourobh Kulkorni',
    initial: 'S',
    subtitle: 'Your coach for this workshop',
  },
  guarantee: '100% Money Back Guarantee — Zero Risk',
  capiCurrency: 'INR',
  paymentTimezone: 'Asia/Kolkata',
  thankYouPath: '/thank-you',
  funnelSlug: 'fm4-workshop',
  utmSessionKey: 'fm4_utm',
  email: 'sourobhkulkorni@gmail.com',
  ownerLegalName: 'Fitness Master',
  address:
    'Plot no. 19, Kanchanganga Society Rd, opposite kalyan bhel, part 2, Bibwewadi, Pune, Maharashtra 411037',
  trustBadges: ['🔒 Razorpay Secured', 'SSL Encrypted', '100% Money Back'],
  valueBullets: [
    '2-Day Live Workshop with Sourobh Kulkorni',
    'Personalized FM4 Therapy pain assessment',
    'Replay + WhatsApp community access · Hindi & English',
  ],
  // Public env-derived values
  whatsappUrl:
    process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://chat.whatsapp.com/',
};

// Submit button label, dynamically renders with current price
export function submitButtonLabel(): string {
  return `Place Your Order — ₹${pricing.client.inr}`;
}

// Save badge text
export function saveBadgeText(): string {
  return `SAVE ₹${pricing.client.savings}`;
}
