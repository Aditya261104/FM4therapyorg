import Footer from '@/components/Footer';
import LandingClient, { REVIEWS_DATA } from '@/components/LandingClient';
import { brand, pricing, schedule } from '@/lib/config';

const VIDEO_TESTIMONIALS = [
  { thumb: '/Images%20Sourabh/video1.jpg', url: 'https://player.vimeo.com/video/1037337143?h=cd71981f29' },
  { thumb: '/Images%20Sourabh/video2.png', url: 'https://player.vimeo.com/video/1037391319?h=90c39e7abf' },
  { thumb: '/Images%20Sourabh/video3.png', url: 'https://player.vimeo.com/video/1036989531?h=bdcfbbf55e' },
  { thumb: '/Images%20Sourabh/video4.png', url: 'https://player.vimeo.com/video/1036990802?h=b559cf8df7' },
  { thumb: '/Images%20Sourabh/video5.png', url: 'https://player.vimeo.com/video/1036989452?h=cfca58d257' },
  { thumb: '/Images%20Sourabh/video6.jpg', url: 'https://player.vimeo.com/video/1037337766?h=23bc18ac1c' },
  { thumb: '/Images%20Sourabh/video7.jpg', url: 'https://player.vimeo.com/video/1036989280?h=61dd3cfc96' },
];
const testRow1 = VIDEO_TESTIMONIALS.slice(0, 4);
const testRow2 = VIDEO_TESTIMONIALS.slice(4);

const reviewImagesTop = [1, 2, 3, 4, 5];
const reviewImagesBot = [6, 7, 8, 9, 10];

const CTA = (
  <>
    Book Your Seat For <s className="price-old">₹{pricing.client.originalInr}</s>{' '}
    <span className="price-new">₹{pricing.client.inr}</span>
  </>
);

