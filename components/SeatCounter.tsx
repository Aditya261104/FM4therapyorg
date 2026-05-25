'use client';

import { useEffect } from 'react';

// Fake scarcity counter shared by all landing pages and the checkout page.
// Starts at 50, decrements by 1 every 15s, persists in localStorage so the
// value survives navigation. Resets to INIT when it hits 0 so the page
// doesn't show "0 seats" if a visitor lingers past ~12 min.
//
// Updates every DOM element with class .js-seat-count on mount and on every
// tick — landing pages and the checkout topbar both carry that hook, so a
// single instance on each page is enough.
//
// Key was bumped to fm4_seats_v2 so prior visitors (carrying a value on the
// old 115-scale) get a clean restart at 50.
const KEY = 'fm4_seats_v2';
const INIT = 50;
const STEP = 1;
const TICK_MS = 15_000;

function paintSeats(n: number) {
  document.querySelectorAll<HTMLElement>('.js-seat-count').forEach((el) => {
    if (el.textContent?.trim() === String(n)) return;
    el.textContent = String(n);
    el.classList.remove('seat-flash');
    // Force reflow so the animation re-triggers on every change.
    void el.offsetWidth;
    el.classList.add('seat-flash');
  });
}

function readSeats(): number {
  const v = parseInt(localStorage.getItem(KEY) || '', 10);
  return Number.isFinite(v) && v > 0 ? v : INIT;
}

export default function SeatCounter() {
  useEffect(() => {
    let seats = readSeats();
    localStorage.setItem(KEY, String(seats));
    paintSeats(seats);

    const timer = setInterval(() => {
      seats = seats - STEP;
      if (seats <= 0) seats = INIT;
      localStorage.setItem(KEY, String(seats));
      paintSeats(seats);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  return null;
}
