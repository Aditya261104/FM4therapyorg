import { brand } from '@/lib/config';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__title">FM4 THERAPY · FM4 PAIN-FREE METHOD™</div>
          <p className="footer__disclaimer">
            All content and FM4 Therapy programs are intended for educational purposes only and do not guarantee specific results.
            This is not medical advice — always consult a qualified physician before starting any physical program. Individual
            results vary based on consistency, medical history and adherence. This website is not affiliated with or endorsed by
            Meta. FACEBOOK and INSTAGRAM are trademarks of Meta Platforms, Inc.
          </p>
          <div className="footer__copy">&copy; {year} {brand.ownerLegalName}. All rights reserved.</div>
          <nav className="footer__links" aria-label="Legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <span aria-hidden="true">·</span>
            <a href="/terms-conditions">Terms of Use</a>
            <span aria-hidden="true">·</span>
            <a href="/refund-policy">Refund Policy</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
