import "../../styles/hero.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
export default function Hero() {
  return (
    <section className="hero">
      <div className="overlay"></div>
      <div className="hero-content">
        <h1>Welcome to Inspirability</h1>
        <div className="icons">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fas fa-phone"></i>
        </div>
      </div>
    </section>
  );
}
