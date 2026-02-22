// E:\B2B\A\admin-backend\seedSpecialties.js
const { connectDB } = require("./server"); // reuse server.js connection
const Specialty = require("./models/Specialty");
const slugify = require("slugify");

// 24 Specialties
const specialties = [
  "General Physician/ Internal Medicine",
  "Dermatology",
  "Obstetrics & Gynaecology",
  "Orthopaedics",
  "ENT",
  "Neurology",
  "Cardiology",
  "Urology",
  "Gastroenterology/GI medicine",
  "Psychiatry",
  "Paediatrics",
  "Pulmonology/ Respiratory Medicine",
  "Endocrinology",
  "Nephrology",
  "Neurosurgery",
  "Rheumatology",
  "Ophthalmology",
  "Surgical Gastroenterology",
  "Infectious Disease",
  "General & Laparoscopic Surgeon",
  "Psychology",
  "Medical Oncology",
  "Diabetology",
  "Dentist"
];

async function seedSpecialties() {
  try {
    // Reuse existing server connection
    await connectDB();

    // Delete existing specialties
    await Specialty.deleteMany({});
    console.log("✅ Existing specialties deleted");

    // Insert new specialties with slugs
    const docs = specialties.map(name => ({
      name,
      slug: slugify(name, { lower: true, strict: true })
    }));

    await Specialty.insertMany(docs);
    console.log(`✅ ${specialties.length} specialties seeded successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding specialties:", err);
    process.exit(1);
  }
}

seedSpecialties();
