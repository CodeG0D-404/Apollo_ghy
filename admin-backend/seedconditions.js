// =============================================
// 📁 seedConditions.js
// Seed 150 common medical conditions with slug
// =============================================

const mongoose = require("mongoose");
const slugify = require("slugify");
require("dotenv").config();
const Condition = require("./models/Condition");

// 150 common medical conditions
const conditions = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "COPD",
  "Coronary Artery Disease",
  "Stroke",
  "Heart Failure",
  "Arrhythmia",
  "Peripheral Artery Disease",
  "Hyperlipidemia",
  "Obesity",
  "Thyroid Disorders",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Goiter",
  "Osteoarthritis",
  "Rheumatoid Arthritis",
  "Gout",
  "Osteoporosis",
  "Back Pain",
  "Sciatica",
  "Depression",
  "Anxiety",
  "Bipolar Disorder",
  "Schizophrenia",
  "Insomnia",
  "Migraine",
  "Tension Headache",
  "Cluster Headache",
  "Epilepsy",
  "Seizure Disorders",
  "Parkinson's Disease",
  "Alzheimer's Disease",
  "Dementia",
  "Multiple Sclerosis",
  "Amyotrophic Lateral Sclerosis (ALS)",
  "Muscular Dystrophy",
  "Cerebral Palsy",
  "Autism Spectrum Disorder",
  "Attention Deficit Hyperactivity Disorder (ADHD)",
  "Obsessive-Compulsive Disorder (OCD)",
  "Post-Traumatic Stress Disorder (PTSD)",
  "Pneumonia",
  "Bronchitis",
  "Tuberculosis",
  "Lung Cancer",
  "Skin Cancer",
  "Melanoma",
  "Basal Cell Carcinoma",
  "Squamous Cell Carcinoma",
  "Eczema",
  "Psoriasis",
  "Acne",
  "Rosacea",
  "Vitiligo",
  "Alopecia",
  "Hepatitis A",
  "Hepatitis B",
  "Hepatitis C",
  "Cirrhosis",
  "Fatty Liver Disease",
  "Pancreatitis",
  "Gallstones",
  "Kidney Stones",
  "Chronic Kidney Disease",
  "Urinary Tract Infection",
  "Prostate Enlargement",
  "Prostate Cancer",
  "Breast Cancer",
  "Cervical Cancer",
  "Ovarian Cancer",
  "Endometriosis",
  "Polycystic Ovary Syndrome (PCOS)",
  "Infertility",
  "Pregnancy",
  "Labor Pain",
  "Postpartum Depression",
  "Menopause",
  "Premenstrual Syndrome (PMS)",
  "Menstrual Disorders",
  "Anemia",
  "Vitamin D Deficiency",
  "Vitamin B12 Deficiency",
  "Iron Deficiency",
  "Leukemia",
  "Lymphoma",
  "Multiple Myeloma",
  "HIV/AIDS",
  "COVID-19",
  "Influenza",
  "Common Cold",
  "Allergic Rhinitis",
  "Sinusitis",
  "Ear Infection",
  "Tonsillitis",
  "Pharyngitis",
  "Gastroenteritis",
  "Peptic Ulcer",
  "Gastritis",
  "GERD",
  "Irritable Bowel Syndrome (IBS)",
  "Crohn's Disease",
  "Ulcerative Colitis",
  "Celiac Disease",
  "Diverticulitis",
  "Hemorrhoids",
  "Constipation",
  "Diarrhea",
  "Appendicitis",
  "Hernia",
  "Stroke Rehabilitation",
  "Traumatic Brain Injury",
  "Spinal Cord Injury",
  "Fractures",
  "Sprains",
  "Dislocations",
  "Burns",
  "Wound Infection",
  "Sepsis",
  "Shock",
  "Anaphylaxis",
  "Poisoning",
  "Snake Bite",
  "Insect Bite",
  "COVID-19 Long Haul",
  "Chronic Fatigue Syndrome",
  "Fibromyalgia",
  "Autoimmune Disorders",
  "Lupus",
  "Scleroderma",
  "Sjogren's Syndrome",
  "Myasthenia Gravis",
  "Addison's Disease",
  "Cushing's Syndrome",
  "Hyperparathyroidism",
  "Hypoparathyroidism",
  "Acromegaly",
  "Gigantism",
  "Pituitary Disorders",
  "Eye Disorders",
  "Glaucoma",
  "Cataract",
  "Macular Degeneration",
  "Retinopathy",
  "Conjunctivitis",
  "Otitis Media",
  "Hearing Loss",
  "Vertigo",
  "Tinnitus"
];

// ============================
// Seed Function
// ============================

async function seedConditions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing conditions
    await Condition.deleteMany({});
    console.log("✅ Existing conditions deleted");

    // Insert new conditions with slug
    const docs = conditions.map((name) => ({
      name,
      slug: slugify(name, { lower: true, strict: true })
    }));

    await Condition.insertMany(docs);
    console.log(`✅ ${conditions.length} conditions seeded successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding conditions:", err);
    process.exit(1);
  }
}

seedConditions();
