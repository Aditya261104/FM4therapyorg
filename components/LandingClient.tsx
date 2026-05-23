'use client';

import { useEffect } from 'react';
import { captureUtm } from '@/lib/utm';

const REVIEWS = [
  { name: 'Gajanan Pandit', time: '2 weeks ago', text: "I'm vandana pandit, 72, and have suffered chronic knee pain for 12 years. After trying various treatments, sourabh's fm~4 therapy gave me 70% relief in just one session—a true miracle!" },
  { name: 'Ashwin Parate', time: 'a month ago', text: 'Fitness Master offers unique recovery methods. Kulkorni sir identifies pain precisely, and suyash sir is an excellent therapist who relieved my neck spasm in a day. Highly recommend!' },
  { name: 'Nitin Chavare', time: '3 weeks ago', text: "I am Nitin Chavare, 61. After 3 years of severe knee pain and no relief from various treatments, Saurobh sir's FM~4 therapy gave me 55% relief in just 20 minutes. Grateful!" },
  { name: 'Neha Gawde',    time: '1 month ago', text: "I am Neha G., 59, suffering from knee pain due to a gym injury. Saurobh sir's workshop gave me great relief. Thank you, Netbhet and Fitness Master!" },
  { name: 'Sunil Vaidya',  time: '2 months ago', text: 'Workshop was suggested by a friend and changed how I move every day. The personalised assessment is what makes FM4 different.' },
  { name: 'Priya R.',      time: '1 week ago',  text: 'Mother (62) had hip and knee pain. She refused English exercises elsewhere. Hindi sessions made all the difference. Thank you team FM4.' },
];

export const REVIEWS_DATA = REVIEWS;

