import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { brand } from '@/lib/config';

export const metadata: Metadata = { title: 'Privacy Policy · FM4 Therapy' };

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="legal">
        <div className="container">
          <article className="legal__card">
            <h1>Privacy &amp; Policy</h1>
            <p className="legal__lead">Fitness Master Academy is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website and use our services.</p>
            <p>This website is owned and operated by <strong>Sneha Enterprises</strong>.</p>
            <p>By accessing and using our website, you agree to the terms of this Privacy Policy.</p>

            <h2>1. Information We Collect</h2>
            <p>We collect information that you voluntarily provide when you register on our website, make a purchase, subscribe to our newsletter, or contact us for support. This may include:</p>
            <ul>
              <li>Name</li><li>Email address</li><li>Mailing address</li><li>Phone number</li><li>Payment information</li><li>Any other information you choose to provide</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To process and fulfill your orders</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To send updates, promotional materials, and newsletters</li>
              <li>To improve our website and services</li>
              <li>To understand your preferences and enhance your experience</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except: with trusted third-party service providers who assist us in operating our website (under confidentiality); when legally required; or in connection with a business transfer.</p>

            <h2>4. Data Security</h2>
            <p>We implement secure servers, encryption, and other technical and organizational measures designed to protect your information from unauthorized access, disclosure, alteration, or destruction.</p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience. You can turn off cookies via your browser, though some features may not function properly.</p>

            <h2>6. Third-Party Links</h2>
            <p>We may include third-party products or services. These third-party sites have separate privacy policies; we have no responsibility for their content.</p>

            <h2>7. Your Consent</h2>
            <p>By using our website, you consent to our website&apos;s privacy policy.</p>

            <h2>8. Changes to Our Privacy Policy</h2>
            <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date.</p>

            <h2>9. Contact Us</h2>
            <p>
              <strong>Fitness Master Academy</strong><br />
              Address: {brand.address}<br />
              Email: <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </p>

            <p className="legal__sig">
              Thank you for choosing Fitness Master Academy.<br />
              We are committed to protecting your privacy and providing a secure online experience.
            </p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
