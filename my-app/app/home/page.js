"use client";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/images/GRAD.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Empowering Special Needs Families</h1>
          <p>Find trusted services, schools, and specialists easily.</p>

          <div className="hero-buttons">
            <a className="btn-primary" href="#services">
              Explore
            </a>
            <a className="btn-secondary" href="#about">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section className="categories" id="services">
        <h2 className="zeft-text" style={{ textAlign: "center" }}>
          Our Services
        </h2>

        <p className="subtitle" style={{ textAlign: "center" }}>
          Explore trusted services tailored for special needs families.
        </p>

        <div className="categories-grid">
          <div className="card">
            <h3>Sport</h3>
            <p>AI-powered assistance and activities.</p>
          </div>

          <div className="card">
            <h3>School</h3>
            <p>Professional educational support.</p>
          </div>

          <div className="card">
            <h3>Medical</h3>
            <p>Specialized healthcare services.</p>
          </div>

          <div className="card">
            <h3>Specialists</h3>
            <p>Connect with trusted experts.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-container">
          <div className="about-text">
            <h1 className="small-title zeft-text">ABOUT US</h1>
            <h3 className="zeft-text">Empowering Families</h3>

            <p className="zeft-text">
              We are a dedicated platform designed to support parents of
              children with special needs by connecting them with trusted
              sports, educational, and medical services.
            </p>

            <a className="btn-primary" href="#services">
              Explore More
            </a>
          </div>

          <div className="about-images">
            <img
              src="/images/image (2).png"
              className="img img1"
              alt="About image 1"
            />
            <img
              src="/images/image (3).png"
              className="img img2"
              alt="About image 2"
            />
            <img
              src="/images/image (1).png"
              className="img img3"
              alt="About image 3"
            />
          </div>
        </div>
      </section>

      <section className="story">
        <h2 className="zeft-text">Take a turn towards our inspiring story</h2>

        <div className="story-grid">
          <div className="story-card">
            <img src="/images/Trn 1.png" alt="Our Goals" />
            <h4>Our Goals</h4>
            <p>To give you best options</p>
          </div>

          <div className="story-card">
            <img src="/images/Trn 2.png" alt="Our Vision" />
            <h4>Our Vision</h4>
            <p>Trust us for your loved ones</p>
          </div>

          <div className="story-card">
            <img src="/images/Trn 3.png" alt="Our Mission" />
            <h4>Our Mission</h4>
            <p>Providing the best choices</p>
          </div>

          <div className="story-card">
            <img src="/images/Trn 4.png" alt="Our Story" />
            <h4>Our Story</h4>
            <p>How we started</p>
          </div>
        </div>
      </section>

      <section className="insp-contact" id="contact">
        <div className="insp-contact-container">
          <div className="insp-contact-form">
            <h2 className="zeft-text">Get in touch</h2>

            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Phone number" />
            <textarea placeholder="Leave us a message"></textarea>

            <button className="insp-btn-primary" type="button">
              Send Message
            </button>
          </div>

          <div className="insp-contact-info">
            <h2>We&apos;d love to hear from you</h2>

            <p>
              <img src="/Icons/2250206.png" width="25" alt="Email icon" />
              inspirability@gmail.com
            </p>

            <p>
              <img src="/Icons/phone.png" width="25" alt="Phone icon" />
              01004292334
            </p>

            <p>
              <img
                src="/Icons/icon-for-customer-service-vector.png"
                width="25"
                alt="Support icon"
              />
              24/7 services at any time
            </p>
          </div>
        </div>
      </section>
    </>
  );
}