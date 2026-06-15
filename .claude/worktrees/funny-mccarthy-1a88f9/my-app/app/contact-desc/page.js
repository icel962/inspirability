var MyClass = React.createClass({
  render: function() {
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Contacts | Inspirability</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="stylesheet" href="contacts-desc.css" />
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
        <main className="contacts-main">
          <section className="contacts-section">
            <div className="contacts-shell">
              <div className="contacts-header">
                <h1 className="contacts-title">Contacts</h1>
                <p className="contacts-subtitle">Browse trusted specialists, teachers, therapists, and coaches through the services directory.</p>
              </div>
              <div className="contacts-toolbar">
                <div className="contacts-toolbar__main">
                  <label className="contacts-search" htmlFor="searchInput">
                    <span className="contacts-search__icon" aria-hidden="true">🔍</span>
                    <input id="searchInput" type="search" placeholder="Search contacts, specialties, email, or phone" />
                  </label>
                  <div className="contacts-filters" aria-label="Contact filters">
                    <div className="contacts-dropdown" data-dropdown="specialty">
                      <button type="button" className="contacts-filter-btn" data-filter="specialty" aria-expanded="false">
                        <span>Type / Specialty</span>
                        <span className="contacts-filter-btn__arrow" aria-hidden="true">▾</span>
                      </button>
                      <div className="contacts-dropdown-menu" role="menu">
                        <button type="button" className="contacts-dropdown-option" data-filter-value="specialty" data-value="all">All specialties</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="specialty" data-value="medical">Medical</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="specialty" data-value="education">Education</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="specialty" data-value="sports">Sports</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="specialty" data-value="therapy">Therapy</button>
                      </div>
                    </div>
                    <div className="contacts-dropdown" data-dropdown="budget">
                      <button type="button" className="contacts-filter-btn" data-filter="budget" aria-expanded="false">
                        <span>Budget</span>
                        <span className="contacts-filter-btn__arrow" aria-hidden="true">▾</span>
                      </button>
                      <div className="contacts-dropdown-menu" role="menu">
                        <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="all">Any budget</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="economy">Economy</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="standard">Standard</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="premium">Premium</button>
                      </div>
                    </div>
                    <div className="contacts-dropdown" data-dropdown="distance">
                      <button type="button" className="contacts-filter-btn" data-filter="distance" aria-expanded="false">
                        <span>Distance</span>
                        <span className="contacts-filter-btn__arrow" aria-hidden="true">▾</span>
                      </button>
                      <div className="contacts-dropdown-menu" role="menu">
                        <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="all">Any distance</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="near">Nearby</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="mid">Mid-range</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="far">Extended area</button>
                      </div>
                    </div>
                    <div className="contacts-dropdown" data-dropdown="review">
                      <button type="button" className="contacts-filter-btn" data-filter="review" aria-expanded="false">
                        <span>Review</span>
                        <span className="contacts-filter-btn__arrow" aria-hidden="true">▾</span>
                      </button>
                      <div className="contacts-dropdown-menu" role="menu">
                        <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="all">Any review</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value={5}>5.0+</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="4.8">4.8+</button>
                        <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="4.5">4.5+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contacts-toolbar__actions">
                  <div className="contacts-view-toggle" aria-label="View toggle">
                    <button type="button" className="contacts-view-btn is-active" data-view="grid" aria-label="Grid view"><span aria-hidden="true">▦</span></button>
                    <button type="button" className="contacts-view-btn" data-view="list" aria-label="List view"><span aria-hidden="true">☰</span></button>
                  </div>
                </div>
              </div>
              <div className="contacts-grid" id="contactsGrid" aria-live="polite" />
              <div className="contacts-pagination-wrap">
                <p className="contacts-summary" id="contactsSummary">Showing 0-0 from 0 data</p>
                <div className="contacts-pagination" id="contactsPagination">
                  <button type="button" className="contacts-page-btn contacts-page-btn--arrow" data-page-action="prev" aria-label="Previous page">‹</button>
                  <div className="contacts-page-list" id="contactsPageList" />
                  <button type="button" className="contacts-page-btn contacts-page-btn--arrow" data-page-action="next" aria-label="Next page">›</button>
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