// Country list for the phone country-code picker.
// Do not modify — this is fixed infrastructure, not client content.

export interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India',          dial: '+91',  flag: '🇮🇳' },
  { code: 'US', name: 'United States',  dial: '+1',   flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44',  flag: '🇬🇧' },
  { code: 'AU', name: 'Australia',      dial: '+61',  flag: '🇦🇺' },
  { code: 'CA', name: 'Canada',         dial: '+1',   flag: '🇨🇦' },
  { code: 'SG', name: 'Singapore',      dial: '+65',  flag: '🇸🇬' },
  { code: 'AE', name: 'UAE',            dial: '+971', flag: '🇦🇪' },
  { code: 'NZ', name: 'New Zealand',    dial: '+64',  flag: '🇳🇿' },
  { code: 'DE', name: 'Germany',        dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', name: 'France',         dial: '+33',  flag: '🇫🇷' },
  { code: 'NL', name: 'Netherlands',    dial: '+31',  flag: '🇳🇱' },
  { code: 'ZA', name: 'South Africa',   dial: '+27',  flag: '🇿🇦' },
  { code: 'MY', name: 'Malaysia',       dial: '+60',  flag: '🇲🇾' },
  { code: 'JP', name: 'Japan',          dial: '+81',  flag: '🇯🇵' },
  { code: 'NG', name: 'Nigeria',        dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya',          dial: '+254', flag: '🇰🇪' },
  { code: 'CH', name: 'Switzerland',    dial: '+41',  flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden',         dial: '+46',  flag: '🇸🇪' },
  { code: 'NO', name: 'Norway',         dial: '+47',  flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark',        dial: '+45',  flag: '🇩🇰' },
  { code: 'PH', name: 'Philippines',    dial: '+63',  flag: '🇵🇭' },
  { code: 'BD', name: 'Bangladesh',     dial: '+880', flag: '🇧🇩' },
  { code: 'PK', name: 'Pakistan',       dial: '+92',  flag: '🇵🇰' },
  { code: 'LK', name: 'Sri Lanka',      dial: '+94',  flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal',          dial: '+977', flag: '🇳🇵' },
];
