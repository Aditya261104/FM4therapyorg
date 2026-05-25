import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ThankYouTracker from '@/components/ThankYouTracker';
import { brand, schedule } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Thank You · FM4 Therapy',
};

export default function ThankYouPage() {
  return (
    <>
      <section className="thanks">
        <div className="container">
          <div className="thanks__card">
            <div className="thanks__icon thanks__icon--ok" aria-hidden="true">✓</div>
            <span className="thanks__pill">Woohoo!</span>
            <h1>You have Successfully Registered!</h1>
            <p className="thanks__sub">Just one more step remaining</p>

            <div className="thanks__caution">
              <strong>⚠️ Important:</strong> This step is essential so that you don&apos;t miss out on the session.
              <br /><br />
              Join the exclusive WhatsApp community to receive all your workshop updates and reminders.
            </div>

            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp btn--lg btn--block"
            >
              Click Here to Join Our Community Now
            </a>

            <p className="thanks__signoff">{schedule.thankYouSignoff} ✨</p>
          </div>
        </div>
      </section>

      <aside className="sticky-whatsapp" aria-label="Join WhatsApp community">
        <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
          💬 Join WhatsApp Community
        </a>
      </aside>

      <Footer />
      <ThankYouTracker />
    </>
  );
}
