'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { COUNTRIES, type Country } from '@/lib/countries';
import { captureLandingParams, restoreLandingParams, restoreUtm, type UtmData } from '@/lib/utm';
import { brand, pricing, schedule, submitButtonLabel, saveBadgeText } from '@/lib/config';
import { setMetaAdvancedMatching } from '@/lib/analytics';

// ── Types ───────────────────────────────────────────────────────────
interface FormFields {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  customerType: string; // 'Myself' | 'Loved One'
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  phone?: string;
  customerType?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance { open: () => void; }
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ── Validation ──────────────────────────────────────────────────────
const NAME_RE  = /^[a-zA-Z\s\-'.]{2,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateFields(fields: FormFields, countryCode: string): FormErrors {
  const errors: FormErrors = {};

  if (!fields.firstName.trim())                   errors.firstName = 'First name is required.';
  else if (!NAME_RE.test(fields.firstName.trim())) errors.firstName = 'Letters, spaces, and hyphens only.';

  if (!fields.lastName.trim())                    errors.lastName = 'Last name is required.';
  else if (!NAME_RE.test(fields.lastName.trim())) errors.lastName = 'Letters, spaces, and hyphens only.';

  if (!fields.email.trim())                       errors.email = 'Email address is required.';
  else if (!EMAIL_RE.test(fields.email.trim()))   errors.email = 'Enter a valid email address.';

  if (!fields.city.trim())                        errors.city = 'City is required.';
  else if (fields.city.trim().length < 2)         errors.city = 'Enter your city name.';

  if (!fields.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      try {
        const full = `${country.dial}${fields.phone.trim()}`;
        const valid = isValidPhoneNumber(full, countryCode as Parameters<typeof isValidPhoneNumber>[1]);
        if (!valid) errors.phone = `Invalid number for ${country.name}.`;
      } catch {
        errors.phone = 'Enter a valid phone number.';
      }
    }
  }

  if (!fields.customerType) errors.customerType = 'Please select an option.';

  return errors;
}

