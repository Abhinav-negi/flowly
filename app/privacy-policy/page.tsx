"use client";

import React from "react";

const PrivacyPolicy: React.FC = () => {
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
      aria-labelledby="privacy-heading"
    >
      <header style={{ marginBottom: "1rem" }}>
        <h1 id="privacy-heading" style={{ margin: 0, fontSize: "1.5rem" }}>
          Flowly — Privacy Policy
        </h1>
        <p style={{ margin: 0, color: "#555", fontSize: "0.95rem" }}>
          Effective Date: 21 August 2025 · Last Updated: 21 August 2025
        </p>
      </header>

      <article>
        <p>
          Flowly values your privacy and is committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, store,
          and share your information when you use our blind dating platform.
        </p>

        {/* Section 1 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>1. Information We Collect</h2>

          <h3>a. Personal Information You Provide</h3>
          <ul>
            <li>
              <strong>Registration details:</strong> Name, email address, phone
              number, date of birth, gender, and sexual orientation.
            </li>
            <li>
              <strong>Profile information:</strong> Photos, preferences,
              interests, and answers to matchmaking questions.
            </li>
            <li>
              <strong>Payment details (if applicable):</strong> Billing
              information for premium features.
            </li>
          </ul>

          <h3>b. Information We Collect Automatically</h3>
          <ul>
            <li>
              <strong>Usage data:</strong> IP address, browser type, device
              information, and activity logs.
            </li>
            <li>
              <strong>Cookies and tracking:</strong> To improve site performance
              and personalize your experience.
            </li>
          </ul>

          <h3>c. Sensitive Information</h3>
          <p>
            Since this is a dating service, you may choose to share sensitive
            details such as relationship preferences or beliefs. By providing
            such information, you consent to our processing of it for
            matchmaking purposes.
          </p>
        </section>

        {/* Section 2 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Match you with potential partners.</li>
            <li>Personalize your experience on our platform.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Communicate updates, promotions, or safety notifications.</li>
            <li>Prevent fraud, spam, and misuse of the platform.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>3. How We Share Your Information</h2>
          <p>We do not sell your personal data. We may share information only in the following cases:</p>
          <ul>
            <li>
              <strong>With other users:</strong> Limited profile information
              (e.g., photos, interests, and compatibility details) will be
              visible to matches.
            </li>
            <li>
              <strong>With service providers:</strong> For payment processing,
              hosting, or customer support.
            </li>
            <li>
              <strong>For legal reasons:</strong> If required by law or to
              protect the rights, safety, or security of our users.
            </li>
            <li>
              <strong>For dating:</strong> We might share your basic information
              to restaurants for a better date experience.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>4. Your Privacy Controls</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your profile information.</li>
            <li>Delete your account at any time.</li>
            <li>
              Control visibility of your photos and preferences through privacy
              settings.
            </li>
            <li>Withdraw consent for data processing where applicable.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>5. Data Retention</h2>
          <p>
            We keep your personal data only as long as necessary to provide our
            services or comply with legal obligations. If you delete your
            account, we will remove your personal data within 30 days, except
            where retention is required by law.
          </p>
        </section>

        {/* Section 6 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>6. Security Measures</h2>
          <p>
            We use encryption, secure servers, and access controls to protect
            your information. However, no system is 100% secure, and we
            encourage you to share information responsibly.
          </p>
        </section>

        {/* Section 7 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>7. Age Restrictions</h2>
          <p>
            Our service is intended only for users 18 years or older. We do not
            knowingly collect data from anyone under this age.
          </p>
        </section>

        {/* Section 8 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>8. International Data Transfers</h2>
          <p>
            If you access our services outside [India], your data may be
            transferred and processed in other jurisdictions that may have
            different data protection laws.
          </p>
        </section>

        {/* Section 9 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>9. Outdoor Meetings Disclaimer</h2>
          <p>
            While our platform connects you with potential dating matches and
            may suggest meeting locations, we are not responsible for any
            incidents, harm, or disputes that may occur during in-person
            meetings with other users. Please exercise caution and follow safety
            guidelines when meeting strangers. Our role is limited to providing
            matches and facilitating communication through the platform.
          </p>
        </section>

        {/* Section 10 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted with a revised “Last Updated” date.
          </p>
        </section>

        {/* Section 11 */}
        <section style={{ marginTop: "1rem" }}>
          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at:
          </p>
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

export default PrivacyPolicy;
