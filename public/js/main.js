// =====================================================================
// FM4 Therapy — site-wide JS
//   • IntersectionObserver scroll-reveal
//   • Instructor 3-image autoplay slider (no pause on hover, no arrows)
//   • Instructor video: autoplay/muted/loop, with unmute toggle
//   • Sticky bottom CTA: shows after scroll past the hero
//   • Respects prefers-reduced-motion
// =====================================================================
(function () {
  'use strict';

  const REDUCE = window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Scroll-reveal -------------------------------------------------
  function initScrollReveal() {
    const nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    if (REDUCE || !('IntersectionObserver' in window)) {
      nodes.forEach(el => el.classList.add('reveal--in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--in');
          io.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    nodes.forEach(el => io.observe(el));
  }

  // ---- Instructor slider (3 images, autoplay, no controls) -----------
  function initSlider() {
    const slider = document.getElementById('instructorSlider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.slider__slide');
    if (slides.length < 2) return;

    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
    }, 3500);
  }

  // ---- Vimeo unmute (instructor video) -------------------------------
  function initVimeoUnmute() {
    const iframe = document.getElementById('instructorVimeoIframe');
    const btn    = document.getElementById('videoSoundBtn');
    if (!iframe || !btn) return;

    const iconEl  = btn.querySelector('.video-block__sound-icon');
    const labelEl = btn.querySelector('.video-block__sound-label');
    let muted = true;

    function paint() {
      btn.setAttribute('aria-pressed', String(!muted));
      btn.classList.toggle('is-unmuted', !muted);
      if (iconEl)  iconEl.textContent  = muted ? '🔇' : '🔊';
      if (labelEl) labelEl.textContent = muted ? 'Unmute' : 'Mute';
    }

    function withPlayer(cb) {
      if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
        cb(new Vimeo.Player(iframe));
      } else {
        // Vimeo API not loaded yet — retry a few times
        let tries = 0;
        const id = setInterval(() => {
          if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
            clearInterval(id);
            cb(new Vimeo.Player(iframe));
          } else if (++tries > 50) {
            clearInterval(id);
          }
        }, 100);
      }
    }

    btn.addEventListener('click', () => {
      muted = !muted;
      paint();
      withPlayer(player => {
        player.setMuted(muted).catch(() => {});
        if (!muted) player.setVolume(1).catch(() => {});
      });
    });
  }

  // ---- Sticky bottom CTA --------------------------------------------
  function initStickyCta() {
    const el = document.getElementById('stickyCta');
    if (!el) return;

    const page = document.body.dataset.page;
    if (page === 'checkout' || page === 'thank-you') {
      el.remove();
      document.body.style.paddingBottom = '0';
      return;
    }

    const THRESHOLD = 360;
    function syncPadding() {
      // Body padding-bottom exactly matches the sticky CTA's rendered height
      // — kills the gap between the footer and the sticky bar.
      document.body.style.paddingBottom = el.offsetHeight + 'px';
    }
    function toggle() {
      if (window.scrollY > THRESHOLD) el.classList.add('is-visible');
      else el.classList.remove('is-visible');
    }
    // Run after layout settles
    requestAnimationFrame(() => { syncPadding(); toggle(); });
    window.addEventListener('scroll', toggle, { passive: true });
    window.addEventListener('resize', syncPadding, { passive: true });
  }

  // ---- Client testimonial video lightbox -----------------------------
  function initVideoModal() {
    const modal  = document.getElementById('videoModal');
    const player = document.getElementById('videoModalPlayer');
    const close  = document.getElementById('videoModalClose');
    if (!modal || !player) return;

    const tiles = document.querySelectorAll('.video-tile[data-video-url]');
    if (!tiles.length) return;

    function open(url) {
      const sep = url.includes('?') ? '&' : '?';
      player.innerHTML =
        '<iframe src="' + url + sep + 'autoplay=1&playsinline=1" ' +
        'allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" ' +
        'allowfullscreen></iframe>';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function dismiss() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      player.innerHTML = ''; // stops the iframe / kills audio
      document.body.style.overflow = '';
    }

    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        const url = tile.getAttribute('data-video-url');
        if (url) open(url);
      });
    });

    if (close) close.addEventListener('click', dismiss);
    modal.addEventListener('click', e => {
      // Click outside the inner player closes
      if (e.target === modal) dismiss();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) dismiss();
    });
  }

  // ---- Hero VSL poster → swap to Vimeo iframe on click ---------------
  function initVslPoster() {
    const poster = document.getElementById('vslPoster');
    const vsl    = document.getElementById('vslContainer');
    if (!poster || !vsl) return;

    const swap = () => {
      vsl.innerHTML =
        '<iframe src="https://player.vimeo.com/video/1109262583?h=9b74413547&autoplay=1" ' +
        'title="FM4 Workshop Preview" ' +
        'allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" ' +
        'allowfullscreen></iframe>';
    };
    poster.addEventListener('click', swap);
    poster.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swap(); }
    });
  }

  // ---- Workshop timeline scroll-progress line ------------------------
  function initTimelineProgress() {
    const wrap = document.getElementById('curriculumTimeline');
    const bar  = document.getElementById('timelineProgress');
    if (!wrap || !bar) return;

    function update() {
      const rect    = wrap.getBoundingClientRect();
      const vh      = window.innerHeight || document.documentElement.clientHeight;
      // Progress is 0 when the timeline top hits the viewport's middle,
      // 100% when its bottom hits the viewport's middle.
      const start   = vh * 0.55 - rect.top;
      const span    = rect.height;
      const pct     = Math.max(0, Math.min(1, start / span));
      bar.style.height = (pct * 100).toFixed(2) + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function boot() {
    initScrollReveal();
    initSlider();
    initVimeoUnmute();
    initVslPoster();
    initTimelineProgress();
    initVideoModal();
    initStickyCta();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
