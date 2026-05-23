import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { brand } from '@/lib/config';

export const metadata: Metadata = { title: 'Terms & Conditions · FM4 Therapy' };

export default function TermsPage() {
  return (
    <>
      <section className="legal">
        <div className="container">
          <article className="legal__card">
            <h1>Terms &amp; Conditions</h1>
            <p className="legal__lead">Welcome to Fitness Master Academy.</p>
            <p>By accessing and using our website and purchasing our products, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing the Fitness Master Academy website, you accept and agree to be bound by these Terms and Conditions. If you do not agree, you should not use our services.</p>

            <h2>2. Use of the Website</h2>
            <p>You agree to use the website for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the website.</p>

            <h2>3. Intellectual Property</h2>
            <p>All content on this website — text, graphics, logos, images, and software — is the property of Fitness Master Academy and is protected by international copyright laws. Unauthorized use is prohibited.</p>

            <h2>4. Purchase and Payment</h2>
            <p>All prices are in Indian Rupees (INR) unless otherwise stated. Payments must be made through the methods provided on our website. We reserve the right to change prices at any time without prior notice.</p>

            <h2>5. Digital Products</h2>
            <p>Our digital products are delivered via email with a link to access the materials. There are no shipping fees or physical deliveries involved.</p>

            <h2>6. Refund Policy</h2>
            <p>Please refer to our <a href="/refund-policy">Refund Policy</a> for full details.</p>

            <h2>7. Limitation of Liability</h2>
            <p>Fitness Master Academy will not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our liability is limited to the purchase price of the products you have purchased.</p>

            <h2>8. Privacy Policy</h2>
            <p>Please review our <a href="/privacy-policy">Privacy Policy</a>, which explains how we collect, use, and protect your personal information.</p>

            <h2>9. Changes to Terms and Conditions</h2>
            <p>We reserve the right to modify these Terms and Conditions at any time. Changes are effective immediately upon posting.</p>

            <h2>10. Governing Law</h2>
            <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Pune, Maharashtra.</p>

            <h2>11. Contact Information</h2>
            <p>
              <strong>Fitness Master Academy</strong><br />
              Address: {brand.address}<br />
              Email: <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </p>

            <p className="legal__sig">Thank you for choosing Fitness Master Academy.</p>
          </article>
        </div>
      </section>

      <Footer />
    </>
  );
}
