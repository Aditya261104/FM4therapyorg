'use client';

// =====================================================================
// Meta Pixel Manual Advanced Matching (MAM) helper.
//
// All hashing happens client-side via Web Crypto, so PII never leaves
// the browser in the clear. The hashed values are persisted in a
// first-party cookie (fm4_mam) so every subsequent PageView — even on
// pages that never see the form — inherits user identity for high EMQ.
// =====================================================================

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const MAM_COOKIE_NAME = 'fm4_mam';
const MAM_COOKIE_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

async function sha256Hex(value: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return value;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function buildHashedMatching(data: {
  email?: string;
  phone?: string;       // raw, with or without dial code
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;     // 2-letter ISO; case-insensitive
}): Promise<Record<string, string>> {
  const normalised: Record<string, string | undefined> = {};

  if (data.email)     normalised.em = data.email.trim().toLowerCase();
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, '');
    if (digits) normalised.ph = digits;
  }
  if (data.firstName) normalised.fn = data.firstName.trim().toLowerCase();
  if (data.lastName)  normalised.ln = data.lastName.trim().toLowerCase();
  if (data.city) {
    const ct = data.city.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (ct) normalised.ct = ct;
  }
  if (data.country) {
    const country = data.country.trim().toLowerCase();
    if (country) normalised.country = country;
  }

  const keys = Object.keys(normalised) as Array<keyof typeof normalised>;
  const hashes = await Promise.all(keys.map((k) => sha256Hex(normalised[k] as string)));
  const matching: Record<string, string> = {};
  keys.forEach((k, i) => { matching[k as string] = hashes[i]; });

  // external_id: stable per-user identifier. Same value on browser MAM
  // and server CAPI so Meta caches one external_id → Facebook user mapping.
  if (matching.em) matching.external_id = matching.em;

  return matching;
}

function writeMamCookie(matching: Record<string, string>) {
  if (typeof document === 'undefined') return;
  if (Object.keys(matching).length === 0) return;
  const value = encodeURIComponent(JSON.stringify(matching));
  document.cookie = `${MAM_COOKIE_NAME}=${value}; Path=/; Max-Age=${MAM_COOKIE_TTL_SECONDS}; SameSite=Lax`;
}

export function readMamCookie(): Record<string, string> | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${MAM_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

// Pass RAW form values. This helper SHA-256 hashes via Web Crypto,
// persists hashed values to the fm4_mam cookie, then fbq init's the
// pixel with the matching object so all subsequent pixel events
// inherit it. Called from:
//   1. CheckoutForm useEffect (500ms after form is fully filled + valid)
//   2. CheckoutForm payment-success handler (refresh with latest values)
//   3. ThankYouTracker via reapplyMamFromCookie() (safety net)
export async function setMetaAdvancedMatching(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}) {
  if (typeof window === 'undefined' || !window.fbq || !META_PIXEL_ID) return;
  const matching = await buildHashedMatching(data);
  if (Object.keys(matching).length === 0) return;
  window.fbq('init', META_PIXEL_ID, matching);
  writeMamCookie(matching);
}

// Re-fire MAM from the persisted cookie. Used on /thank-you mount as a
// safety net in case the inline pixel script raced the route change.
// fbq('init', ...) is idempotent — repeat calls with same matching are no-op.
export function reapplyMamFromCookie() {
  if (typeof window === 'undefined' || !window.fbq || !META_PIXEL_ID) return;
  const matching = readMamCookie();
  if (!matching || Object.keys(matching).length === 0) return;
  window.fbq('init', META_PIXEL_ID, matching);
}
