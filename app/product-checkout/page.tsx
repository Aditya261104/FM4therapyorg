import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';
import Footer from '@/components/Footer';
import SeatCounter from '@/components/SeatCounter';

export const metadata: Metadata = {
  title: 'Book FM4 Workshop · Secure Checkout',
};

export default function CheckoutPage() {
  return (
    <>
      <div className="topbar">
        <strong>Secure Checkout</strong> · 100% Money Back Guarantee · Last <span className="js-seat-count">50</span> Seats Left
      </div>

      <section className="checkout-section">
        <div className="container">
          <CheckoutForm />
        </div>
      </section>

      <SeatCounter />
      <Footer />
    </>
  );
}
