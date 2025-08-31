"use client";

import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "1.5rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        lineHeight: 1.6,
        color: "#111",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
      aria-labelledby="terms-heading"
    >
      <header style={{ marginBottom: "1rem" }}>
        <h1 id="terms-heading" style={{ margin: 0, fontSize: "1.5rem" }}>
          Flowly — Terms & Conditions
        </h1>
        <p style={{ margin: 0, color: "#555", fontSize: "0.95rem" }}>
          Effective Date: 21 August 2025 · Last Updated: 21 August 2025
        </p>
      </header>

      <article>
        <p>
          Welcome to Flowly! By using our blind dating platform (“Service”), you
          agree to the following Terms & Conditions. Please read them carefully
          before using our app.
        </p>

        {/* Section 1 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or using Flowly, you agree to be bound by
            these Terms. If you do not agree, please do not use our Service.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>2. Eligibility</h2>
          <ul>
            <li>You must be at least 18 years old to use Flowly.</li>
            <li>
              By registering, you confirm that all information you provide is
              accurate and truthful.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>3. User Responsibilities</h2>
          <p>When using Flowly, you agree to:</p>
          <ul>
            <li>Respect other users and not engage in harassment, abuse, or harmful behavior.</li>
            <li>Not impersonate another person or misrepresent your identity.</li>
            <li>Use Flowly for personal, non-commercial purposes only.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>4. Safety Disclaimer</h2>
          <ul>
            <li>Flowly provides matchmaking and communication tools but does not conduct background checks on users.</li>
            <li>You are solely responsible for your interactions with other members.</li>
            <li>
              Please use caution when sharing personal information or meeting
              others offline.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>5. Premium Services</h2>
          <ul>
            <li>Some features may require payment.</li>
            <li>
              All fees are disclosed before purchase and are non-refundable,
              except as required by law.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>6. Content & License</h2>
          <ul>
            <li>
              By uploading content (e.g., photos, profile details), you grant
              Flowly a non-exclusive, worldwide license to use, display, and
              share it within the Service.
            </li>
            <li>You retain ownership of your content.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>7. Prohibited Activities</h2>
          <p>You may not:</p>
          <ul>
            <li>Use Flowly for any illegal or unauthorized purpose.</li>
            <li>Post offensive, discriminatory, or harmful content.</li>
            <li>Attempt to hack, disrupt, or misuse our platform.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>8. Termination</h2>
          <p>
            Flowly reserves the right to suspend or terminate your account at
            any time if you violate these Terms or engage in harmful activity.
          </p>
        </section>

        {/* Section 9 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>9. Limitation of Liability</h2>
          <ul>
            <li>
              Flowly is not responsible for any damages, disputes, or incidents
              that may occur through the use of the platform.
            </li>
            <li>We do not guarantee successful matches or relationships.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>10. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Updates will be posted
            with a revised “Last Updated” date. Continued use of Flowly means
            you accept the changes.
          </p>
        </section>

        {/* Section 11 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, without regard to
            conflict of law principles.
          </p>
        </section>

        {/* Section 12 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>12. Contact Us</h2>
          <p>If you have questions about these Terms, please contact us:</p>
          <ul>
            <li>
              Email:{" "}
              <a href="mailto:flowwithflowly@gmail.com">
                flowwithflowly@gmail.com
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/flowwithflowly?igsh=d2N4aTluNG1rYWl5"
                target="_blank"
                rel="noopener noreferrer"
              >
                @flowwithflowly
              </a>
            </li>
          </ul>
        </section>

        <footer
          style={{ marginTop: "1.5rem", color: "#666", fontSize: "0.95rem" }}
        >
          <p style={{ margin: 0 }}>© Flowly · Effective Date: 21 August 2025</p>
        </footer>
      </article>
    </main>
  );
};

export default TermsAndConditions;
