import "../../styles/contact.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
export default function Contact() {
  return (
    <section className="contact">
      <div className="contact-container">
        <div className="contact-form">
          <h2>Get in touch</h2>
          <p>We'd love to hear from you. Please fill out this form.</p>
          <div className="row">
            <div className="input-group">
              <label>First name</label>
              <input type="text" placeholder="First name" />
            </div>
            <div className="input-group">
              <label>Last name</label>
              <input type="text" placeholder="Last name" />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="you@company.com" />
          </div>
          <div className="input-group">
            <label>Phone number</label>
            <input type="text" placeholder="Eg +01 008754320" />
          </div>
          <div className="input-group">
            <label>Message</label>
            <textarea placeholder="Leave us a message..."></textarea>
          </div>
          <div className="checkbox">
            <input type="checkbox" />
            <span>You agree to our friendly privacy policy.</span>
          </div>
          <button className="submit-btn">Send Message</button>
        </div>

        <div className="contact-info">
          <h2>We'd love to hear from you</h2>
          <p>Need something cleared up? Here are our most frequently asked questions.</p>
          <div className="info-grid">
            <div className="info-item">
              <div className="icon email">
                <i className="fas fa-envelope"></i>
              </div>
              <h4>Email</h4>
              <p>Our friendly team is here to help.</p>
              <span>inspirability@gmail.com</span>
            </div>
            <div className="info-item">
              <div className="icon phone">
                <i className="fas fa-phone"></i>
              </div>
              <h4>Phone</h4>
              <p>Mon-Fri from 8am to 5pm.</p>
              <span>01004292334</span>
            </div>
            <div className="info-item">
              <div className="icon location">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h4>Office</h4>
              <p>Come say hello at our office .</p>
              <span>24/7 services at any time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
