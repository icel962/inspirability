var MyClass = React.createClass({
  render: function() {
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Contact Details | Inspirability</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="stylesheet" href="contact-details.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <header className="site-header">
          <div className="site-header__inner">
            <a className="brand" href="index.html">
              <img src="logo.png" className="logo" alt="Inspirability logo" />
              <span>INSPIRABILITY</span>
            </a>
            <nav className="nav-links" aria-label="Primary navigation">
              <a href="index.html">Home</a>
              <a href="about.html">About</a>
              <div className="nav-services nav-services--active">
                <a href="index.html#services" className="nav-services__trigger nav-active" aria-current="page">Services</a>
                <div className="nav-services__menu" aria-label="Services sub-pages">
                  <a href="School.html">School</a>
                  <a href="Sport.html">Sport</a>
                  <a href="Medical.html">Medical</a>
                  <a href="contacts-desc.html" className="is-current">Contacts Directory</a>
                </div>
              </div>
              <a href="contact.html">Contact</a>
              <a href="login.html" className="login-btn">Login</a>
            </nav>
          </div>
        </header>
        <main className="contact-details-main">
          <section className="contact-details-section">
            <div className="contact-details-shell">
              <nav className="contact-details-breadcrumb" aria-label="Breadcrumb">
                <a href="index.html">Home</a>
                <span aria-hidden="true">/</span>
                <a href="contacts-desc.html">Contacts</a>
                <span aria-hidden="true">/</span>
                <span id="contactDetailsCrumb">Details</span>
              </nav>
              <div className="contact-details-shell__content" id="contactDetailsContent" aria-live="polite">
                <div className="contact-details-empty">
                  <h1>Loading contact details...</h1>
                  <p>Please wait while we load the selected contact information.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="insp-footer">
          <div className="insp-footer-container">
            <div className="insp-footer-col">
              <h4>About</h4>
              <a href="index.html#about">Story</a>
              <a href="index.html#about">Mission</a>
              <a href="index.html#about">Vision</a>
              <a href="index.html#about">Goals</a>
            </div>
            <div className="insp-footer-col">
              <h4>Services</h4>
              <a href="School.html">School</a>
              <a href="Sport.html">Sport</a>
              <a href="Medical.html">Medical</a>
              <a href="contacts-desc.html">Contacts Directory</a>
            </div>
            <div className="insp-footer-col">
              <h4>Quick links</h4>
              <a href="feedback.html">Feedback</a>
              <a href="Subscription.html">Subscription</a>
              <a href="Fee-Monthly.html">Flat fee</a>
            </div>
            <div className="insp-footer-col insp-footer-col--contact">
              <h4>Contact</h4>
              <p><img src="Icons/phone.png" width={20} className="below" alt="" /> +01004292334</p>
              <p><img src="Icons/2250206.png" width={20} alt="" /> inspirability@gmail.com</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
});