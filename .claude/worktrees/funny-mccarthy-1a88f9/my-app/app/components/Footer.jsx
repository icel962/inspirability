import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div>
            <h4>About</h4>
            <p>Story</p>
            <p>Mission</p>
            <p>Vision</p>
            <p>Goals</p>
          </div>
          <div>
            <h4>Services</h4>
            <p>School</p>
            <p>Sport</p>
            <p>Medical</p>
            <p>Contacts</p>
          </div>
          <div>
            <h4>Quick links</h4>
            <p>Feedback</p>
            <p>Subscription</p>
            <p>Flat fee</p>
          </div>
        </div>

        <div className="footer-contact">
          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <span>+01004292334</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <span>Inspirability@gmail.com</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-heartbeat"></i>
            <span>24/7 Emergency services</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Privacy Policy | Terms and Conditions | Copyright Wide Studio LLP 2025</p>
      </div>
    </footer>
  );
}
