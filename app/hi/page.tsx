import Footer from '@/components/Footer';
import LandingClient, { REVIEWS_DATA } from '@/components/LandingClient';
import CheckoutLink from '@/components/CheckoutLink';
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
    अभी सीट बुक करें केवल <s className="price-old">₹{pricing.client.originalInr}</s>{' '}
    <span className="price-new">₹{pricing.client.inr}</span>
  </>
);

export default function LandingPageHi() {
  return (
    <>
      {/* Top urgency strip */}
      <div className="topbar">
        <strong>अभी बुक करें → 81% OFF पाएं</strong> · केवल <span className="js-seat-count">11</span> सीट्स बाकी · सीटें भरते ही बुकिंग बंद!
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero__head reveal">
            <span className="hero__eyebrow">सिर्फ Busy Professionals, Entrepreneurs और उनके अपनों के लिए!</span>
            <h1 className="hero__title hero__title--devanagari">
              <span className="hero__title-line">जानें कैसे आप</span>
              <span className="hero__title-line green">Spine, Knee और Neck Pain</span>
              <span className="hero__title-line">को Effectively Reverse कर सकते हैं</span>
            </h1>
            <p className="hero__sub">बिना किसी दवाई, सर्जरी, फिजियोथेरेपी, Chiro या तेल मालिश के</p>

            <div className="hero__reviews" aria-label="4.6 out of 5 rating on Google Reviews">
              <span className="hero__reviews-stars" aria-hidden="true">★★★★★</span>
              <strong>4.6</strong>
              <span className="hero__reviews-sep" aria-hidden="true">|</span>
              <span>1000+ समीक्षाएँ</span>
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
              <img className="hero__vsl-poster-img" src="/Images%20Sourabh/hindi%20thimbnail.webp" alt="FM4 Therapy workshop preview" />
              <div className="hero__vsl-poster" role="button" tabIndex={0} aria-label="Play workshop video">
                <div className="hero__vsl-play" aria-hidden="true"></div>
                <span className="hero__vsl-tag">▶ 3-मिनट का प्रीव्यू देखें</span>
              </div>
            </aside>

            <div className="hero__col-right reveal reveal-delay-1">
              <div className="info-grid">
                <InfoCard label="तारीख" value={schedule.dateRange} icon={<CalendarIcon/>} />
                <InfoCard label="समय" value={schedule.day1} sub={schedule.day2} icon={<ClockIcon/>} />
                <InfoCard label="लाइव Workshop" value="2 Days" icon={<VideoIcon/>} />
                <InfoCard label="भाषा" value="Hindi & English" icon={<GlobeIcon/>} />
              </div>

              <div className="cta-block hero__cta">
                <CheckoutLink className="btn btn--cta btn--lg hero__cta-btn">
                  <span className="hero__cta-btn__main">
                    अभी बुक करें – 81% OFF पाएं
                    <span className="hero__cta-btn__arrow" aria-hidden="true">→</span>
                  </span>
                </CheckoutLink>
                <span className="guarantee">100% मनी बैक गारंटी</span>
              </div>

              <div className="scarcity">
                केवल <span className="js-seat-count">11</span> सीट्स बाकी
                <span className="scarcity__sep"> — </span>
                <span className="scarcity__line2">सीटें भरते ही बुकिंग बंद!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section">
        <div className="container">
          <div className="stats">
            <Stat img="/Images%20Sourabh/counter1.webp" label="Spine, Knee और Neck Pain Successfully Reverse हुआ!" count={10000} suffix="+" />
            <Stat img="/Images%20Sourabh/counter2.png"  label="Surgeries Avoid हुईं!" count={5000} suffix="+" delay={1} />
            <Stat img="/Images%20Sourabh/counter3.webp" label="10 सालों में Patients की Medical Bills बचाई!" count={100} prefix="₹" suffix=" करोड़+" delay={2} />
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="section section--soft-lite">
        <div className="container">
          <div className="section-head reveal">
            <h2><span className="green">Spine, Knee या Neck Pain</span> से Relief चाहते हैं?</h2>
          </div>

          <img className="pain-section__img reveal" src="/Images%20Sourabh/Hindi%20program.webp" alt="4 common signs you need FM4 therapy" loading="lazy" />

          <div className="pain-section__mobile">
            <img className="pain-section__img-mobile reveal" src="/Images%20Sourabh/mobileprogram.webp" alt="" loading="lazy" />
            <div className="pain-questions__cards">
              <PainQ n={1} html='क्या आपका <strong>Chronic Pain</strong> आपके <strong>Personal और Professional Life</strong> को Impact कर रहा है, जिससे आप अपने Future को लेकर चिंतित हैं?' />
              <PainQ n={2} html='क्या आप अपना <strong>कीमती समय और पैसा</strong> Medicines, Physiotherapy या Injections पर बर्बाद कर रहे हैं, पर पूरी तरह Solution नहीं मिल रहा?' delay={1} />
              <PainQ n={3} html='क्या आप उन्हीं पुरानी <strong>Yoga Therapies</strong>, <strong>Traditional Therapies</strong> और अन्य Therapies से थक चुके हैं, पर <strong>Pain Relief</strong> नहीं मिला?' delay={2} />
              <PainQ n={4} html='क्या आप Confused हैं कि कौन-सा तरीका वाकई आपको <strong>Pain से Long-Term Relief</strong> दिला सकता है?' delay={3} />
            </div>
          </div>

          <p className="pain-conclusion reveal">
            बहुत सारे लोग अपनी Daily Life में Spine, Knee या Neck की तकलीफ़ का सामना करते हैं।<br />
            <span className="green">अब यह Possible है कि आप अपने घर से ही Pain को Effectively Manage और कम कर सकें</span>
          </p>

          <div className="cta-block reveal">
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी बैक गारंटी</span>
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS — DUAL MARQUEE */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">रिव्यूज़</span>
            <h2>खुश और संतुष्ट कस्टमर्स के Success रिव्यूज़</h2>
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
            <span className="eyebrow">बड़ा सवाल यह है</span>
            <h2>इस 2-Day Live Workshop में आप क्या Experience करेंगे?</h2>
          </div>
          <div className="experience">
            <article className="experience__card reveal">
              <div className="experience__num">1.</div>
              <h3>Personalized Pain Assessment पाएं</h3>
              <p>जानें कि आपके Pain का असली Root Cause क्या है — <em>LIVE.</em></p>
            </article>
            <article className="experience__card reveal reveal-delay-1">
              <div className="experience__num">2.</div>
              <h3>FM4 Therapy को LIVE Experience करें</h3>
              <p>वही Therapy जिसने <em>10000+ लोगों को Naturally Pain-Free जीने में मदद की</em> — कोई Medicines नहीं, कोई Surgery नहीं।</p>
            </article>
          </div>
          <div className="cta-block mt-3 reveal">
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी बैक गारंटी</span>
          </div>
        </div>
      </section>

      {/* CURRICULUM TIMELINE */}
      <section className="section section--soft-lite">
        <div className="container">
          <div className="section-head reveal">
            <h2>इस <span className="green">Workshop</span> में हम क्या Cover करेंगे?</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--c-ink-soft)' }}>
              जानें Practical Solutions कि कैसे यह Proven <strong>FM4 Therapy</strong>{' '}
              आपके जीवन को <strong style={{ color: 'var(--c-primary-d)' }}>30-60 दिनों में Pain-Free</strong> बना सकती है
            </p>
          </div>

          <div className="timeline" id="curriculumTimeline">
            <div className="timeline__line" aria-hidden="true">
              <div className="timeline__progress" id="timelineProgress"></div>
            </div>
            <article className="timeline__step timeline__step--left timeline__step--1 reveal">
              <div className="timeline__num">Step 1</div>
              <div className="timeline__pill">Root Cause की पहचान (FM-1)</div>
              <p>अपने <strong>Spine, Neck या Knee Pain</strong> के असली Cause को cutting-edge Assessment Tests से Identify करें, जो basic Diagnosis से कहीं आगे जाते हैं।</p>
            </article>
            <div className="timeline__icon timeline__icon--1 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-1.svg" alt="" /></div>

            <div className="timeline__icon timeline__icon--2 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-2.svg" alt="" /></div>
            <article className="timeline__step timeline__step--right timeline__step--2 reveal">
              <div className="timeline__num">Step 2</div>
              <div className="timeline__pill">Trigger Points का Release (FM-2)</div>
              <p>अपनी Muscles की उन <strong>Knots को Gently Release</strong> करें जो Pain का कारण हैं, ताकि आपको बिना किसी Medicine के Relief मिले।</p>
            </article>

            <article className="timeline__step timeline__step--left timeline__step--3 reveal">
              <div className="timeline__num">Step 3</div>
              <div className="timeline__pill">Weak Muscles को Strong बनाना (FM-3)</div>
              <p><strong>आसान Exercises</strong> जो आपके Weak Areas में Strength rebuild करती हैं, ताकि आप Safely और Confidently move कर सकें।</p>
            </article>
            <div className="timeline__icon timeline__icon--3 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-3.svg" alt="" /></div>

            <div className="timeline__icon timeline__icon--4 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-4.svg" alt="" /></div>
            <article className="timeline__step timeline__step--right timeline__step--4 reveal">
              <div className="timeline__num">Step 4</div>
              <div className="timeline__pill">Flexibility बढ़ाना (FM-4)</div>
              <p>अपनी <strong>body के Bending और Stretching</strong> को बेहतर बनाएं, जिससे चलने या कुछ उठाने जैसे रोज़मर्रा के Movements आसान और Pain-Free हो जाएं।</p>
            </article>
          </div>

          <div className="cta-block reveal mt-3">
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी बैक गारंटी</span>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">किनके लिए</span>
            <h2>यह Workshop किनके लिए है?</h2>
          </div>
          <div className="audience">
            <Aud src="icon-audience-1.svg" title="Busy Business Owners" copy="जो Frustrating Back, Neck या Knee Pain के कारण अपना Business ठीक से नहीं संभाल पा रहे।" />
            <Aud src="icon-audience-2.svg" title="Desk Job Employees"   copy="जो लंबे घंटे बैठकर काम करते हैं और अपनी Posture Improve या Back-Induced Pain ख़त्म करना चाहते हैं।" delay={1} />
            <Aud src="icon-audience-3.svg" title="Older Adults (55+)"   copy="जो Gentle और Effective Techniques से Pain से Relief पाना और Mobility & Comfort के लिए Posture Improve करना चाहते हैं।" delay={2} />
            <Aud src="icon-audience-4.svg" title="Busy या Working Moms" copy="वे Women जो Body Pain के कारण घर और काम के Day-to-Day कामों में मुश्किल महसूस कर रही हैं।" delay={3} />
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">मिलिए अपने Instructor से</span>
            <h2>मिलिए <span className="green">Sourobh Kulkorni</span> से</h2>
          </div>

          <div className="instructor-row reveal">
            <div className="slider" id="instructorSlider">
              <div className="slider__slide is-active" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images1.png')` }} role="img" aria-label="Sourobh Kulkarni — image 1"></div>
              <div className="slider__slide" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images2.png')` }} role="img" aria-label="Sourobh Kulkarni — image 2"></div>
              <div className="slider__slide" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images3.png')` }} role="img" aria-label="Sourobh Kulkarni — image 3"></div>
            </div>
            <div className="instructor__body">
              <h3>Health &amp; Fitness Industry में 19 वर्षों का Expertise</h3>
              <p>Sourobh Kulkarni ने <strong>10,000 से ज़्यादा Clients</strong> को Chronic Pain से Overcome करने में मदद की है, जिसमें Back, Neck और Knees की तकलीफ़ के साथ-साथ Mobility की कई अन्य Challenges भी शामिल हैं।</p>
            </div>
          </div>

          <div className="instructor-row instructor-row--video reveal">
            <div className="instructor__body">
              <h3>Fitness Industry में Amazing Performer — 2024</h3>
              <p>एक ऐसा Solution जो हर तरह के Clients पर Effective साबित हुआ है — Famous Celebrities और Athletes से लेकर Busy Working Professionals, Stay-at-Home Parents और बुज़ुर्ग Patients तक।</p>
              <p>उनका Approach Holistic और Non-Invasive है, जो Medications, Surgeries या Traditional Physiotherapy पर निर्भर हुए बिना Long-Lasting Relief देता है। Sourobh की Unique Therapy <strong>Pain के असली Root Causes को Address करती है, सिर्फ़ Symptoms को Mask करने पर नहीं</strong> — इसीलिए उनके तरीक़े उन्हें Health Domain के सबसे Successful Experts में से एक बनाते हैं।</p>
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
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी बैक गारंटी</span>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">सोशल प्रूफ</span>
            <div className="gr-head">
              <span className="gr-head__rating">Rated 4.6</span>
              <span className="gr-head__stars">★★★★★</span>
              <span className="gr-head__count">| 1000+ रिव्यूज़ Google Reviews पर</span>
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
            <h2>अक्सर पूछे जाने वाले प्रश्न</h2>
            <p>Common सवालों के जवाब पाएं और किसी भी Doubt को Clear करें ताकि आप हमारी Services का Maximum लाभ ले सकें।</p>
          </div>
          <div className="faq reveal">
            <FaqItem q="क्या आप Severe Conditions के लिए Complete Pain Relief की Guarantee देते हैं?" a="FM4 Therapy Movement, Posture Correction और Targeted Exercises के through Pain के Root Causes को Address करती है। ज़्यादातर Participants को Significant Relief मिलता है, लेकिन Individual Results आपकी Condition की Severity, Practice की Consistency और दूसरे Health Factors पर depend करते हैं।" />
            <FaqItem q="FM4 Therapy क्या है?" a="FM4 Therapy एक Proven 4-phase Treatment है जो Spine, Neck और Knees में Pain के Root Causes को Target करती है, और Non-invasive Techniques से Lasting Relief देती है। इसमें Cause Identify करना, Muscle Tension Release करना, Weak Muscles को Strong बनाना और Flexibility Improve करना शामिल है।" />
            <FaqItem q="यह Therapy कैसे Deliver की जाती है?" a="यह 2-Day Live Workshop पूरी तरह Online — एक Private Video Conferencing Room के through Deliver की जाती है। Booking के तुरंत बाद आपको Email और WhatsApp पर Access Link मिल जाता है। Workshop Hindi और English दोनों में होती है ताकि पूरा परिवार Participate कर सके।" />
            <FaqItem q="क्या Workshop join करने के लिए कोई Special Equipment चाहिए?" a="कोई Special Equipment ज़रूरी नहीं। एक Smartphone, Tablet या Laptop और Stable Internet Connection काफ़ी है। Ideal रहेगा कि आपके पास एक Yoga Mat या Flat Carpeted Area हो, और Loose, Comfortable Clothes पहनें ताकि आप Freely Move कर सकें।" />
            <FaqItem q="यह Workshop Market में मौजूद बाक़ी चीज़ों से कैसे अलग है?" a="ज़्यादातर Programs सिर्फ़ Temporary Symptom Relief पर Focus करते हैं — Painkillers, Massages या Generic Exercises। FM4 Therapy एक 4-phase Root-Cause Framework है जिसे 19 साल और 10,000+ Clients के साथ Refine किया गया है। हर Participant को LIVE एक Personalized Pain Assessment मिलता है।" />
            <FaqItem q="मैं Workshop कैसे Join करूँ?" a={`इस Page पर किसी भी "Book Now" Button पर Click करें, Razorpay के through Secure Booking पूरी करें, और आपको Email व WhatsApp पर Workshop Access Link मिल जाएगा। मिलते हैं Live — ${schedule.faqDates} को।`} />
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
            केवल <span className="js-seat-count">11</span> सीट्स बाकी
          </div>
          <CheckoutLink className="btn btn--cta sticky-cta__btn">अभी बुक करें → 81% OFF</CheckoutLink>
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
      <div className="stat__eyebrow">कूल नंबर</div>
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
