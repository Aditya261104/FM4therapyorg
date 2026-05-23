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

  // Mirror values for the client bundle
  client: {
    inr: CLIENT_PRICE,
    originalInr: CLIENT_ORIGINAL,
    savings: CLIENT_ORIGINAL - CLIENT_PRICE,
    paise: CLIENT_PRICE * 100,
    currency: 'INR' as const,
  },
};

// All brand / copy strings live here so editing one field updates the whole site.
export const brand = {
  name: 'FM4 Therapy',
  short: 'FM4',
  productName: 'Pain Free with FM4 Workshop',
  eventLine: '16th & 17th May · 8 PM / 10 AM IST',
  modalName: 'FM4 Therapy',
  modalDescription: 'Pain Free with FM4 Workshop · 16th–17th May',
  themeColor: '#00984B',
  coach: {
    name: 'Sourobh Kulkorni',
    initial: 'S',
    subtitle: 'Your coach for this workshop',
  },
  guarantee: '🛡 100% Money Back Guarantee — Zero Risk',
  capiEventName: 'Workshop Purchase',
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
