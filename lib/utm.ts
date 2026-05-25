'use client';

import { brand } from './config';

// Stores EVERY landing-URL query param in sessionStorage under brand.utmSessionKey
// so that landing → checkout → thank-you keeps the full attribution context
// intact: utm_*, fbclid, gclid, gad_source, ttclid, msclkid, custom partner
// IDs, A/B test flags, anything ad networks tack on. Pabbly + CAPI keep
// reading the 5 standard UTM keys via restoreUtm() for schema stability.

const KEY = brand.utmSessionKey;

export type LandingParams = Record<string, string>;

export interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

// Capture the current URL's full param set. Writes only when at least one
// param is present so a clean reload of /, /hi, /mar with no query string
// doesn't clobber a prior capture in the same tab.
export function captureLandingParams(searchParams: URLSearchParams): LandingParams {
  const params: LandingParams = {};
  searchParams.forEach((value, key) => {
    if (value) params[key] = value;
  });
  if (Object.keys(params).length > 0 && typeof window !== 'undefined') {
    try { sessionStorage.setItem(KEY, JSON.stringify(params)); } catch { /* noop */ }
  }
  return params;
}

export function restoreLandingParams(): LandingParams {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LandingParams) : {};
  } catch {
    return {};
  }
}

// Subset extraction for the Pabbly webhook — keeps the existing schema
// (utm_source/medium/campaign/content/term as named fields) regardless of
// how many extra keys the full param bag carries.
export function restoreUtm(): UtmData {
  const all = restoreLandingParams();
  return {
    source:   all.utm_source,
    medium:   all.utm_medium,
    campaign: all.utm_campaign,
    content:  all.utm_content,
    term:     all.utm_term,
  };
}

// Back-compat alias — older call sites (LandingClient, CheckoutForm) used
// captureUtm. The function now captures all params; the name is preserved
// so existing imports keep working.
export const captureUtm = captureLandingParams;
