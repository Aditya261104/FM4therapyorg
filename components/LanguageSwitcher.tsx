'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Lang = {
  code: 'en' | 'hi' | 'mar';
  label: string;
  href: '/' | '/hi' | '/mar';
  icon: string;
};

const LANGS: Lang[] = [
  { code: 'en',  label: 'English', href: '/',    icon: '/Images%20Sourabh/english.svg' },
  { code: 'hi',  label: 'Hindi',   href: '/hi',  icon: '/Images%20Sourabh/hindi.svg'   },
  { code: 'mar', label: 'Marathi', href: '/mar', icon: '/Images%20Sourabh/hindi.svg'   },
];

// Landing pages where the language picker makes sense. Excluded everywhere else
// (checkout, thank-you, privacy/terms/refund) — the visitor has either committed
// to a language by the time they reach those routes, or the page is monolingual.
const LANDING_PATHS = new Set(['/', '/hi', '/mar']);

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // All hooks must run on every render — keep the effect above any early return.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Hide on every non-landing route (checkout, thank-you, legal pages).
  if (!pathname || !LANDING_PATHS.has(pathname)) return null;

  const activeCode: Lang['code'] =
    pathname.startsWith('/mar') ? 'mar'
    : pathname.startsWith('/hi') ? 'hi'
    : 'en';

  const choose = (href: Lang['href']) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        className="lang-switcher"
        aria-label="Change language"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <img
          src="/Images%20Sourabh/language.png"
          alt=""
          aria-hidden="true"
          className="lang-switcher__icon"
        />
      </button>

      {open ? (
        <div
          className="lang-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Select language"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="lang-modal__panel">
            <button
              type="button"
              className="lang-modal__close"
              aria-label="Close language picker"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <ul className="lang-modal__list">
              {LANGS.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    className={`lang-option${l.code === activeCode ? ' lang-option--active' : ''}`}
                    onClick={() => choose(l.href)}
                  >
                    <span className="lang-option__icon" aria-hidden="true">
                      <img src={l.icon} alt="" />
                    </span>
                    <span className="lang-option__label">{l.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