export default function LandingClient() {
  // Initialize all the client-side bits: counters, sticky CTA, video modal, slider, timeline progress, scarcity, Vimeo unmute.
  useEffect(() => {
    // Capture UTMs on first landing so they survive the Book Now navigation
    // (the checkout-page capture only fires if the visitor arrives there directly).
    try { captureUtm(new URLSearchParams(window.location.search)); } catch { /* noop */ }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // 1. Animated stat counters
    const fmt = (n: number) => n >= 1000 ? n.toLocaleString('en-IN') : String(n);
    function animateStat(el: HTMLElement) {
      const target = +(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.innerHTML = prefix + fmt(Math.floor(target * eased)) + '<sup>' + suffix.trim() + '</sup>';
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    const statIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateStat(e.target as HTMLElement); statIO.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll<HTMLElement>('.stat__num').forEach(el => statIO.observe(el));

    // 2. Scroll reveal
    const revealNodes = document.querySelectorAll<HTMLElement>('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      revealNodes.forEach(el => el.classList.add('reveal--in'));
    } else {
      const revealIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('reveal--in'); revealIO.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      revealNodes.forEach(el => revealIO.observe(el));
    }

    // 3. Seat scarcity countdown
    const KEY = 'fm4_seats';
    const INIT = 115;
    const readSeats = () => {
      const v = parseInt(localStorage.getItem(KEY) || '', 10);
      return Number.isFinite(v) && v > 0 ? v : INIT;
    };
    const paintSeats = (n: number) => {
      document.querySelectorAll<HTMLElement>('.js-seat-count').forEach(el => {
        if (el.textContent?.trim() === String(n)) return;
        el.textContent = String(n);
        el.classList.remove('seat-flash');
        void el.offsetWidth;
        el.classList.add('seat-flash');
      });
    };
    let seats = readSeats();
    localStorage.setItem(KEY, String(seats));
    paintSeats(seats);
    const seatTimer = setInterval(() => {
      seats = seats - (1 + Math.floor(Math.random() * 4));
      if (seats <= 0) seats = INIT;
      localStorage.setItem(KEY, String(seats));
      paintSeats(seats);
    }, 60000);

    // 4. Instructor slider (3 images, autoplay, no pause-on-hover)
    const slides = document.querySelectorAll<HTMLElement>('#instructorSlider .slider__slide');
    let sliderIdx = 0;
    const sliderTimer = slides.length >= 2 ? setInterval(() => {
      slides[sliderIdx].classList.remove('is-active');
      sliderIdx = (sliderIdx + 1) % slides.length;
      slides[sliderIdx].classList.add('is-active');
    }, 3500) : null;

    // 5. Video modal (Vimeo iframe injection)
    const modal  = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    const close  = document.getElementById('videoModalClose');
    const openModal = (url: string) => {
      if (!modal || !player) return;
      const sep = url.includes('?') ? '&' : '?';
      player.innerHTML = `<iframe src="${url}${sep}autoplay=1&playsinline=1" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" allowfullscreen></iframe>`;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    const dismissModal = () => {
      if (!modal || !player) return;
      modal.classList.remove('is-open');
      player.innerHTML = '';
      document.body.style.overflow = '';
    };
    const tileHandlers: Array<() => void> = [];
    document.querySelectorAll<HTMLButtonElement>('.video-tile[data-video-url]').forEach(tile => {
      const handler = () => openModal(tile.getAttribute('data-video-url') || '');
      tile.addEventListener('click', handler);
      tileHandlers.push(() => tile.removeEventListener('click', handler));
    });
    if (close) close.addEventListener('click', dismissModal);
    const modalBgHandler = (e: MouseEvent) => { if (e.target === modal) dismissModal(); };
    if (modal) modal.addEventListener('click', modalBgHandler);
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-open')) dismissModal();
    };
    document.addEventListener('keydown', keyHandler);

    // 6. Timeline scroll-progress bar
    const tlWrap = document.getElementById('curriculumTimeline');
    const tlBar  = document.getElementById('timelineProgress');
    const tlUpdate = () => {
      if (!tlWrap || !tlBar) return;
      const rect = tlWrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const start = vh * 0.55 - rect.top;
      const span = rect.height;
      const pct = Math.max(0, Math.min(1, start / span));
      tlBar.style.height = (pct * 100).toFixed(2) + '%';
    };
    tlUpdate();
    window.addEventListener('scroll', tlUpdate, { passive: true });
    window.addEventListener('resize', tlUpdate, { passive: true });

    // 7. Vimeo unmute toggle for the instructor section
    const vimeoIframe = document.getElementById('instructorVimeoIframe') as HTMLIFrameElement | null;
    const soundBtn = document.getElementById('videoSoundBtn');
    let muted = true;
    const paintSound = () => {
      if (!soundBtn) return;
      soundBtn.setAttribute('aria-pressed', String(!muted));
      soundBtn.classList.toggle('is-unmuted', !muted);
      const icon = soundBtn.querySelector('.video-block__sound-icon');
      const lab  = soundBtn.querySelector('.video-block__sound-label');
      if (icon) icon.textContent = muted ? '🔇' : '🔊';
      if (lab)  lab.textContent  = muted ? 'Unmute' : 'Mute';
    };
    const soundClick = () => {
      if (!vimeoIframe) return;
      muted = !muted;
      paintSound();
      try {
        vimeoIframe.contentWindow?.postMessage(
          JSON.stringify({ method: 'setMuted', value: muted }),
          '*'
        );
      } catch { /* noop */ }
    };
    if (soundBtn) soundBtn.addEventListener('click', soundClick);

    // 8. Sticky bottom CTA visibility
    const stickyCta = document.getElementById('stickyCta');
    const stickyToggle = () => {
      if (!stickyCta) return;
      if (window.scrollY > 360) stickyCta.classList.add('is-visible');
      else stickyCta.classList.remove('is-visible');
    };
    const stickySync = () => {
      if (!stickyCta) return;
      document.body.style.paddingBottom = stickyCta.offsetHeight + 'px';
    };
    requestAnimationFrame(() => { stickySync(); stickyToggle(); });
    window.addEventListener('scroll', stickyToggle, { passive: true });
    window.addEventListener('resize', stickySync, { passive: true });

    // Cleanup
    return () => {
      clearInterval(seatTimer);
      if (sliderTimer) clearInterval(sliderTimer);
      window.removeEventListener('scroll', tlUpdate);
      window.removeEventListener('resize', tlUpdate);
      window.removeEventListener('scroll', stickyToggle);
      window.removeEventListener('resize', stickySync);
      document.removeEventListener('keydown', keyHandler);
      if (modal) modal.removeEventListener('click', modalBgHandler);
      if (close) close.removeEventListener('click', dismissModal);
      if (soundBtn) soundBtn.removeEventListener('click', soundClick);
      tileHandlers.forEach(off => off());
    };
  }, []);

  return null;
}
