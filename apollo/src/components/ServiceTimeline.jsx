import React, { useState } from "react";
import "./CSS/ServiceTimeline.css";

const ServiceTimeline = () => {
  const [active, setActive] = useState(0);

  const services = [
    {
      name: "OPD Booking Process",
      steps: [
        {
          title: "Check Visiting Doctor Schedule",
          description:
            "View updated dates of specialist doctors visiting Guwahati through our website.",
        },
        {
          title: "Book OPD Appointment",
          description:
            "Submit your medical requirement and confirm your OPD appointment in advance.",
        },
        {
          title: "Visit Clinic on OPD Date",
          description:
            "Consult the specialist at the clinic on the scheduled OPD day without long waiting times.",
        },
        {
          title: "Follow-Up Support",
          description:
            "Our clinic team assists you with follow-up appointments and future treatment planning.",
        }
      ]
    },

{
  name: "Telemedicine Consultation",
  steps: [
    {
      title: "Select Doctor",
      description:
        "Choose a specialist based on your medical needs and consultation requirements.",
    },
    {
      title: "Get Scheduled Date & Time",
      description:
        "We confirm and share the doctor’s available teleconsultation slot with you.",
    },
    {
      title: "Consult Online",
      description:
        "Connect with the doctor on the scheduled date via video or audio consultation.",
    },
    {
      title: "Follow-Up Support",
      description:
        "Guidance for prescriptions, next steps, and future consultation planning.",
    }
  ]
},

{
  name: "Hospital Visit Assistance",
  steps: [
    {
      title: "Submit Enquiry Form",
      description:
        "Fill out the form with your medical requirement and contact details.",
    },
    {
      title: "Consultation Call",
      description:
        "Our team contacts you to understand your needs and suggest suitable treatment options.",
    },
    {
      title: "Hospital Visit Guidance",
      description:
        "We coordinate your hospital appointment and guide you until you reach the hospital.",
    },
    {
      title: "Ongoing Follow-Up Support",
      description:
        "Continuous assistance for reports, next steps, and future treatment planning.",
    }
  ]
},
  ];
  return (
    <section className="st-grid-container">

      <h2 className="st-grid-title">How It Works</h2>

      {/* Service Tabs */}
      <div className="st-grid-tabs">
        {services.map((service, index) => (
          <button
            key={index}
            className={`st-grid-tab ${active === index ? "active" : ""}`}
            onClick={() => setActive(index)}
          >
            {service.name}
          </button>
        ))}
      </div>

      {/* Step Grid */}
      <div className="st-grid-steps">
        {services[active].steps.map((step, i) => (
          <div key={i} className="st-grid-card">

            <div className="st-grid-number">{i + 1}</div>

            <h4>{step.title}</h4>

            <p>{step.description}</p>

            {step.note && (
              <span className="st-grid-note">{step.note}</span>
            )}

          </div>
        ))}
      </div>

    </section>
  );
};

export default ServiceTimeline;