export default function LandingPage() {
  return (
    <>
      {/* Top urgency strip */}
      <div className="topbar">
        <strong>Book Now → Get 81% OFF</strong> · Last <span className="js-seat-count">11</span> Seats Left · Booking Closes Once Full!
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero__head reveal">
            <span className="hero__eyebrow">Especially for Busy Professionals, Entrepreneurs &amp; their Loved Ones</span>
            <h1 className="hero__title">
              <span className="hero__title-line">Learn How to Overcome</span>
              <span className="hero__title-line green">Spine, Knee &amp; Neck Pain Naturally</span>
              <span className="hero__title-line">for Long-Term Relief</span>
            </h1>
            <p className="hero__sub">Without any Medicines, Surgeries, Physio, Chiro, or Oil Massages</p>

            <div className="hero__reviews" aria-label="4.6 out of 5 rating on Google Reviews">
              <span className="hero__reviews-stars" aria-hidden="true">★★★★★</span>
              <strong>4.6</strong>
              <span className="hero__reviews-sep" aria-hidden="true">|</span>
              <span>1000+ Reviews On</span>
              <span className="hero__reviews-google" aria-hidden="true">
                <span className="hero__reviews-google__name">
                  <span style={{ color: '#4285F4' }}>G</span>
                  <span style={{ color: '#EA4335' }}>o</span>
                  <span style={{ color: '#FBBC05' }}>o</span>
                  <span style={{ color: '#4285F4' }}>g</span>
                  <span style={{ color: '#34A853' }}>l</span>
                  <span style={{ color: '#EA4335' }}>e</span>
                </span>
                <span className="hero__reviews-google__sub">Reviews ★★★★★</span>
              </span>
            </div>
          </div>

          <div className="hero__grid">
            <aside className="hero__vsl reveal" id="vslContainer" aria-label="Workshop preview video">
              <img className="hero__vsl-poster-img" src="/Images%20Sourabh/Main%20thumbnail.webp" alt="FM4 Therapy workshop preview" />
              <div className="hero__vsl-poster" role="button" tabIndex={0} aria-label="Play workshop video">
                <div className="hero__vsl-play" aria-hidden="true"></div>
                <span className="hero__vsl-tag">▶ Watch the 3-min preview</span>
              </div>
            </aside>

            <div className="hero__col-right reveal reveal-delay-1">
              <div className="info-grid">
                <InfoCard label="Date" value={schedule.dateRange} icon={<CalendarIcon/>} />
                <InfoCard label="Time" value={schedule.day1} sub={schedule.day2} icon={<ClockIcon/>} />
                <InfoCard label="Live Workshop" value="2 Days" icon={<VideoIcon/>} />
                <InfoCard label="Language" value="Hindi & English" icon={<GlobeIcon/>} />
              </div>

              <div className="cta-block hero__cta">
                <a href="/product-checkout" className="btn btn--cta btn--lg hero__cta-btn">
                  <span className="hero__cta-btn__main">
                    Book Now – Get 81% OFF
                    <span className="hero__cta-btn__arrow" aria-hidden="true">→</span>
                  </span>
                </a>
                <span className="guarantee">100% money back guarantee</span>
              </div>

              <div className="scarcity">
                Last <span className="js-seat-count">11</span> Seats Left
                <span className="scarcity__sep"> — </span>
                <span className="scarcity__line2">Booking Closes Once Full!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section">
        <div className="container">
          <div className="stats">
            <Stat img="/Images%20Sourabh/counter1.webp" label="Spine, Knee & Neck Pain Relieved Successfully!" count={10000} suffix="+" />
            <Stat img="/Images%20Sourabh/counter2.png"  label="Surgeries Avoided!" count={5000} suffix="+" delay={1} />
            <Stat img="/Images%20Sourabh/counter3.webp" label="Medical Bills Saved for Patients in 10 years!" count={100} prefix="₹" suffix=" Crores+" delay={2} />
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="section section--soft-lite">
        <div className="container">
          <div className="section-head reveal">
            <h2>Looking for <span className="green">Relief from Spine, Knee or Neck Pain?</span></h2>
          </div>

          <img className="pain-section__img reveal" src="/Images%20Sourabh/pain.webp" alt="4 common signs you need FM4 therapy" loading="lazy" />

          <div className="pain-section__mobile">
            <img className="pain-section__img-mobile reveal" src="/Images%20Sourabh/mobileprogram.webp" alt="" loading="lazy" />
            <div className="pain-questions__cards">
              <PainQ n={1} html='Is your <strong>chronic pain</strong> affecting your <strong>personal &amp; professional</strong> life that&apos;s making you scared about your future?' />
              <PainQ n={2} html='Are you wasting your <strong>precious time and money</strong> on medicines, physio or injections, but not getting a complete solution?' delay={1} />
              <PainQ n={3} html='Are you tired of the same old <strong>yoga therapies</strong>, <strong>traditional therapies</strong> and other therapies but never got <strong>pain relief</strong>?' delay={2} />
              <PainQ n={4} html='Are you confused about which method can actually help you achieve <strong>long-term relief from pain</strong>' delay={3} />
            </div>
          </div>

          <p className="pain-conclusion reveal">
            Many people experience spine, knee, or neck discomfort in their daily lives.<br />
            <span className="green">Now it&apos;s possible to manage and reduce pain effectively from the comfort of your home</span>
          </p>

          <div className="cta-block reveal">
            <a href="/product-checkout" className="btn btn--cta btn--lg">{CTA}</a>
            <span className="guarantee">100% money back guarantee</span>
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS — DUAL MARQUEE */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Reviews</span>
            <h2>Healthy &amp; Happy Client Success Reviews</h2>
          </div>
        </div>
        <Marquee direction="left"  label="Client video testimonials — left to right" videos={testRow1} />
        <Marquee direction="right" label="Client video testimonials — right to left" videos={testRow2} />
      </section>

      <div className="video-modal" id="videoModal" aria-hidden="true" role="dialog" aria-label="Client testimonial video">
        <div className="video-modal__inner">
          <button className="video-modal__close" type="button" id="videoModalClose" aria-label="Close video">×</button>
          <div className="video-modal__player" id="videoModalPlayer"></div>
        </div>
      </div>

      {/* BIG QUESTION */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">The Big Question is</span>
            <h2>What Will You Experience in This 2-Day Live Workshop?</h2>
          </div>
          <div className="experience">
            <article className="experience__card reveal">
              <div className="experience__num">1.</div>
              <h3>Get a Personalized Pain Assessment</h3>
              <p>Know exactly what&apos;s the root cause of your Pain? <em>LIVE.</em></p>
            </article>
            <article className="experience__card reveal reveal-delay-1">
              <div className="experience__num">2.</div>
              <h3>Experience FM4 Therapy LIVE</h3>
              <p>The same therapy that helped <em>10000+ people live pain-free naturally</em> — no medicines, no surgeries.</p>
            </article>
          </div>
          <div className="cta-block mt-3 reveal">
            <a href="/product-checkout" className="btn btn--cta btn--lg">{CTA}</a>
            <span className="guarantee">100% money back guarantee</span>
          </div>
        </div>
      </section>

      {/* CURRICULUM TIMELINE */}
      <section className="section section--soft-lite">
        <div className="container">
          <div className="section-head reveal">
            <h2>What will we cover in the <span className="green">Workshop?</span></h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--c-ink-soft)' }}>
              Learn practical solutions on how this proven <strong>FM4 Therapy</strong>{' '}
              can make your life <strong style={{ color: 'var(--c-primary-d)' }}>Pain-Free in 30-60 days</strong>
            </p>
          </div>

          <div className="timeline" id="curriculumTimeline">
            <div className="timeline__line" aria-hidden="true">
              <div className="timeline__progress" id="timelineProgress"></div>
            </div>
            <article className="timeline__step timeline__step--left timeline__step--1 reveal">
              <div className="timeline__num">Step 1</div>
              <div className="timeline__pill">Identifying The Root Cause (FM-1)</div>
              <p>Identify the <strong>real cause of your spine, neck, or knee pain</strong> with cutting-edge assessment tests that go beyond basic diagnosis.</p>
            </article>
            <div className="timeline__icon timeline__icon--1 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-1.svg" alt="" /></div>

            <div className="timeline__icon timeline__icon--2 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-2.svg" alt="" /></div>
            <article className="timeline__step timeline__step--right timeline__step--2 reveal">
              <div className="timeline__num">Step 2</div>
              <div className="timeline__pill">Releasing Your Trigger Points (FM-2)</div>
              <p><strong>Gently release the knots</strong> in your muscles that are causing pain, so you can feel relief without any medication</p>
            </article>

            <article className="timeline__step timeline__step--left timeline__step--3 reveal">
              <div className="timeline__num">Step 3</div>
              <div className="timeline__pill">Strengthening Weaker Muscles (FM-3)</div>
              <p><strong>Easy exercises to help you rebuild strength</strong> in weak areas, so you can move safely and confidently</p>
            </article>
            <div className="timeline__icon timeline__icon--3 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-3.svg" alt="" /></div>

            <div className="timeline__icon timeline__icon--4 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-4.svg" alt="" /></div>
            <article className="timeline__step timeline__step--right timeline__step--4 reveal">
              <div className="timeline__num">Step 4</div>
              <div className="timeline__pill">Increasing Your Flexibility (FM-4)</div>
              <p>Improve how your <strong>body bends and stretches</strong>, making everyday movements like walking or reaching easier and pain-free</p>
            </article>
          </div>

          <div className="cta-block reveal mt-3">
            <a href="/product-checkout" className="btn btn--cta btn--lg">{CTA}</a>
            <span className="guarantee">100% money back guarantee</span>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Audience</span>
            <h2>Who is this Workshop for?</h2>
          </div>
          <div className="audience">
            <Aud src="icon-audience-1.svg" title="Busy Business Owners" copy="Those struggling to manage business due to frustrating back, neck or knee pain" />
            <Aud src="icon-audience-2.svg" title="Desk Job Employees"   copy="Anyone who spends long hours sitting and wants to improve their posture or eliminate back-induced pain" delay={1} />
            <Aud src="icon-audience-3.svg" title="Older Adults (55+)"   copy="Those seeking gentle yet effective techniques to relieve pain and improve posture for better mobility and comfort" delay={2} />
            <Aud src="icon-audience-4.svg" title="Busy or Working Moms" copy="Women facing difficulties in managing day-to-day home or work activities due to body pain" delay={3} />
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Meet Your Instructor</span>
            <h2>Meet <span className="green">Sourobh Kulkorni</span></h2>
          </div>

          <div className="instructor-row reveal">
            <div className="slider" id="instructorSlider">
              <div className="slider__slide is-active" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images1.png')` }} role="img" aria-label="Sourobh Kulkarni — image 1"></div>
              <div className="slider__slide" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images2.png')` }} role="img" aria-label="Sourobh Kulkarni — image 2"></div>
              <div className="slider__slide" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images3.png')` }} role="img" aria-label="Sourobh Kulkarni — image 3"></div>
            </div>
            <div className="instructor__body">
              <h3>With 19 years of expertise in the Health &amp; Fitness industry</h3>
              <p>Sourobh Kulkarni has helped over <strong>10,000 clients</strong> overcome chronic pain, including discomfort in the back, neck, and knees, as well as various other mobility challenges.</p>
            </div>
          </div>

          <div className="instructor-row instructor-row--video reveal">
            <div className="instructor__body">
              <h3>Amazing Performer in Fitness Industry 2024</h3>
              <p>A solution that&apos;s proven effective across a diverse range of clients — from famous celebrities and athletes to busy working professionals, stay-at-home parents, and elderly patients.</p>
              <p>His approach is holistic and non-invasive, offering long-lasting relief without relying on medications, surgeries, or traditional physiotherapy. Sourobh&apos;s unique therapy focuses on addressing the <strong>root causes of pain, not just masking the symptoms</strong>, which is why his methods have earned him a reputation as one of the most successful experts in the health domain.</p>
            </div>

            <div className="instructor-vimeo">
              <iframe
                id="instructorVimeoIframe"
                src="https://player.vimeo.com/video/1072068196?h=4c6578adfe&autoplay=1&muted=1&loop=1&background=1&autopause=0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                title="FM4 Therapy — Sourobh Kulkorni"
              />
              <button className="video-block__sound" type="button" id="videoSoundBtn" aria-pressed="false">
                <span className="video-block__sound-icon" aria-hidden="true">🔇</span>
                <span className="video-block__sound-label">Unmute</span>
              </button>
            </div>
          </div>

          <div className="cta-block reveal mt-3">
            <a href="/product-checkout" className="btn btn--cta btn--lg">{CTA}</a>
            <span className="guarantee">100% money back guarantee</span>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Social Proof</span>
            <div className="gr-head">
              <span className="gr-head__rating">Rated 4.6</span>
              <span className="gr-head__stars">★★★★★</span>
              <span className="gr-head__count">| 1000+ Reviews On Google Reviews</span>
            </div>
          </div>
        </div>
        <ReviewMarquee direction="left"  ids={reviewImagesTop} label="Google reviews — left to right"  />
        <ReviewMarquee direction="right" ids={reviewImagesBot} label="Google reviews — right to left" />
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions and clarify any doubts to help you get the most out of our services.</p>
          </div>
          <div className="faq reveal">
            <FaqItem q="Can you guarantee complete pain relief for severe conditions?" a="FM4 Therapy works by addressing the root causes of pain through movement, posture correction, and targeted exercises. While most participants experience significant relief, individual results depend on the severity of your condition, consistency of practice, and other health factors." />
            <FaqItem q="What is FM4 Therapy?" a="FM4 therapy is a proven 4-phase treatment that targets the root causes of pain in the spine, neck, and knees, providing lasting relief through non-invasive techniques. It involves identifying the cause, releasing muscle tension, strengthening weak muscles, and improving flexibility." />
            <FaqItem q="How do you deliver this therapy?" a="The 2-day live workshop is delivered entirely online via a private video conferencing room. You receive your access link by email and WhatsApp immediately after booking. The workshop is held in both Hindi and English so the entire family can participate." />
            <FaqItem q="Do I need any special equipment to join this Workshop?" a="No special equipment is needed. A smartphone, tablet, or laptop with a stable internet connection is enough. Ideally have a yoga mat or a flat carpeted area, and wear loose, comfortable clothing so you can move freely." />
            <FaqItem q="How is this Workshop different from anything else in the market?" a="Most programs focus on temporary symptom relief — painkillers, massages, or generic exercises. FM4 Therapy is a 4-phase root-cause framework refined over 19 years and 10,000+ clients. Every participant gets a personalised pain assessment LIVE." />
            <FaqItem q="How can I join the Workshop?" a={`Click any "Book Now" button on this page, complete the secure booking through Razorpay, and you'll receive your workshop access link by email and WhatsApp. See you live on ${schedule.faqDates}.`} />
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky bottom CTA */}
      <aside className="sticky-cta" id="stickyCta" aria-label="Quick book">
        <div className="container sticky-cta__inner">
          <div className="sticky-cta__copy">
            <strong><s className="price-old">₹{pricing.client.originalInr}</s> <span className="now">₹{pricing.client.inr}</span></strong>
            <span className="sticky-cta__sep" aria-hidden="true">·</span>
            Last <span className="js-seat-count">11</span> seats left
          </div>
          <a href="/product-checkout" className="btn btn--cta sticky-cta__btn">Book Now → 81% OFF</a>
        </div>
      </aside>

      <LandingClient />
    </>
  );
}

