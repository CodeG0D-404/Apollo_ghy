import React, { useState } from "react";
import "./CSS/ServiceTimeline.css";

const ServiceTimeline = () => {
  const [active, setActive] = useState(0);

  const services = [
    {
      name: "OPD",
      steps: [
        {
          title: "Choose Hospital",
          description:
            "Select your preferred hospital or clinic based on location, speciality and availability.",
        },
        {
          title: "Select Doctor",
          description:
            "Browse verified doctors, check experience, and choose the right specialist for your condition.",
        },
        {
          title: "Pick Date & Time",
          description:
            "Select available OPD slots according to your convenience.",
        },
        {
          title: "Confirm Token",
          description:
            "Your OPD token is booked instantly and shared via SMS/WhatsApp.",
          note: "Carry the token when visiting the clinic.",
        },
        {
          title: "Visit Clinic",
          description:
            "Reach the hospital on time and consult the doctor without waiting in long queues.",
        },
      ],
    },

    {
      name: "Telemedicine",
      steps: [
        {
          title: "Choose Speciality",
          description:
            "Select the medical speciality relevant to your symptoms.",
        },
        {
          title: "Select Doctor",
          description:
            "Pick a doctor based on experience, availability and consultation fees.",
        },
        {
          title: "Confirm Booking",
          description:
            "Confirm your online appointment and receive meeting details.",
        },
        {
          title: "Join Call",
          description:
            "Consult your doctor via video or audio call from home.",
          note: "Prescription shared digitally after consultation.",
        },
      ],
    },

    {
      name: "Hospital Visit",
      steps: [
        {
          title: "Choose Department",
          description:
            "Select the required hospital department or treatment type.",
        },
        {
          title: "Get Appointment",
          description:
            "We coordinate with the hospital to schedule your visit.",
        },
        {
          title: "Arrive Hospital",
          description:
            "Our support team assists with registration and navigation.",
        },
        {
          title: "Consult Doctor",
          description:
            "Meet the doctor and begin treatment or evaluation.",
        },
      ],
    },

    {
      name: "Lab Test",
      steps: [
        {
          title: "Select Lab",
          description:
            "Choose from certified diagnostic centers and partner labs.",
        },
        {
          title: "Choose Test",
          description:
            "Pick required tests or health packages.",
        },
        {
          title: "Provide Sample",
          description:
            "Visit lab or request home sample collection.",
        },
        {
          title: "Get Reports",
          description:
            "Reports are delivered digitally and can be shared with doctors instantly.",
        },
      ],
    },

    {
      name: "Accommodation",
      steps: [
        {
          title: "Share Travel Dates",
          description:
            "Provide arrival and departure details for hospital visit.",
        },
        {
          title: "Select Stay Options",
          description:
            "Choose budget, premium, or hospital-near accommodation.",
        },
        {
          title: "Confirm Booking",
          description:
            "Accommodation is reserved and confirmed in advance.",
        },
        {
          title: "Check-in Support",
          description:
            "On-ground assistance available during your stay.",
        },
      ],
    },

    {
      name: "Commute",
      steps: [
        {
          title: "Request Pickup",
          description:
            "Book airport, railway, or local pickup.",
        },
        {
          title: "Driver Assigned",
          description:
            "Verified driver details shared before arrival.",
        },
        {
          title: "Travel To Hospital",
          description:
            "Safe and comfortable transport arranged for your appointments.",
        },
      ],
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
