import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Book FM4 Workshop · Secure Checkout',
};

export default function CheckoutPage() {
  return (
    <>
      <div className="topbar">
        <strong>Secure Checkout</strong> · 100% Money Back Guarantee · Last 11 Seats Left
      </div>

      <section className="checkout-section">
        <div className="container">
          <CheckoutForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
