"use client";

import { useState } from "react";
import "./feedback.css";

const topics = [
  {
    title: "Tell us what worked",
    text: "Share the moments, services, or people that helped your family feel supported.",
  },
  {
    title: "Point out what felt difficult",
    text: "Let us know where the experience felt unclear, slow, or hard to complete.",
  },
  {
    title: "Suggest what comes next",
    text: "Your ideas help us shape better school, medical, sport, and family support.",
  },
];

const categories = [
  {
    title: "Website experience",
    text: "Pages, navigation, account flow, and anything that made the site easier or harder to use.",
  },
  {
    title: "Appointments",
    text: "Booking, timing, communication, and how clearly the next steps were explained.",
  },
  {
    title: "Services",
    text: "School, sport, medical, and specialist support experiences across the platform.",
  },
  {
    title: "Team support",
    text: "How our team listened, replied, guided, and followed through with your family.",
  },
];

const previewItems = [
  {
    title: "Clear next steps",
    text: "We review each message and route it to the right team member.",
  },
  {
    title: "Better family support",
    text: "Feedback helps us improve the guidance we give to parents and children.",
  },
  {
    title: "A kinder platform",
    text: "Your comments help us make Inspirability more useful and easier to trust.",
  },
];



export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="feedback-new-page">
      <main className="feedback-new-main">
        <section className="feedback-hero">
          <div className="feedback-shell">
            <div className="feedback-hero__content">
              <div className="feedback-hero__copy">
                <span className="feedback-eyebrow">Feedback</span>
                <h1 className="feedback-hero__title">
                  Help us make Inspirability better for every family.
                </h1>
                <p className="feedback-hero__text">
                  Your experience matters. Tell us what helped, what felt
                  difficult, and what would make your next visit smoother.
                </p>

                <div className="feedback-hero__metrics">
                  <div className="feedback-metric">
                    <strong>1 minute</strong>
                    <span>Quick to complete</span>
                  </div>
                  <div className="feedback-metric">
                    <strong>Optional</strong>
                    <span>Share contact details only if you want a reply</span>
                  </div>
                  <div className="feedback-metric">
                    <strong>Reviewed</strong>
                    <span>Read by our support team</span>
                  </div>
                </div>
              </div>

              <aside className="feedback-hero__panel">
                <h2>What to include</h2>
                <div className="feedback-topic-list">
                  {topics.map((topic) => (
                    <div className="feedback-topic-item" key={topic.title}>
                      <strong>{topic.title}</strong>
                      <p>{topic.text}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="feedback-categories">
          <div className="feedback-shell">
            <div className="feedback-section-head">
              <h2>Choose what your feedback is about</h2>
              <p>
                Pick the closest topic in the form, then add any details that
                help us understand your experience.
              </p>
            </div>

            <div className="feedback-category-grid">
              {categories.map((category) => (
                <article className="feedback-category-card" key={category.title}>
                  <h3>{category.title}</h3>
                  <p>{category.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="feedback-form-section">
          <div className="feedback-shell">
            <div className="feedback-form-layout">
              <article className="feedback-form-card">
                <div className="feedback-card-head">
                  <h2 className="feedback-title">Send your feedback</h2>
                  <p>
                    Leave a note for our team. We will use it to improve the
                    next family experience.
                  </p>
                </div>

                <form className="feedback-form" onSubmit={handleSubmit}>
                  <div className="feedback-stars-wrap">
                    <span className="feedback-label">How was your experience?</span>
                    <div className="feedback-stars" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          className={`feedback-star ${
                            star <= rating ? "is-active" : ""
                          }`}
                          key={star}
                          onClick={() => setRating(star)}
                          type="button"
                        >
                          &#9733;
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="feedback-form-grid">
                    <div className="feedback-field">
                      <label htmlFor="feedbackName">Name</label>
                      <input
                        id="feedbackName"
                        name="name"
                        placeholder="Enter your name"
                        type="text"
                      />
                    </div>

                    <div className="feedback-field">
                      <label htmlFor="feedbackEmail">Email</label>
                      <input
                        id="feedbackEmail"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>

                    <div className="feedback-field">
                      <label htmlFor="feedbackTopic">Topic</label>
                      <select id="feedbackTopic" name="topic" defaultValue="">
                        <option value="" disabled>
                          Choose a topic
                        </option>
                        <option>Website experience</option>
                        <option>Appointments</option>
                        <option>Services</option>
                        <option>Team support</option>
                      </select>
                    </div>

                    <div className="feedback-field">
                      <label htmlFor="feedbackPhone">Phone</label>
                      <input
                        id="feedbackPhone"
                        name="phone"
                        placeholder="Enter your phone number"
                        type="tel"
                      />
                    </div>

                    <div className="feedback-field feedback-field--full">
                      <label htmlFor="feedbackMessage">Message</label>
                      <div className="feedback-textarea-wrap">
                        <textarea
                          id="feedbackMessage"
                          name="message"
                          placeholder="Write your feedback"
                        />
                        <span className="feedback-mic">Mic</span>
                      </div>
                    </div>
                  </div>

                  <div className="feedback-actions">
                    <button className="feedback-btn feedback-btn--send" type="submit">
                      Send
                    </button>
                    <button className="feedback-btn feedback-btn--skip" type="reset">
                      Clear
                    </button>
                  </div>

                  <div
                    className={`feedback-success ${
                      submitted ? "is-visible" : ""
                    }`}
                  >
                    <strong>Thank you for sharing.</strong>
                    <p>Your feedback has been noted by the Inspirability team.</p>
                  </div>
                </form>
              </article>

              <aside className="feedback-side-stack">
                <article className="feedback-side-card">
                  <div className="feedback-card-head">
                    <h2>What happens next</h2>
                    <p>
                      Your message helps us improve how families move through
                      care, school, and support.
                    </p>
                  </div>

                  <div className="feedback-preview-list">
                    {previewItems.map((item) => (
                      <div className="feedback-preview-item" key={item.title}>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </article>

              
              </aside>
            </div>
          </div>
        </section>

        <section className="feedback-faq">
        
        </section>
      </main>
    </div>
  );
}
