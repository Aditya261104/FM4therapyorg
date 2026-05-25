'use client';

import { useState, useEffect, type AnchorHTMLAttributes, type ReactNode } from 'react';

// Anchor that forwards every query param on the current landing URL to the
// checkout page. Mounts client-side, reads window.location.search, and appends
// it to /product-checkout. With no params it renders a plain /product-checkout
// link — identical to the previous <a href="/product-checkout"> behavior.
//
// Drop-in replacement: takes the same className + children as the old anchors.
export default function CheckoutLink({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>) {
  const [qs, setQs] = useState('');

  useEffect(() => {
    setQs(window.location.search);
  }, []);

  return (
    <a href={`/product-checkout${qs}`} className={className} {...rest}>
      {children}
    </a>
  );
}
