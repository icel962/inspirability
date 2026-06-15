import "../styles/about.css";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
export default function AboutPage() {
  return (
    <main className="about-redesign">
      <section className="about-hero-modern">
        <div className="about-shell">
          <span className="about-kicker">Trusted support for every family</span>
          <h1 className="about-title">About Inspirability</h1>
          <p className="about-lead">
            We make it easier for families to discover trusted schools,
            specialists, and services through a thoughtful platform built around
            clarity, confidence, and care.
          </p>
        </div>
      </section>

      <section className="about-section about-story-section">
        <div className="about-shell">
          <div className="about-section-header about-section-header--center">
            <span className="about-section-kicker">Who We Are</span>
            <h2>A modern support platform designed around real life.</h2>
            <p>
              Inspirability brings educational, medical, and activity-based
              support into one clear experience for families searching for
              dependable help.
            </p>
          </div>

          <div className="about-story-gallery">
            <img
              src="/images/image (2).png"
              alt="Children learning together with support"
            />
            <img
              src="/images/image (1).png"
              alt="Children learning together with support"
            />
            <img
              src="/images/image (3).png"
              alt="Children learning together with support"
            />
          </div>
        </div>
      </section>

      <section className="about-section about-dual-section">
        <div className="about-shell about-dual-grid">
          <article className="about-dual-card">
            <span className="about-section-kicker">Our Mission</span>
            <h2>
              To simplify access to trusted support and give every family a
              smarter, more reassuring way to find the educational, medical, and
              social resources their child deserves.
            </h2>

            <div className="about-number-list">
              <div className="about-number-item">
                <span className="about-number-box">01</span>
                <p>
                  Curated service discovery for families of children with
                  special needs.
                </p>
              </div>
              <div className="about-number-item">
                <span className="about-number-box">02</span>
                <p>
                  Simple access to schools, specialists, trainers, and trusted
                  contacts.
                </p>
              </div>
              <div className="about-number-item">
                <span className="about-number-box">03</span>
                <p>
                  A more human experience built to reduce stress and support
                  better decisions.
                </p>
              </div>
            </div>
          </article>

          <article className="about-dual-card">
            <span className="about-section-kicker">Our Values</span>
            <h2>The principles behind every decision.</h2>
            <p className="about-dual-copy">
              We keep the experience focused on what families need most: trust,
              simplicity, and a sense that the platform is genuinely working in
              their corner.
            </p>

            <div className="about-number-list">
              <div className="about-number-item">
                <span className="about-number-box">01</span>
                <p>
                  Families need dependable information before they can make
                  meaningful choices.
                </p>
              </div>
              <div className="about-number-item">
                <span className="about-number-box">02</span>
                <p>
                  Good support should feel easy to understand, compare, and act
                  on without confusion.
                </p>
              </div>
              <div className="about-number-item">
                <span className="about-number-box">03</span>
                <p>
                  Helpful services should be easier to reach for more families
                  across different needs.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="about-section about-team-section" id="team">
        <div className="about-shell">
          <div className="about-team-head">
            <div className="about-section-header">
              <span className="about-section-kicker">Founders</span>
              <h2>The people shaping Inspirability.</h2>
              <p>
                A team focused on making care discovery more organized, more
                personal, and more empowering for families navigating important
                decisions.
              </p>
            </div>

            <a className="about-team-btn" href="#team">
              Explore All Team
            </a>
          </div>

          <div className="about-founders-grid">
            <article className="about-founder-card">
              <img src="/images/1.jpg" alt="Icel Ashraf portrait" />
              <div className="about-founder-body">
                <h3>Icel Ashraf</h3>
                <span className="about-founder-role">
                  Co-Founder &amp; Community Lead
                </span>
                <p>
                  Icel focuses on creating a warm, supportive experience that
                  helps parents feel seen, informed, and confident.
                </p>
                <a className="about-read-more" href="#team">
                  Read More <span>→</span>
                </a>
              </div>
            </article>

            <article className="about-founder-card">
              <img src="/images/2.jpg" alt="Seif Omar portrait" />
              <div className="about-founder-body">
                <h3>Seif Omar</h3>
                <span className="about-founder-role">
                  Co-Founder &amp; Product Lead
                </span>
                <p>
                  Seif shapes the platform into a practical tool families can
                  trust.
                </p>
                <a className="about-read-more" href="#team">
                  Read More <span>→</span>
                </a>
              </div>
            </article>

            <article className="about-founder-card">
              <img src="/images/2025-12-22.png" alt="Zeyad Ahmed portrait" />
              <div className="about-founder-body">
                <h3>Zeyad Ahmed</h3>
                <span className="about-founder-role">
                  Co-Founder &amp; Operations Lead
                </span>
                <p>
                  Zeyad works on building reliable connections across providers
                  and families.
                </p>
                <a className="about-read-more" href="#team">
                  Read More <span>→</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-section about-goals-section">
        <div className="about-shell">
          <div className="about-section-header about-section-header--center">
            <span className="about-section-kicker">Why it matters</span>
            <h2>
              We are building a better way to connect families with support.
            </h2>
            <p>
              Inspirability is designed to reduce friction, highlight trusted
              options, and bring the right resources closer to the families who
              need them most.
            </p>
          </div>

          <div className="about-stats-grid">
            <article className="about-stat">
              <strong>3 Core Areas</strong>
              <p>
                School, sport, and medical pathways organized in one experience.
              </p>
            </article>
            <article className="about-stat">
              <strong>1 Trusted Hub</strong>
              <p>
                A single place to explore providers, compare options, and move
                forward faster.
              </p>
            </article>
            <article className="about-stat">
              <strong>100% Family Focus</strong>
              <p>
                Every design decision starts with making life easier for parents
                and children.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}