"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { contacts } from "../contact-details/contacts-data";
import "./contacts.css";

const filterLabels = {
  specialty: {
    all: "Type / Specialty",
    medical: "Medical",
    education: "Education",
    sports: "Sports",
    therapy: "Therapy",
  },
  budget: {
    all: "Any budget",
  },
  review: {
    all: "Review",
    5: "5.0+",
    4.8: "4.8+",
    4.5: "4.5+",
  },
};

const contactDistancesKm = {
  "dr-salma-nabil": 5,
  "omar-adel": 12,
  "mona-hesham": 6,
  "dr-karim-mostafa": 14,
  "nour-el-din": 30,
  "youssef-emad": 8,
  "dr-farah-tarek": 28,
  "hadeer-samy": 11,
  "layla-hassan": 10,
  "rania-magdy": 6,
  "amr-wael": 35,
  "dr-dina-ashraf": 7,
};

const prices = contacts.map((contact) => getContactPrice(contact));
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const distances = Object.values(contactDistancesKm);
const minDistance = Math.min(...distances);
const maxDistance = Math.max(...distances);

function getContactPrice(contact) {
  const price = contact.budgetValue?.match(/\d+/)?.[0];
  return price ? Number(price) : 0;
}

function ContactsDropdown({ activeValue, filterName, label, onChange, onToggle, open }) {
  return (
    <div className={`contacts-dropdown ${open ? "is-open" : ""}`}>
      <button
        aria-expanded={open}
        className={`contacts-filter-btn ${open ? "is-open" : ""} ${
          activeValue !== "all" ? "is-selected" : ""
        }`}
        onClick={onToggle}
        type="button"
      >
        <span>{filterLabels[filterName][activeValue]}</span>
        <span className="contacts-filter-btn__arrow" aria-hidden="true">
          v
        </span>
      </button>

      <div className="contacts-dropdown-menu" role="menu" aria-label={label}>
        {Object.entries(filterLabels[filterName]).map(([value, optionLabel]) => (
          <button
            className={`contacts-dropdown-option ${
              activeValue === value ? "is-active" : ""
            }`}
            key={value}
            onClick={() => onChange(filterName, value)}
            type="button"
          >
            {optionLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ContactsDirectoryPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({
    specialty: "all",
    budgetMax: maxPrice,
    distanceMax: maxDistance,
    review: "all",
  });
  const [favorites, setFavorites] = useState([]);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return contacts.filter((contact) =>
      {
        const searchable = [
        contact.name,
        contact.role,
        contact.status,
        contact.phone,
        contact.email,
        contact.specialization,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
          .includes(normalizedQuery);

        const price = getContactPrice(contact);
        const distance = contactDistancesKm[contact.id] || maxDistance;
        const review = Number(contact.review || 0);

        return (
          searchable &&
          (filters.specialty === "all" ||
            contact.specialty === filters.specialty) &&
          price <= filters.budgetMax &&
          distance <= filters.distanceMax &&
          (filters.review === "all" || review >= Number(filters.review))
        );
      }
    );
  }, [filters, query]);

  const handleFilterChange = (filterName, value) => {
    setFilters((current) => ({ ...current, [filterName]: value }));
    setOpenFilter(null);
  };

  const toggleFavorite = (contactId) => {
    setFavorites((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId]
    );
  };

  return (
    <div className="contacts-page">
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
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    id="searchInput"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name, role, phone, or email"
                    type="search"
                    value={query}
                  />
                </label>

                <div className="contacts-filters" aria-label="Contact filters">
                  <ContactsDropdown
                    activeValue={filters.specialty}
                    filterName="specialty"
                    label="Type / Specialty"
                    onChange={handleFilterChange}
                    onToggle={() =>
                      setOpenFilter((current) =>
                        current === "specialty" ? null : "specialty"
                      )
                    }
                    open={openFilter === "specialty"}
                  />

                  <div className="contacts-price-filter">
                    <div className="contacts-price-filter__head">
                      <span>Budget</span>
                      <strong>Up to EGP {filters.budgetMax}</strong>
                    </div>
                    <input
                      aria-label="Maximum budget"
                      max={maxPrice}
                      min={minPrice}
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          budgetMax: Number(event.target.value),
                        }))
                      }
                      step="10"
                      type="range"
                      value={filters.budgetMax}
                    />
                    <div className="contacts-price-filter__range">
                      <span>EGP {minPrice}</span>
                      <span>EGP {maxPrice}</span>
                    </div>
                  </div>

                  <div className="contacts-price-filter">
                    <div className="contacts-price-filter__head">
                      <span>Distance</span>
                      <strong>Up to {filters.distanceMax} km</strong>
                    </div>
                    <input
                      aria-label="Maximum distance"
                      max={maxDistance}
                      min={minDistance}
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          distanceMax: Number(event.target.value),
                        }))
                      }
                      step="1"
                      type="range"
                      value={filters.distanceMax}
                    />
                    <div className="contacts-price-filter__range">
                      <span>{minDistance} km</span>
                      <span>{maxDistance} km</span>
                    </div>
                  </div>

                  {["review"].map(
                    (filterName) => (
                      <ContactsDropdown
                        activeValue={filters[filterName]}
                        filterName={filterName}
                        key={filterName}
                        label={filterLabels[filterName].all}
                        onChange={handleFilterChange}
                        onToggle={() =>
                          setOpenFilter((current) =>
                            current === filterName ? null : filterName
                          )
                        }
                        open={openFilter === filterName}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="contacts-toolbar__actions">
                <div className="contacts-view-toggle" aria-label="View toggle">
                  <button
                    aria-label="Grid view"
                    className={`contacts-view-btn ${
                      view === "grid" ? "is-active" : ""
                    }`}
                    onClick={() => setView("grid")}
                    type="button"
                  >
                    <i className="fas fa-table-cells-large"></i>
                  </button>
                  <button
                    aria-label="List view"
                    className={`contacts-view-btn ${
                      view === "list" ? "is-active" : ""
                    }`}
                    onClick={() => setView("list")}
                    type="button"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            <div
              aria-live="polite"
              className={`contacts-grid ${view === "list" ? "is-list" : ""}`}
            >
              {filteredContacts.length === 0 ? (
                <div className="contacts-empty">
                  No contacts match your current search.
                </div>
              ) : (
                filteredContacts.map((contact) => {
                  const isFavorite = favorites.includes(contact.id);

                  return (
                    <article className="contact-card" key={contact.id}>
                      <div className="contact-card__avatar">
                        <img src={`/${contact.image}`} alt={contact.name} />
                      </div>

                      <div className="contact-card__content">
                        <h3 className="contact-card__name">{contact.name}</h3>
                        <p className="contact-card__role">{contact.role}</p>
                        <span className="contact-card__status">
                          {contact.status}
                        </span>

                        <div className="contact-card__info">
                          <div className="contact-card__row">
                            <span className="contact-card__icon">&#9742;</span>
                            <span>{contact.phone}</span>
                          </div>
                          <div className="contact-card__row">
                            <span className="contact-card__icon">&#9993;</span>
                            <span
                              className="contact-card__email"
                              title={contact.email}
                            >
                              {contact.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="contact-card__footer">
                        <div className="contact-card__actions">
                          <button
                            aria-label="Add to favorites"
                            aria-pressed={isFavorite}
                            className={`favorite-btn ${
                              isFavorite ? "active" : ""
                            }`}
                            onClick={() => toggleFavorite(contact.id)}
                            type="button"
                          >
                            {isFavorite ? "Heart" : "Like"}
                          </button>
                          <Link className="contact-card__feedback" href="/feedback">
                            Feedback
                          </Link>
                        </div>

                        <Link
                          aria-label={`Open details for ${contact.name}`}
                          className="contact-card__action"
                          href={`/contact-details?id=${encodeURIComponent(
                            contact.id
                          )}`}
                        >
                          &#8250;
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="contacts-pagination-wrap">
              <p className="contacts-summary">
                Showing {filteredContacts.length ? 1 : 0}-
                {filteredContacts.length} from {filteredContacts.length} data
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