// ── Phone Input sub-component ───────────────────────────────────────
function CheckoutPhoneInput({
  value, countryCode, onValueChange, onCountryChange, error, touched, onBlur,
}: {
  value: string;
  countryCode: string;
  onValueChange: (v: string) => void;
  onCountryChange: (code: string) => void;
  error?: string;
  touched: boolean;
  onBlur: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find(c => c.code === countryCode) ?? COUNTRIES[0];
  const filtered = search.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const hasError = touched && !!error;

  return (
    <div ref={wrapRef} className={`phone-input${hasError ? ' input-error' : ''}`}>
      <button
        type="button"
        className="phone-input__cc"
        onClick={() => setOpen(o => !o)}
        aria-label="Select country code"
        aria-expanded={open}
      >
        <span className="phone-input__cc-flag">{selected.flag}</span>
        <span className="phone-input__cc-dial">{selected.dial}</span>
        <span className={`phone-input__chev${open ? ' is-open' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <input
        ref={inputRef}
        type="tel"
        placeholder={countryCode === 'IN' ? '9876543210' : 'Phone number'}
        value={value}
        onChange={e => onValueChange(e.target.value.replace(/\D/g, ''))}
        onBlur={onBlur}
        inputMode="numeric"
        autoComplete="tel-national"
        aria-label="Phone number"
        maxLength={15}
      />

      {open && (
        <div className="phone-dropdown">
          <div className="phone-dropdown__search">
            <input
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              aria-label="Search country"
            />
          </div>
          <div className="phone-dropdown__list" role="listbox">
            {filtered.map(c => (
              <div
                key={c.code}
                role="option"
                aria-selected={c.code === countryCode}
                className={`phone-dropdown__opt${c.code === countryCode ? ' is-selected' : ''}`}
                onClick={() => {
                  onCountryChange(c.code);
                  setOpen(false);
                  setSearch('');
                  inputRef.current?.focus();
                }}
              >
                <span>{c.flag}</span>
                <span className="phone-dropdown__opt-name">{c.name}</span>
                <span className="phone-dropdown__opt-dial">{c.dial}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="phone-dropdown__empty">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mobile order-summary accordion ──────────────────────────────────
function MobileSummary({ finalInr, discountInr }: { finalInr: number; discountInr: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`summary-card summary-card--mobile${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="summary-card__toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="mobileSummaryBody"
      >
        <span className="summary-card__toggle-left">
          <span className="summary-card__toggle-label">Program Details</span>
          <span className="summary-card__toggle-meta">{open ? 'Tap to close' : 'Tap to view'}</span>
        </span>
        <span className="summary-card__toggle-right">
          <strong>₹{finalInr}.00</strong>
          <span className={`summary-card__toggle-icon${open ? ' is-open' : ''}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </span>
      </button>
      {/* Body is ALWAYS rendered — CSS show/hides it based on `.is-open` class */}
      <div id="mobileSummaryBody">
        <SummaryBody finalInr={finalInr} discountInr={discountInr} />
      </div>
    </div>
  );
}

function SummaryBody({ finalInr, discountInr }: { finalInr: number; discountInr: number }) {
  return (
    <div className="summary-card__body">
      <h3>Your Order</h3>
      <div className="summary__row">
        <div className="summary__item">
          <span className="summary__qty">1</span>
          <span className="summary__item-name">{brand.productName}</span>
        </div>
        <strong>
          <s className="price-old">₹{pricing.client.originalInr}</s>{' '}
          <span className="price-new">₹{pricing.client.inr}.00</span>
        </strong>
      </div>
      <div className="summary__row"><span>Subtotal</span><strong>₹{pricing.client.inr}.00</strong></div>
      {discountInr > 0 && (
        <div className="summary__row" style={{ color: 'var(--c-primary-d)' }}>
          <span>Coupon discount</span>
          <strong>−₹{discountInr}.00</strong>
        </div>
      )}
      <div className="summary__row summary__row--total"><span>Total</span><span>₹{finalInr}.00</span></div>

      <div className="schedule-card">
        <div className="schedule-card__head">Workshop Schedule</div>
        <p><strong>Day 1</strong> – {schedule.day1}</p>
        <p><strong>Day 2</strong> – {schedule.day2}</p>
        <p>Language: Hindi &amp; English</p>
      </div>

      <ul className="value-list">
        {brand.valueBullets.map(b => (
          <li key={b}><span>✓</span>{b}</li>
        ))}
      </ul>

      <p className="guarantee-line">{brand.guarantee}</p>

      <div className="coach-card">
        <div className="coach-card__avatar">{brand.coach.initial}</div>
        <div>
          <strong>{brand.coach.name}</strong>
          <small>{brand.coach.subtitle}</small>
        </div>
      </div>
    </div>
  );
}

// ── Main CheckoutForm ───────────────────────────────────────────────
export default function CheckoutForm() {
  const router = useRouter();

  const [fields, setFields] = useState<FormFields>({
    firstName: '', lastName: '', email: '', city: '', phone: '', customerType: '',
  });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormFields, boolean>>({
    firstName: false, lastName: false, email: false, city: false, phone: false, customerType: false,
  });
  const [countryCode, setCountryCode] = useState('IN');
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Coupon state. couponPercent === 100 means "skip Razorpay" path.
  const [couponOpen, setCouponOpen]       = useState(false);
  const [couponInput, setCouponInput]     = useState('');
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponPercent, setCouponPercent] = useState(0);
  const [couponMsg, setCouponMsg]         = useState<{ ok: boolean; text: string } | null>(null);
  const [couponBusy, setCouponBusy]       = useState(false);

  const discountInr = couponPercent > 0
    ? Math.round((pricing.client.inr * couponPercent) / 100)
    : 0;
  const finalInr = Math.max(0, pricing.client.inr - discountInr);
  const isFree = couponPercent === 100;

  useEffect(() => {
    // Capture EVERY URL param on landing (or arriving direct at /checkout) so
    // the full attribution context — utm_*, fbclid, gclid, gad_source, custom
    // ad-network params, A/B flags — is preserved through the funnel and
    // forwarded into /thank-you after a successful payment.
    captureLandingParams(new URLSearchParams(window.location.search));
  }, []);

  // Fire MAM as soon as the form is fully filled + valid, independent of
  // whether the user pays. Identifies any subsequent PageView and persists
  // the hashed identity to the fm4_mam cookie for cross-page inheritance.
  // Debounced 500ms so we don't refire on every keystroke.
  useEffect(() => {
    const allFilled =
      fields.firstName.trim() &&
      fields.lastName.trim() &&
      fields.email.trim() &&
      fields.city.trim() &&
      fields.phone.trim();
    if (!allFilled) return;
    const currentErrors = validateFields(fields, countryCode);
    if (Object.keys(currentErrors).length > 0) return;
    const selected = COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];
    const timer = setTimeout(() => {
      void setMetaAdvancedMatching({
        email:     fields.email,
        phone:     `${selected.dial}${fields.phone}`,
        firstName: fields.firstName,
        lastName:  fields.lastName,
        city:      fields.city,
        country:   countryCode,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [fields, countryCode]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  async function applyCoupon() {
    const code = couponInput.trim();
    if (!code) {
      setCouponMsg({ ok: false, text: 'Enter a coupon code.' });
      return;
    }
    setCouponBusy(true);
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data?.valid && typeof data.percentOff === 'number') {
        setCouponApplied(code);
        setCouponPercent(data.percentOff);
        setCouponMsg({ ok: true, text: `Coupon applied — ${data.percentOff}% off.` });
      } else {
        setCouponApplied(null);
        setCouponPercent(0);
        setCouponMsg({ ok: false, text: 'Invalid coupon code.' });
      }
    } catch {
      setCouponMsg({ ok: false, text: 'Could not check coupon. Try again.' });
    } finally {
      setCouponBusy(false);
    }
  }

  function removeCoupon() {
    setCouponApplied(null);
    setCouponPercent(0);
    setCouponInput('');
    setCouponMsg(null);
  }

  function handleChange(field: keyof FormFields, value: string) {
    setFields(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      const updated = { ...fields, [field]: value };
      const newErrors = validateFields(updated, countryCode);
      setErrors(e => ({ ...e, [field]: newErrors[field] }));
    }
  }

  function handleBlur(field: keyof FormFields) {
    setTouched(t => ({ ...t, [field]: true }));
    const newErrors = validateFields(fields, countryCode);
    setErrors(e => ({ ...e, [field]: newErrors[field] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, city: true, phone: true, customerType: true });
    const allErrors = validateFields(fields, countryCode);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      const firstKey = Object.keys(allErrors)[0] as keyof FormFields;
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    // 100%-off coupon path — skip Razorpay entirely
    if (isFree && couponApplied) {
      try {
        const selected = COUNTRIES.find(c => c.code === countryCode) ?? COUNTRIES[0];
        const utm = restoreUtm();
        const res = await fetch('/api/checkout/free-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            couponCode: couponApplied,
            customer: {
              firstName:    fields.firstName.trim(),
              lastName:     fields.lastName.trim(),
              email:        fields.email.trim(),
              city:         fields.city.trim(),
              phone:        fields.phone.trim(),
              countryCode,
              dialCode:     selected.dial,
              customerType: fields.customerType,
            },
            utm,
          }),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error ?? 'Could not place free order.');

        // Forward EVERY landing param to /thank-you so downstream tooling
        // (Pabbly automations, analytics dashboards, partner pixels) keeps the
        // full attribution context. brand.funnelSlug and `p` (paymentId) are
        // added last so they override any same-named param from the URL.
        const params = new URLSearchParams(restoreLandingParams());
        params.set('funnel', brand.funnelSlug);
        if (result.paymentId) params.set('p', result.paymentId);
        router.push(`${brand.thankYouPath}?${params.toString()}`);
      } catch (err) {
        setLoading(false);
        showToast(err instanceof Error ? err.message : 'Something went wrong.');
      }
      return;
    }

    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: pricing.client.paise, currency: pricing.client.currency }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.error ?? 'Could not initiate payment.');
      }
      const { orderId, keyId, amount } = await orderRes.json();
      const selected = COUNTRIES.find(c => c.code === countryCode) ?? COUNTRIES[0];

      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Payment system unavailable. Please refresh and try again.');
      }

      const rzp = new window.Razorpay({
        key: keyId ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '',
        amount: amount ?? pricing.client.paise,
        currency: pricing.client.currency,
        order_id: orderId,
        name: brand.modalName,
        description: brand.modalDescription,
        prefill: {
          name:    `${fields.firstName.trim()} ${fields.lastName.trim()}`,
          email:   fields.email.trim(),
          contact: `${selected.dial}${fields.phone.trim()}`,
        },
        theme: { color: brand.themeColor },
        handler: async (response: RazorpayResponse) => {
          await handlePaymentSuccess(response, selected.dial);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      showToast(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  async function handlePaymentSuccess(response: RazorpayResponse, dialCode: string) {
    try {
      const utm = restoreUtm();

      // Refresh MAM with the latest form values so the cookie carries the
      // final identity into /thank-you and every subsequent PageView.
      await setMetaAdvancedMatching({
        email:     fields.email,
        phone:     `${dialCode}${fields.phone}`,
        firstName: fields.firstName,
        lastName:  fields.lastName,
        city:      fields.city,
        country:   countryCode,
      });

      const eventSourceUrl =
        typeof window !== 'undefined' ? window.location.href : '';

      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          customer: {
            firstName:    fields.firstName.trim(),
            lastName:     fields.lastName.trim(),
            email:        fields.email.trim(),
            city:         fields.city.trim(),
            phone:        fields.phone.trim(),
            countryCode,
            dialCode,
            customerType: fields.customerType,
          },
          utm,
          eventSourceUrl,
        }),
      });
      const result = await verifyRes.json();
      if (!result.success) throw new Error(result.error ?? 'Payment verification failed.');

      // Forward EVERY landing param to /thank-you — same rationale as the
      // coupon path above.
      const params = new URLSearchParams(restoreLandingParams());
      params.set('funnel', brand.funnelSlug);
      params.set('p', response.razorpay_payment_id);
      router.push(`${brand.thankYouPath}?${params.toString()}`);
    } catch (err) {
      setLoading(false);
      showToast(err instanceof Error ? err.message : 'Verification failed — please contact support.');
    }
  }

  function fieldClass(key: keyof FormFields, base = 'checkout-input') {
    const hasError = touched[key] && !!errors[key];
    const isValid  = touched[key] && !errors[key] && fields[key].trim().length > 0;
    return `${base}${hasError ? ' input-error' : ''}${isValid ? ' input-valid' : ''}`;
  }

  return (
    <>
      {toast && (
        <div className="checkout-toast visible" role="alert">
          {toast}
          <button onClick={() => setToast(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      <MobileSummary finalInr={finalInr} discountInr={discountInr} />

      <div className="checkout-main">
        {/* ── Form ── */}
        <div className="checkout-form-panel">
          <div className="checkout-form-heading">
            <span className="eyebrow">Secure Registration</span>
            <h1>Book FM4 Workshop</h1>
            <p>Fill in your details — your access link arrives by email &amp; WhatsApp within minutes of payment.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="field" id="field-firstName">
                <label htmlFor="firstName">First name <span className="req">*</span></label>
                <input
                  id="firstName"
                  type="text"
                  className={fieldClass('firstName')}
                  placeholder="Aanya"
                  value={fields.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  autoComplete="given-name"
                />
                {touched.firstName && errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="field" id="field-lastName">
                <label htmlFor="lastName">Last name <span className="req">*</span></label>
                <input
                  id="lastName"
                  type="text"
                  className={fieldClass('lastName')}
                  placeholder="Kapoor"
                  value={fields.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  autoComplete="family-name"
                />
                {touched.lastName && errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>

              <div className="field field--full" id="field-email">
                <label htmlFor="email">Email <span className="req">*</span></label>
                <input
                  id="email"
                  type="email"
                  className={fieldClass('email')}
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={e => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  autoComplete="email"
                  inputMode="email"
                />
                {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="field" id="field-city">
                <label htmlFor="city">Town / City <span className="req">*</span></label>
                <input
                  id="city"
                  type="text"
                  className={fieldClass('city')}
                  placeholder="Mumbai"
                  value={fields.city}
                  onChange={e => handleChange('city', e.target.value)}
                  onBlur={() => handleBlur('city')}
                  autoComplete="address-level2"
                />
                {touched.city && errors.city && <span className="field-error">{errors.city}</span>}
              </div>

              <div className="field" id="field-phone">
                <label htmlFor="phone">Phone <span className="req">*</span></label>
                <CheckoutPhoneInput
                  value={fields.phone}
                  countryCode={countryCode}
                  onValueChange={v => handleChange('phone', v)}
                  onCountryChange={code => {
                    setCountryCode(code);
                    if (touched.phone) {
                      const newErrors = validateFields(fields, code);
                      setErrors(e => ({ ...e, phone: newErrors.phone }));
                    }
                  }}
                  error={errors.phone}
                  touched={touched.phone}
                  onBlur={() => handleBlur('phone')}
                />
                {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

              <div className="field field--full field--radio" id="field-customerType">
                <label>Are you reserving a seat for yourself or a loved one? <span className="req">*</span></label>
                <div className="radio-row">
                  <label>
                    <input
                      type="radio"
                      name="customerType"
                      value="Myself"
                      checked={fields.customerType === 'Myself'}
                      onChange={e => handleChange('customerType', e.target.value)}
                      onBlur={() => handleBlur('customerType')}
                    />{' '}Myself
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="customerType"
                      value="Loved One"
                      checked={fields.customerType === 'Loved One'}
                      onChange={e => handleChange('customerType', e.target.value)}
                      onBlur={() => handleBlur('customerType')}
                    />{' '}Loved One
                  </label>
                </div>
                {touched.customerType && errors.customerType && <span className="field-error">{errors.customerType}</span>}
              </div>
            </div>

            <div className="coupon-block" style={{ margin: '0.6rem 0 1rem' }}>
              {!couponOpen && !couponApplied && (
                <button
                  type="button"
                  className="coupon-toggle"
                  onClick={() => setCouponOpen(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    color: 'var(--c-primary-d)', fontWeight: 600,
                    cursor: 'pointer', textDecoration: 'underline',
                    fontSize: '0.95rem',
                  }}
                >
                  Have a coupon code?
                </button>
              )}

              {(couponOpen || couponApplied) && !couponApplied && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="checkout-input"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    style={{ flex: '1 1 200px', textTransform: 'none' }}
                    aria-label="Coupon code"
                  />
                  <button
                    type="button"
                    className="btn"
                    onClick={applyCoupon}
                    disabled={couponBusy}
                    style={{
                      background: 'var(--c-primary)', color: '#fff',
                      padding: '0.7rem 1.2rem', minHeight: 44,
                      borderRadius: 8, fontWeight: 700,
                    }}
                  >
                    {couponBusy ? 'Checking…' : 'Apply'}
                  </button>
                </div>
              )}

              {couponApplied && (
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '0.5rem', padding: '0.6rem 0.85rem', borderRadius: 8,
                    background: 'rgba(0, 152, 75, 0.08)', border: '1px solid var(--c-primary)',
                    color: 'var(--c-primary-d)', fontWeight: 600,
                  }}
                >
                  <span>✓ {couponApplied} applied — {couponPercent}% off</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--c-primary-d)', fontWeight: 700, textDecoration: 'underline',
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponMsg && !couponApplied && (
                <span
                  className="field-error"
                  style={{ display: 'block', marginTop: '0.4rem', color: couponMsg.ok ? 'var(--c-primary-d)' : undefined }}
                >
                  {couponMsg.text}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--cta btn--lg btn--block checkout-submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Processing…' : (
                <>
                  <span className="checkout-submit__text">
                    {isFree ? 'Place Free Order' : 'Place Your Order'}
                  </span>
                  <span className="checkout-submit__arrow" aria-hidden="true">→</span>
                </>
              )}
            </button>

            <p className="secure-tag">
              {brand.trustBadges.join(' · ')}
            </p>
            <p className="checkout-fineprint">
              Your personal data is used only to process your order. See our <a href="/privacy-policy">privacy policy</a>.
            </p>
          </form>
        </div>

        {/* ── Desktop summary ── */}
        <aside className="summary-card summary-card--desktop" aria-label="Order summary">
          <SummaryBody finalInr={finalInr} discountInr={discountInr} />
        </aside>
      </div>
    </>
  );
}
