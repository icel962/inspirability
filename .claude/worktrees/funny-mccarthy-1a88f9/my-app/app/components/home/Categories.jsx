import Link from "next/link";
import "../../styles/categories.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
export default function Categories() {
  return (
    <section className="categories">
      <h2>Our Categories</h2>
      <p className="subtitle">
        Explore trusted sports, school, and medical services plus verified
        tutors, coaches, and specialists, all in one place.
      </p>

      <div className="cards">
        <Link href="/sport" className="card" style={{ textDecoration: "none", color: "white" }}>
          <div>
            <i className="fas fa-medal"></i>
            <h3>Sport</h3>
            <p>Our support team will get assistance from AI-powered.</p>
          </div>
        </Link>

        <Link href="/school" className="card" style={{ textDecoration: "none", color: "white" }}>
          <div>
            <i className="fas fa-graduation-cap"></i>
            <h3>School</h3>
            <p>Our support team will get assistance from AI-powered.</p>
          </div>
        </Link>

        <Link href="/medical" className="card" style={{ textDecoration: "none", color: "white" }}>
          <div>
            <i className="fas fa-stethoscope"></i>
            <h3>Medical</h3>
            <p>Our support team will get assistance from AI-powered.</p>
          </div>
        </Link>

        <Link href="/contacts" className="card" style={{ textDecoration: "none", color: "white" }}>

        <div>
          <i className="fas fa-address-book"></i>
          <h3>Contacts</h3>
          <p>Our support team will get assistance from AI-powered.</p>
        </div>
       </Link>

      </div>

    </section>
  );
}
