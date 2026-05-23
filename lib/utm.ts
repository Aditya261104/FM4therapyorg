'use client';

import { brand } from './config';

export interface UtmData {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

const KEY = brand.utmSessionKey;

export function captureUtm(searchParams: URLSearchParams): UtmData {
  const utm: UtmData = {
    source:   searchParams.get('utm_source')   ?? undefined,
    medium:   searchParams.get('utm_medium')   ?? undefined,
    campaign: searchParams.get('utm_campaign') ?? undefined,
    content:  searchParams.get('utm_content')  ?? undefined,
    term:     searchParams.get('utm_term')     ?? undefined,
  };
  const hasAny = Object.values(utm).some(Boolean);
  if (hasAny && typeof window !== 'undefined') {
    try { sessionStorage.setItem(KEY, JSON.stringify(utm)); } catch { /* noop */ }
  }
  return utm;
}

export function restoreUtm(): UtmData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UtmData) : {};
  } catch {
    return {};
  }
}
