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
    आत्ताच जागा बुक करा फक्त <s className="price-old">₹{pricing.client.originalInr}</s>{' '}
    <span className="price-new">₹{pricing.client.inr}</span>
  </>
);

export default function LandingPageMar() {
  return (
    <>
      {/* Top urgency strip */}
      <div className="topbar">
        <strong>आत्ताच बुक करा → 81% OFF मिळवा</strong> · फक्त <span className="js-seat-count">11</span> जागा शिल्लक · जागा संपताच Booking बंद!
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero__head reveal">
            <span className="hero__eyebrow">वेदनामुक्त आयुष्याची गुरुकिल्ली — फक्त Busy Professionals, Entrepreneurs व त्यांच्या प्रियजनांसाठी!</span>
            <h1 className="hero__title hero__title--devanagari">
              <span className="hero__title-line">जाणून घ्या कसे तुम्ही</span>
              <span className="hero__title-line green">गुडघेदुखी, मानदुखी व मणक्याचे दुखणे</span>
              <span className="hero__title-line">कायमचे आणि नैसर्गिकरीत्या बरे करू शकता</span>
            </h1>
            <p className="hero__sub">कोणत्याही औषधांशिवाय, शस्त्रक्रियेविना, फिजिओ, Chiro किंवा तेल-मालिश न करता</p>

            <div className="hero__reviews" aria-label="4.6 out of 5 rating on Google Reviews">
              <span className="hero__reviews-stars" aria-hidden="true">★★★★★</span>
              <strong>4.6</strong>
              <span className="hero__reviews-sep" aria-hidden="true">|</span>
              <span>1000+ Reviews</span>
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
            <aside className="hero__vsl hero__vsl--mini-play reveal" id="vslContainer" aria-label="Workshop preview video">
              <img className="hero__vsl-poster-img" src="/Images%20Sourabh/marathi%20thumbnail.png" alt="FM4 Therapy workshop preview" />
              <div className="hero__vsl-poster" role="button" tabIndex={0} aria-label="Play workshop video">
                <div className="hero__vsl-play" aria-hidden="true"></div>
                <span className="hero__vsl-tag">▶ 3-मिनिटांचे Preview पहा</span>
              </div>
            </aside>

            <div className="hero__col-right reveal reveal-delay-1">
              <div className="info-grid">
                <InfoCard label="तारीख" value={schedule.dateRange} icon={<CalendarIcon/>} />
                <InfoCard label="वेळ" value={schedule.day1} sub={schedule.day2} icon={<ClockIcon/>} />
                <InfoCard label="Live Workshop" value="2 दिवस" icon={<VideoIcon/>} />
                <InfoCard label="भाषा" value="Hindi & English" icon={<GlobeIcon/>} />
              </div>

              <div className="cta-block hero__cta">
                <CheckoutLink className="btn btn--cta btn--lg hero__cta-btn">
                  <span className="hero__cta-btn__main">
                    आत्ताच बुक करा – 81% OFF मिळवा
                    <span className="hero__cta-btn__arrow" aria-hidden="true">→</span>
                  </span>
                </CheckoutLink>
                <span className="guarantee">100% मनी-बॅक गॅरंटी</span>
              </div>

              <div className="scarcity">
                फक्त <span className="js-seat-count">11</span> जागा शिल्लक
                <span className="scarcity__sep"> — </span>
                <span className="scarcity__line2">जागा संपताच Booking बंद!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section">
        <div className="container">
          <div className="stats">
            <Stat img="/Images%20Sourabh/counter1.webp" label="मणका, गुडघे व मानदुखी यशस्वीपणे बरी झाली!" count={10000} suffix="+" />
            <Stat img="/Images%20Sourabh/counter2.png"  label="टाळलेल्या शस्त्रक्रिया!" count={5000} suffix="+" delay={1} />
            <Stat img="/Images%20Sourabh/counter3.webp" label="10 वर्षांत रुग्णांचा वैद्यकीय खर्च वाचवला!" count={100} prefix="₹" suffix=" कोटी+" delay={2} />
          </div>
        </div>
      </section>

      {/* PAIN SECTION */}
      <section className="section section--soft-lite">
        <div className="container">
          <div className="section-head reveal">
            <h2><span className="green">मणका, गुडघे किंवा मानदुखीतून</span> आराम हवा आहे?</h2>
          </div>

          <img className="pain-section__img pain-section__img--all reveal" src="/Images%20Sourabh/pain.webp" alt="4 common signs you need FM4 therapy" loading="lazy" />

          <p className="pain-conclusion reveal">
            खूप लोक त्यांच्या दैनंदिन जीवनात मणका, गुडघे किंवा मानेच्या दुखण्याचा अनुभव घेतात.<br />
            <span className="green">आता तुम्ही घरबसल्या प्रभावीपणे वेदना Manage करून ती कमी करू शकता</span>
          </p>

          <div className="cta-block reveal">
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी-बॅक गॅरंटी</span>
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS — DUAL MARQUEE */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">Reviews</span>
            <h2>आनंदी आणि समाधानी ग्राहकांचे Success Reviews</h2>
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
            <span className="eyebrow">सर्वात महत्त्वाचा प्रश्न</span>
            <h2>या 2-दिवसीय Live Workshop मध्ये तुम्हाला काय अनुभव मिळेल?</h2>
          </div>
          <div className="experience">
            <article className="experience__card reveal">
              <div className="experience__num">1.</div>
              <h3>Personalized Pain Assessment मिळवा</h3>
              <p>तुमच्या वेदनेचे खरे मूळ कारण नेमके काय आहे ते जाणून घ्या — <em>LIVE.</em></p>
            </article>
            <article className="experience__card reveal reveal-delay-1">
              <div className="experience__num">2.</div>
              <h3>FM4 Therapy ची LIVE अनुभूती घ्या</h3>
              <p>तीच Therapy जिने <em>10000+ लोकांना नैसर्गिकरीत्या वेदनामुक्त जीवन दिले</em> — कोणतीही औषधे नाहीत, शस्त्रक्रिया नाही.</p>
            </article>
          </div>
          <div className="cta-block mt-3 reveal">
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी-बॅक गॅरंटी</span>
          </div>
        </div>
      </section>

      {/* CURRICULUM TIMELINE */}
      <section className="section section--soft-lite">
        <div className="container">
          <div className="section-head reveal">
            <h2>या <span className="green">Workshop</span> मध्ये आपण काय शिकणार?</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--c-ink-soft)' }}>
              जाणून घ्या Practical Solutions — ही Proven <strong>FM4 Therapy</strong>{' '}
              तुमचे जीवन <strong style={{ color: 'var(--c-primary-d)' }}>30-60 दिवसांत Pain-Free</strong> कसे करू शकते
            </p>
          </div>

          <div className="timeline" id="curriculumTimeline">
            <div className="timeline__line" aria-hidden="true">
              <div className="timeline__progress" id="timelineProgress"></div>
            </div>
            <article className="timeline__step timeline__step--left timeline__step--1 reveal">
              <div className="timeline__num">Step 1</div>
              <div className="timeline__pill">मूळ कारणाची ओळख (FM-1)</div>
              <p>मणका, मान किंवा गुडघेदुखीचे <strong>खरे मूळ कारण</strong> अत्याधुनिक Assessment Tests द्वारे ओळखा — जे साध्या Diagnosis पेक्षा खूप पुढे जातात.</p>
            </article>
            <div className="timeline__icon timeline__icon--1 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-1.svg" alt="" /></div>

            <div className="timeline__icon timeline__icon--2 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-2.svg" alt="" /></div>
            <article className="timeline__step timeline__step--right timeline__step--2 reveal">
              <div className="timeline__num">Step 2</div>
              <div className="timeline__pill">Trigger Points मोकळे करा (FM-2)</div>
              <p>स्नायूंमधील वेदना निर्माण करणाऱ्या <strong>गाठी सोप्या पद्धतीने मोकळ्या</strong> करा, ज्यामुळे कोणत्याही औषधाशिवाय आराम मिळेल.</p>
            </article>

            <article className="timeline__step timeline__step--left timeline__step--3 reveal">
              <div className="timeline__num">Step 3</div>
              <div className="timeline__pill">कमजोर स्नायू बळकट करा (FM-3)</div>
              <p><strong>सोपे Exercises</strong> जे तुमच्या कमजोर भागांमध्ये Strength पुन्हा निर्माण करतात — जेणेकरून तुम्ही सुरक्षित आणि आत्मविश्वासाने हालचाल करू शकाल.</p>
            </article>
            <div className="timeline__icon timeline__icon--3 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-3.svg" alt="" /></div>

            <div className="timeline__icon timeline__icon--4 reveal" aria-hidden="true"><img src="/Images%20Sourabh/icon-timeline-4.svg" alt="" /></div>
            <article className="timeline__step timeline__step--right timeline__step--4 reveal">
              <div className="timeline__num">Step 4</div>
              <div className="timeline__pill">लवचिकता वाढवा (FM-4)</div>
              <p>शरीराचे <strong>वाकणे आणि ताणणे</strong> सोपे करा — चालणे किंवा एखादी वस्तू उचलणे यांसारख्या रोजच्या हालचाली सहज आणि Pain-Free होतील.</p>
            </article>
          </div>

          <div className="cta-block reveal mt-3">
            <CheckoutLink className="btn btn--cta btn--lg">{CTA}</CheckoutLink>
            <span className="guarantee">100% मनी-बॅक गॅरंटी</span>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">कोणासाठी</span>
            <h2>ही Workshop कोणासाठी आहे?</h2>
          </div>
          <div className="audience">
            <Aud src="icon-audience-1.svg" title="व्यस्त Business Owners" copy="ज्यांना त्रासदायक पाठ, मान किंवा गुडघेदुखीमुळे आपला Business नीट सांभाळणे कठीण होत आहे." />
            <Aud src="icon-audience-2.svg" title="Desk Job करणारे" copy="जे लांब वेळ बसून काम करतात आणि आपली Posture सुधारायची किंवा Back-Pain संपवायची इच्छा आहे." delay={1} />
            <Aud src="icon-audience-3.svg" title="ज्येष्ठ नागरिक (55+)" copy="ज्यांना सौम्य पण प्रभावी Techniques द्वारे वेदनेपासून आराम आणि चांगल्या Mobility व Comfort साठी Posture सुधारायची आहे." delay={2} />
            <Aud src="icon-audience-4.svg" title="व्यस्त किंवा काम करणाऱ्या Moms" copy="ज्या महिलांना अंगदुखीमुळे घर आणि कामाच्या रोजच्या जबाबदाऱ्या सांभाळणे कठीण होत आहे." delay={3} />
          </div>
        </div>
      </section>

      {/* INSTRUCTOR */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">तुमच्या Instructor ला भेटा</span>
            <h2>भेटा <span className="green">Sourobh Kulkorni</span> ना</h2>
          </div>

          <div className="instructor-row reveal">
            <div className="slider" id="instructorSlider">
              <div className="slider__slide is-active" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images1.png')` }} role="img" aria-label="Sourobh Kulkarni — image 1"></div>
              <div className="slider__slide" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images2.png')` }} role="img" aria-label="Sourobh Kulkarni — image 2"></div>
              <div className="slider__slide" style={{ backgroundImage: `url('/Images%20Sourabh/sourabh%20images3.png')` }} role="img" aria-label="Sourobh Kulkarni — image 3"></div>
            </div>
            <div className="instructor__body">
              <h3>Health &amp; Fitness Industry मध्ये 19 वर्षांचा अनुभव</h3>
              <p>सौरभ कुलकर्णी यांनी <strong>10,000 हून अधिक Clients</strong> ना Chronic वेदनेपासून बाहेर पडण्यास मदत केली आहे — यात पाठ, मान, गुडघे यांचे दुखणे तसेच Mobility च्या इतर अनेक अडचणींचा समावेश आहे.</p>
            </div>
          </div>

          <div className="instructor-row instructor-row--video reveal">
            <div className="instructor__body">
              <h3>Fitness Industry मधील Amazing Performer — 2024</h3>
              <p>एक असे Solution जे विविध प्रकारच्या Clients साठी प्रभावी सिद्ध झाले आहे — प्रसिद्ध Celebrities आणि खेळाडूंपासून ते व्यस्त Working Professionals, गृहिणी आणि ज्येष्ठ रुग्णांपर्यंत.</p>
              <p>त्यांचा Approach Holistic आणि Non-Invasive आहे — औषधे, शस्त्रक्रिया किंवा Traditional Physiotherapy वर अवलंबून न राहता दीर्घकालीन आराम देतो. सौरभ यांची खास Therapy <strong>वेदनेच्या लक्षणांवर पांघरूण घालण्याऐवजी तिच्या खऱ्या मूळ कारणावर</strong> काम करते — म्हणूनच त्यांना Health क्षेत्रातील सर्वात यशस्वी Experts पैकी एक मानले जाते.</p>
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
            <span className="guarantee">100% मनी-बॅक गॅरंटी</span>
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
              <span className="gr-head__count">| 1000+ Reviews Google वर</span>
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
            <h2>वारंवार विचारले जाणारे प्रश्न</h2>
            <p>सामान्य प्रश्नांची उत्तरे मिळवा आणि कोणतीही शंका दूर करा — जेणेकरून तुम्ही आमच्या Services चा पुरेपूर लाभ घेऊ शकाल.</p>
          </div>
          <div className="faq reveal">
            <FaqItem q="गंभीर परिस्थितींसाठी संपूर्ण Pain Relief ची Guarantee तुम्ही देता का?" a="FM4 Therapy Movement, Posture Correction आणि Targeted Exercises द्वारे वेदनेच्या मूळ कारणांवर काम करते. बहुतांश Participants ना लक्षणीय आराम मिळतो, मात्र Individual Results तुमच्या Condition ची तीव्रता, Practice ची सातत्यता आणि इतर Health घटकांवर अवलंबून असतात." />
            <FaqItem q="FM4 Therapy म्हणजे काय?" a="FM4 Therapy हा एक Proven 4-phase Treatment आहे जो मणका, मान आणि गुडघ्यातील वेदनेच्या मूळ कारणांवर काम करतो आणि Non-invasive Techniques द्वारे दीर्घकाळ टिकणारा आराम देतो. यात कारण ओळखणे, स्नायूंचा ताण मोकळा करणे, कमजोर स्नायू बळकट करणे आणि लवचिकता वाढवणे यांचा समावेश आहे." />
            <FaqItem q="ही Therapy तुम्ही कशी देता?" a="ही 2-Day Live Workshop पूर्णपणे Online — Private Video Conferencing Room द्वारे घेतली जाते. Booking केल्यावर लगेच तुम्हाला Email आणि WhatsApp वर Access Link मिळतो. Workshop हिंदी आणि English दोन्ही भाषांमध्ये घेतली जाते जेणेकरून संपूर्ण कुटुंब भाग घेऊ शकेल." />
            <FaqItem q="Workshop join करण्यासाठी कोणत्याही Special Equipment ची गरज आहे का?" a="Special Equipment ची काहीही गरज नाही. एक Smartphone, Tablet किंवा Laptop आणि Stable Internet Connection पुरेसे आहे. Ideal म्हणजे एक Yoga Mat किंवा सपाट Carpeted जागा असावी, आणि सैल, Comfortable कपडे घाला — जेणेकरून तुम्ही मोकळेपणाने हालचाल करू शकाल." />
            <FaqItem q="ही Workshop Market मधील इतरांपेक्षा वेगळी कशी?" a="बहुतांश Programs फक्त तात्पुरत्या Symptom Relief वर भर देतात — Painkillers, Massages किंवा Generic Exercises. FM4 Therapy एक 4-phase Root-Cause Framework आहे — 19 वर्षे आणि 10,000+ Clients वर Refine केलेला. प्रत्येक Participant ला LIVE Personalized Pain Assessment मिळते." />
            <FaqItem q="मी Workshop कशी Join करू?" a={`या Page वरील कोणतेही "Book Now" Button क्लिक करा, Razorpay द्वारे सुरक्षित Booking पूर्ण करा — आणि तुम्हाला Email व WhatsApp वर Workshop Access Link मिळेल. ${schedule.faqDates} ला Live भेटूया.`} />
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
            फक्त <span className="js-seat-count">11</span> जागा शिल्लक
          </div>
          <CheckoutLink className="btn btn--cta sticky-cta__btn">आत्ताच बुक करा → 81% OFF</CheckoutLink>
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
