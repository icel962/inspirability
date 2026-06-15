"use client";

import "./contact-desc.css";

export default function ContactDesc() {
  return (
    <main className="contacts-main">
      <section className="contacts-section">
        <div className="contacts-shell">
          <div className="contacts-header">
            <h1 className="contacts-title">Contacts</h1>
            <p className="contacts-subtitle">
              Browse trusted specialists, teachers, therapists, and coaches
              through the services directory.
            </p>
          </div>

          <div className="contacts-toolbar">
            <div className="contacts-toolbar__main">
              <label className="contacts-search" htmlFor="searchInput">
                <span className="contacts-search__icon" aria-hidden="true">
                  🔍
                </span>
                <input
                  id="searchInput"
                  type="search"
                  placeholder="Search contacts, specialties, email, or phone"
                />
              </label>

              <div className="contacts-filters" aria-label="Contact filters">
                <div className="contacts-dropdown" data-dropdown="specialty">
                  <button
                    type="button"
                    className="contacts-filter-btn"
                    data-filter="specialty"
                    aria-expanded="false"
                  >
                    <span>Type / Specialty</span>
                    <span className="contacts-filter-btn__arrow" aria-hidden="true">
                      ▾
                    </span>
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
                  <button
                    type="button"
                    className="contacts-filter-btn"
                    data-filter="budget"
                    aria-expanded="false"
                  >
                    <span>Budget</span>
                    <span className="contacts-filter-btn__arrow" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  <div className="contacts-dropdown-menu" role="menu">
                    <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="all">Any budget</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="economy">Economy</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="standard">Standard</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="budget" data-value="premium">Premium</button>
                  </div>
                </div>

                <div className="contacts-dropdown" data-dropdown="distance">
                  <button
                    type="button"
                    className="contacts-filter-btn"
                    data-filter="distance"
                    aria-expanded="false"
                  >
                    <span>Distance</span>
                    <span className="contacts-filter-btn__arrow" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  <div className="contacts-dropdown-menu" role="menu">
                    <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="all">Any distance</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="near">Nearby</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="mid">Mid-range</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="distance" data-value="far">Extended area</button>
                  </div>
                </div>

                <div className="contacts-dropdown" data-dropdown="review">
                  <button
                    type="button"
                    className="contacts-filter-btn"
                    data-filter="review"
                    aria-expanded="false"
                  >
                    <span>Review</span>
                    <span className="contacts-filter-btn__arrow" aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  <div className="contacts-dropdown-menu" role="menu">
                    <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="all">Any review</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="5">5.0+</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="4.8">4.8+</button>
                    <button type="button" className="contacts-dropdown-option" data-filter-value="review" data-value="4.5">4.5+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="contacts-toolbar__actions">
              <div className="contacts-view-toggle" aria-label="View toggle">
                <button
                  type="button"
                  className="contacts-view-btn is-active"
                  data-view="grid"
                  aria-label="Grid view"
                >
                  <span aria-hidden="true">▦</span>
                </button>
                <button
                  type="button"
                  className="contacts-view-btn"
                  data-view="list"
                  aria-label="List view"
                >
                  <span aria-hidden="true">☰</span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="contacts-grid"
            id="contactsGrid"
            aria-live="polite"
          />

          <div className="contacts-pagination-wrap">
            <p className="contacts-summary" id="contactsSummary">
              Showing 0-0 from 0 data
            </p>
            <div className="contacts-pagination" id="contactsPagination">
              <button
                type="button"
                className="contacts-page-btn contacts-page-btn--arrow"
                data-page-action="prev"
                aria-label="Previous page"
              >
                ‹
              </button>
              <div className="contacts-page-list" id="contactsPageList" />
              <button
                type="button"
                className="contacts-page-btn contacts-page-btn--arrow"
                data-page-action="next"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
