// =============================================
// 🚀 Seeder Script for Doctors
// Run: node seedDoctors.js
// =============================================

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Doctor = require("./models/Doctor");
const Specialty = require("./models/Specialty");
const Condition = require("./models/Condition");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Failed:", err));

const seedDoctors = async () => {
  try {
    // Clear old doctors only
    await Doctor.deleteMany();
    console.log("🧹 Old doctors cleared");

    // Fetch specialties and conditions from DB
    const specialties = await Specialty.find();
    const conditions = await Condition.find();

    const getSpecialtyId = name => {
      const s = specialties.find(sp => sp.name === name);
      if (!s) throw new Error(`Specialty "${name}" not found`);
      return s._id;
    };

    const getConditionIds = names => {
      return names.map(name => {
        const c = conditions.find(cond => cond.name === name);
        if (!c) throw new Error(`Condition "${name}" not found`);
        return c._id;
      });
    };

    // Seed doctors
    await Doctor.insertMany([
      {
        name: "Dr. Anjali Sharma",
        specialty: getSpecialtyId("Cardiology"),
        qualification: "MD Cardiology",
        experience: 12,
        language: ["Hindi", "English"],
        conditionsTreated: getConditionIds(["Hypertension", "Diabetes"]),
        bio: "Specialist in heart-related conditions with over a decade of experience."
      },
      {
        name: "Dr. Rajiv Mehta",
        specialty: getSpecialtyId("Dermatology"),
        qualification: "MBBS, MD Dermatology",
        experience: 8,
        language: ["English"],
        conditionsTreated: getConditionIds(["Acne", "Allergies"]),
        bio: "Experienced in treating skin disorders and cosmetic dermatology."
      },
      {
        name: "Dr. Priya Kapoor",
        specialty: getSpecialtyId("Orthopedics"),
        qualification: "MS Orthopedics",
        experience: 10,
        language: ["Hindi", "English"],
        conditionsTreated: getConditionIds(["Back Pain", "Arthritis"]),
        bio: "Orthopedic surgeon specializing in bone and joint health."
      },
      {
        name: "Dr. Vikram Singh",
        specialty: getSpecialtyId("Neurology"),
        qualification: "MD Neurology",
        experience: 15,
        language: ["English"],
        conditionsTreated: getConditionIds(["Migraine", "Depression"]),
        bio: "Expert neurologist with a focus on chronic neurological conditions."
      },
      {
        name: "Dr. Neha Iyer",
        specialty: getSpecialtyId("Pediatrics"),
        qualification: "MBBS, MD Pediatrics",
        experience: 7,
        language: ["Hindi", "English", "Bengali"],
        conditionsTreated: getConditionIds(["Flu", "Asthma"]),
        bio: "Child specialist with experience in both preventive and emergency care."
      }
      // Add more doctors here...
    ]);

    console.log("✅ Doctors seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDoctors();