// ── Small subcomponents ───────────────────────────────────────────────

function InfoCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="info-card">
      <div className="info-card__icon" aria-hidden="true">{icon}</div>
      <div className="info-card__body">
        <div className="info-card__lab">{label}</div>
        <div className="info-card__val">{value}{sub ? <small>{sub}</small> : null}</div>
      </div>
    </div>
  );
}

function Stat({ img, count, prefix = '', suffix = '+', label, delay = 0 }: { img: string; count: number; prefix?: string; suffix?: string; label: string; delay?: number; }) {
  const cls = ['stat', 'reveal', delay ? `reveal-delay-${delay}` : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <img className="stat__img" src={img} alt="" loading="lazy" />
      <div className="stat__eyebrow">Cool Number</div>
      <div className="stat__num" data-count={count} data-prefix={prefix} data-suffix={suffix}>{prefix}0<sup>{suffix}</sup></div>
      <div className="stat__lab">{label}</div>
    </div>
  );
}

function PainQ({ n, html, delay = 0 }: { n: number; html: string; delay?: number; }) {
  const cls = ['pain-q', 'reveal', delay ? `reveal-delay-${delay}` : ''].filter(Boolean).join(' ');
  return (
    <article className={cls}>
      <div className="pain-q__num">{n}</div>
      <p dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

function Aud({ src, title, copy, delay = 0 }: { src: string; title: string; copy: string; delay?: number; }) {
  const cls = ['audience__card', 'reveal', delay ? `reveal-delay-${delay}` : ''].filter(Boolean).join(' ');
  return (
    <article className={cls}>
      <div className="audience__icon" aria-hidden="true">
        <img src={`/Images%20Sourabh/${src}`} alt="" />
      </div>
      <div className="audience__body">
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
    </article>
  );
}

function Marquee({ direction, label, videos }: { direction: 'left' | 'right'; label: string; videos: Array<{ thumb: string; url: string }>; }) {
  return (
    <div className={`marquee marquee--${direction}`} aria-label={label}>
      <div className="marquee__track">
        {[0, 1].map(dup => (
          videos.map((v, i) => (
            <button
              key={`${dup}-${i}`}
              className="video-tile"
              type="button"
              data-video-url={v.url}
              aria-label="Play client testimonial"
              {...(dup ? { 'aria-hidden': true, tabIndex: -1 } : {})}
            >
              <img className="video-tile__thumb" src={v.thumb} alt="" loading="eager" decoding="async" width={1280} height={720} />
              <span className="video-tile__play" aria-hidden="true"></span>
            </button>
          ))
        ))}
      </div>
    </div>
  );
}

function ReviewMarquee({ direction, ids, label }: { direction: 'left' | 'right'; ids: number[]; label: string; }) {
  return (
    <div className={`marquee marquee--${direction} review-marquee`} aria-label={label}>
      <div className="marquee__track">
        {[0, 1].map(dup => (
          ids.map(n => (
            <img
              key={`${dup}-${n}`}
              className="review-tile"
              src={`/Images%20Sourabh/client%20review${n}.png`}
              alt="Client Google review"
              width={755}
              height={481}
              decoding="async"
              {...(dup ? { 'aria-hidden': true } : {})}
            />
          ))
        ))}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="faq__item">
      <summary>{q}</summary>
      <p>{a}</p>
    </details>
  );
}

// SVG icons
function CalendarIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>; }
function ClockIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>; }
function VideoIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/></svg>; }
function GlobeIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>; }
