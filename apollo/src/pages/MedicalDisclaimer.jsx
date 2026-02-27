import "./Css/Legal.css";

export default function MedicalDisclaimer() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-content">
          <h1>Medical Disclaimer</h1>
          <p className="updated-date">Last updated: [Add Date]</p>

          <p>
            Apollo Hospitals Information Centre (“we”, “our”, “us”) provides non-clinical,
            informational, and appointment coordination services only.
          </p>

          <hr />

          <section>
            <h2>1. No Medical Advice</h2>
            <p>
              The content available on this website, including text, information,
              communication, or responses, is not intended to be medical advice
              and must not be relied upon as such.
            </p>

            <ul>
              <li>Diagnose medical symptoms</li>
              <li>Recommend treatments or medications</li>
              <li>Provide clinical opinions</li>
              <li>Replace professional medical consultation</li>
            </ul>

            <p>
              All medical advice, diagnosis, treatment, and care decisions are
              the sole responsibility of qualified doctors and hospitals,
              including Apollo Hospitals, Chennai.
            </p>
          </section>

          <hr />

          <section>
            <h2>2. Appointment Facilitation Only</h2>
            <p>
              Apollo Hospitals Information Centre acts as a licensed facilitation and
              coordination bridge between Apollo Hospitals, Chennai and
              patients, primarily from the North Eastern region of India.
            </p>

            <ul>
              <li>Helping patients connect with the appropriate department or doctor</li>
              <li>Coordinating appointment requests</li>
              <li>Sharing non-clinical, procedural information</li>
            </ul>

            <p>We do not influence or participate in medical decisions.</p>
          </section>

          <hr />

          <section>
            <h2>3. No Emergency Services</h2>
            <p>
              This website and our services are not intended for medical
              emergencies.
            </p>

            <ul>
              <li>Contact local emergency services immediately, or</li>
              <li>Visit the nearest hospital or emergency department</li>
            </ul>
          </section>

          <hr />

          <section>
            <h2>4. Accuracy of Information</h2>
            <ul>
              <li>Medical information may change without notice</li>
              <li>Hospital policies and doctor availability are subject to change</li>
            </ul>

            <p>
              We do not guarantee completeness or accuracy of medical-related
              information.
            </p>
          </section>

          <hr />

          <section>
            <h2>5. Limitation of Liability</h2>
            <ul>
              <li>Medical outcomes or treatment results</li>
              <li>Decisions taken by doctors or hospitals</li>
              <li>Delays, cancellations, or changes in appointments</li>
              <li>Any loss or harm arising from reliance on medical information</li>
            </ul>

            <p>Use of this website and services is at your own discretion.</p>
          </section>

          <hr />

          <section>
            <h2>6. Third-Party Responsibility</h2>
            <p>
              All medical services, consultations, investigations, and treatments
              are provided exclusively by Apollo Hospitals, Chennai and its
              medical professionals.
            </p>

            <p>
              Apollo Hospitals Information Centre is not responsible for acts, omissions,
              or outcomes related to hospital care or medical treatment.
            </p>
          </section>

          <hr />

          <section>
            <h2>7. Consent & Acceptance</h2>
            <p>
              By using this website and submitting your details, you acknowledge
              that you have read, understood, and agreed to this Medical
              Disclaimer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
