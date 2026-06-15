"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../styles/contact.css";

export default function ContactPage() {
  return (
    <div>
      

      <main className="contact-new-main">
        <section className="contact-hero">
          <div className="contact-shell">
            <div className="contact-hero__content">
              <div className="contact-hero__copy">
                <span className="contact-eyebrow">Contact Us</span>
                <h1 className="contact-hero__title">
                  We are here to support every step of your family’s journey.
                </h1>
                <p className="contact-hero__text">
                  Reach our team for guidance, questions about services, or help
                  finding the right educational, medical, and sports support for
                  your child.
                </p>

                <div className="contact-hero__highlights">
                  <div className="contact-highlight">
                    <strong>Fast replies</strong>
                    <span>
                      Most messages are answered within one business day.
                    </span>
                  </div>

                  <div className="contact-highlight">
                    <strong>Care-first guidance</strong>
                    <span>
                      Get connected to the right support path without the
                      guesswork.
                    </span>
                  </div>

                  <div className="contact-highlight">
                    <strong>Trusted coordination</strong>
                    <span>
                      Talk to one team across school, sport, and medical
                      services.
                    </span>
                  </div>
                </div>
              </div>

              <aside className="contact-hero__panel">
                <h2>Reach us directly</h2>

                <div className="contact-quick-list">
                  <div className="contact-quick-item">
                    <span className="contact-quick-item__icon">✉</span>
                    <div>
                      <strong>Email</strong>
                      <p>inspirability@gmail.com</p>
                    </div>
                  </div>

                  <div className="contact-quick-item">
                    <span className="contact-quick-item__icon">☎</span>
                    <div>
                      <strong>Phone</strong>
                      <p>+01004292334</p>
                    </div>
                  </div>

                  <div className="contact-quick-item">
                    <span className="contact-quick-item__icon">⌚</span>
                    <div>
                      <strong>Working hours</strong>
                      <p>Sunday to Thursday, 9:00 AM to 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="contact-support">
          <div className="contact-shell">
            <div className="contact-section-heading">
              <h2>How we can help</h2>
              <p>
                Choose the support path that fits your question and our team
                will guide you from there.
              </p>
            </div>

            <div className="contact-support-grid">
              <article className="contact-support-card">
                <h3>General guidance</h3>
                <p>
                  Ask about services, program details, and how Inspirability can
                  support your child.
                </p>
              </article>

              <article className="contact-support-card">
                <h3>Parent support</h3>
                <p>
                  Get help choosing the right school, specialist, coach, or care
                  direction.
                </p>
              </article>

              <article className="contact-support-card">
                <h3>Appointments</h3>
                <p>
                  Reach out for appointment coordination and next-step planning
                  with our team.
                </p>
              </article>

              <article className="contact-support-card">
                <h3>Partnerships</h3>
                <p>
                  Connect with us for collaboration, community work, and
                  long-term support programs.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="contact-connect">
          <div className="contact-shell">
            <div className="contact-connect__layout">
              <article className="contact-form-card">
                <div className="contact-card-head">
                  <h2 className="contact-title">Send us a message</h2>
                  <p>
                    Tell us what you need and we will get back to you with the
                    best next step.
                  </p>
                </div>

                <form className="contact-form">
                  <div className="contact-form-grid">
                    <div className="contact-field">
                      <label htmlFor="emailAddress">Email</label>
                      <input
                        id="emailAddress"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="contact-field">
                      <label htmlFor="phoneNumber">Phone-Number</label>
                      <input
                        id="phoneNumber"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="contact-field contact-field--full">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Write your message"
                        defaultValue=""
                      />
                    </div>
                  </div>

                  <div className="contact-submit">
                    <button type="submit" className="contact-submit-btn">
                      Send
                    </button>
                  </div>
                </form>
              </article>

              <div className="contact-aside">
                <article className="contact-info-card">
                  <div className="contact-card-head">
                    <h2>Contact details</h2>
                    <p>
                      Use the channel that works best for you and we will take
                      it from there.
                    </p>
                  </div>

                  <div className="contact-info-list">
                    <div className="contact-info-item">
                      <span className="contact-info-item__label">Email</span>
                      <strong>inspirability@gmail.com</strong>
                    </div>

                    <div className="contact-info-item">
                      <span className="contact-info-item__label">Phone</span>
                      <strong>+01004292334</strong>
                    </div>

                    <div className="contact-info-item">
                      <span className="contact-info-item__label">Address</span>
                      <strong>Cairo, Egypt</strong>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}