// =============================================
// 📁 src/services/mockData.js
// Production Mock / Fallback Healthcare Data
// Guarantees zero crashes & seamless UX when backend is offline
// =============================================

// Helper for generating upcoming dates
const getUpcomingDates = (daysOffsetList) => {
  const dates = [];
  const now = new Date();
  daysOffsetList.forEach((offset) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    d.setHours(10, 0, 0, 0);
    dates.push(d.toISOString());
  });
  return dates;
};

export const BRAND_INFO = {
  name: "ApexCare Information Centre",
  shortName: "ApexCare",
  legalName: "ApexCare Health Services Information Centre",
  phone: "+91 98765 43210",
  altPhone: "+91 98765 01234",
  email: "info@apexcarehealth.com",
  supportEmail: "support@apexcarehealth.com",
  address: "Plot 42, Health City Complex, G.S. Road, Guwahati, Assam 781005",
  addressLine1: "Plot 42, Health City Complex",
  addressLine2: "G.S. Road, Guwahati, Assam 781005",
  hours: "Mon – Sat: 9:00 AM – 6:00 PM",
  sundayHours: "Sunday Closed (Except Scheduled OPD Dates)",
};

export const MOCK_SPECIALTIES = [
  { _id: "spec-1", name: "Cardiology", slug: "cardiology", active: true },
  { _id: "spec-2", name: "Neurology", slug: "neurology", active: true },
  { _id: "spec-3", name: "Orthopedics", slug: "orthopedics", active: true },
  { _id: "spec-4", name: "Pediatrics", slug: "pediatrics", active: true },
  { _id: "spec-5", name: "Gastroenterology", slug: "gastroenterology", active: true },
  { _id: "spec-6", name: "General Medicine", slug: "general-medicine", active: true },
  { _id: "spec-7", name: "Dermatology", slug: "dermatology", active: true },
  { _id: "spec-8", name: "Oncology", slug: "oncology", active: true },
  { _id: "spec-9", name: "Nephrology", slug: "nephrology", active: true },
  { _id: "spec-10", name: "Pulmonology", slug: "pulmonology", active: true },
];

export const MOCK_DOCTORS = [
  {
    _id: "doc-1",
    name: "Dr. Rajiv Sharma",
    displayName: "Dr. Rajiv Sharma",
    specialty: { _id: "spec-1", name: "Cardiology", slug: "cardiology" },
    qualification: "MBBS, MD (Medicine), DM (Cardiology), FACC",
    experience: 18,
    language: ["English", "Hindi", "Assamese"],
    visitTypes: ["OPD", "Telemedicine"],
    opdDates: getUpcomingDates([2, 5, 9, 14, 21]),
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    bio: "Senior Consultant Interventional Cardiologist with over 18 years of experience in managing complex coronary interventions, heart failure, hypertension, and preventive cardiac wellness.",
    conditionsTreated: [
      { _id: "c-1", name: "Coronary Artery Disease" },
      { _id: "c-2", name: "Hypertension" },
      { _id: "c-3", name: "Heart Arrhythmia" },
      { _id: "c-4", name: "Heart Failure" },
      { _id: "c-5", name: "Chest Pain & Angina" },
      { _id: "c-6", name: "High Cholesterol" },
    ],
  },
  {
    _id: "doc-2",
    name: "Dr. Ananya Mukherjee",
    displayName: "Dr. Ananya Mukherjee",
    specialty: { _id: "spec-6", name: "General Medicine", slug: "general-medicine" },
    qualification: "MBBS, MD (General Medicine)",
    experience: 14,
    language: ["English", "Bengali", "Hindi"],
    visitTypes: ["OPD", "Telemedicine"],
    opdDates: getUpcomingDates([1, 4, 8, 12, 18]),
    photo: "https://images.unsplash.com/photo-1594824813571-638f02614d3f?w=400&auto=format&fit=crop&q=80",
    bio: "Experienced physician specialising in internal medicine, comprehensive diabetes care, metabolic disorders, and infectious illnesses.",
    conditionsTreated: [
      { _id: "c-7", name: "Type 2 Diabetes" },
      { _id: "c-8", name: "Thyroid Disorders" },
      { _id: "c-9", name: "Viral Fevers & Infection" },
      { _id: "c-10", name: "Fatigue & Weakness" },
      { _id: "c-11", name: "Metabolic Syndrome" },
    ],
  },
  {
    _id: "doc-3",
    name: "Dr. Vikramaditya Barua",
    displayName: "Dr. Vikramaditya Barua",
    specialty: { _id: "spec-3", name: "Orthopedics", slug: "orthopedics" },
    qualification: "MBBS, MS (Orthopedics), MCh (Joint Replacement)",
    experience: 20,
    language: ["English", "Assamese", "Hindi"],
    visitTypes: ["OPD", "Telemedicine"],
    opdDates: getUpcomingDates([3, 7, 11, 16]),
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
    bio: "Eminent orthopedic surgeon specializing in knee and hip joint replacements, arthroscopic surgery, sports injuries, and complex fracture management.",
    conditionsTreated: [
      { _id: "c-12", name: "Osteoarthritis" },
      { _id: "c-13", name: "Knee Joint Pain" },
      { _id: "c-14", name: "Sports Injuries & Ligament Tears" },
      { _id: "c-15", name: "Back Pain & Sciatica" },
      { _id: "c-16", name: "Frozen Shoulder" },
    ],
  },
  {
    _id: "doc-4",
    name: "Dr. Sanjay Goel",
    displayName: "Dr. Sanjay Goel",
    specialty: { _id: "spec-2", name: "Neurology", slug: "neurology" },
    qualification: "MBBS, MD (Medicine), DM (Neurology)",
    experience: 16,
    language: ["English", "Hindi"],
    visitTypes: ["OPD", "Telemedicine"],
    opdDates: getUpcomingDates([4, 9, 15, 22]),
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    bio: "Distinguished neurologist with expertise in stroke management, epilepsy, Parkinson's disease, chronic migraines, and peripheral neuropathies.",
    conditionsTreated: [
      { _id: "c-17", name: "Chronic Migraine & Headache" },
      { _id: "c-18", name: "Epilepsy & Seizures" },
      { _id: "c-19", name: "Stroke Rehabilitation" },
      { _id: "c-20", name: "Neuropathy & Numbness" },
      { _id: "c-21", name: "Parkinson's & Tremors" },
    ],
  },
  {
    _id: "doc-5",
    name: "Dr. Priya Nair",
    displayName: "Dr. Priya Nair",
    specialty: { _id: "spec-4", name: "Pediatrics", slug: "pediatrics" },
    qualification: "MBBS, MD (Pediatrics), DNB",
    experience: 11,
    language: ["English", "Hindi", "Malayalam"],
    visitTypes: ["Telemedicine", "OPD"],
    opdDates: getUpcomingDates([2, 6, 10, 15]),
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    bio: "Caring pediatrician with vast expertise in newborn care, childhood immunizations, growth and developmental assessments, and pediatric allergies.",
    conditionsTreated: [
      { _id: "c-22", name: "Childhood Allergies & Asthma" },
      { _id: "c-23", name: "Newborn Wellness & Vaccines" },
      { _id: "c-24", name: "Pediatric Nutrition & Growth" },
      { _id: "c-25", name: "Recurrent Infections" },
    ],
  },
  {
    _id: "doc-6",
    name: "Dr. Alok Dutta",
    displayName: "Dr. Alok Dutta",
    specialty: { _id: "spec-5", name: "Gastroenterology", slug: "gastroenterology" },
    qualification: "MBBS, MD, DM (Medical Gastroenterology)",
    experience: 15,
    language: ["English", "Bengali", "Assamese"],
    visitTypes: ["OPD", "Telemedicine"],
    opdDates: getUpcomingDates([3, 8, 14, 20]),
    photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
    bio: "Consultant gastroenterologist specializing in therapeutic endoscopy, fatty liver disease, irritable bowel syndrome (IBS), and acidity disorders.",
    conditionsTreated: [
      { _id: "c-26", name: "GERD & Acid Reflux" },
      { _id: "c-27", name: "Fatty Liver & Hepatitis" },
      { _id: "c-28", name: "Irritable Bowel Syndrome (IBS)" },
      { _id: "c-29", name: "Ulcerative Colitis & IBD" },
    ],
  },
  {
    _id: "doc-7",
    name: "Dr. Meenakshi Sundaram",
    displayName: "Dr. Meenakshi Sundaram",
    specialty: { _id: "spec-7", name: "Dermatology", slug: "dermatology" },
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    experience: 9,
    language: ["English", "Hindi", "Tamil"],
    visitTypes: ["Telemedicine"],
    opdDates: [],
    photo: "https://images.unsplash.com/photo-1594824813571-638f02614d3f?w=400&auto=format&fit=crop&q=80",
    bio: "Consultant dermatologist providing specialized care for chronic eczema, acne, psoriasis, hair loss, and cosmetic clinical dermatology.",
    conditionsTreated: [
      { _id: "c-30", name: "Acne & Skin Blemishes" },
      { _id: "c-31", name: "Psoriasis & Eczema" },
      { _id: "c-32", name: "Alopecia & Hair Loss" },
      { _id: "c-33", name: "Fungal Skin Infections" },
    ],
  },
  {
    _id: "doc-8",
    name: "Dr. Sunita Borah",
    displayName: "Dr. Sunita Borah",
    specialty: { _id: "spec-10", name: "Pulmonology", slug: "pulmonology" },
    qualification: "MBBS, MD (Pulmonary Medicine), FCCP",
    experience: 13,
    language: ["English", "Assamese", "Hindi"],
    visitTypes: ["OPD", "Telemedicine"],
    opdDates: getUpcomingDates([1, 5, 10, 17]),
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    bio: "Senior Pulmonologist and sleep medicine specialist managing chronic asthma, COPD, bronchitis, allergic cough, and post-viral lung recovery.",
    conditionsTreated: [
      { _id: "c-34", name: "Bronchial Asthma" },
      { _id: "c-35", name: "COPD & Emphysema" },
      { _id: "c-36", name: "Chronic Cough & Wheezing" },
      { _id: "c-37", name: "Sleep Apnea" },
    ],
  },
];

export const MOCK_TESTIMONIALS = [
  {
    _id: "t-1",
    name: "Manoj Kalita",
    location: "Guwahati",
    rating: 5,
    message:
      "The OPD booking was extremely smooth. The doctor arrived on time and took great care to explain every test in detail. Truly grateful for the coordination team.",
    doctorName: "Dr. Rajiv Sharma",
    specialty: "Cardiology",
  },
  {
    _id: "t-2",
    name: "Pooja Roy",
    location: "Shillong",
    rating: 5,
    message:
      "I booked a telemedicine consultation from home. The video connection was crystal clear, and the coordinator sent the prescription immediately on WhatsApp.",
    doctorName: "Dr. Ananya Mukherjee",
    specialty: "General Medicine",
  },
  {
    _id: "t-3",
    name: "Diganta Baruah",
    location: "Tezpur",
    rating: 5,
    message:
      "Visiting the centre for an orthopedic review saved me from traveling out of state unnecessarily. Excellent facility and courteous staff.",
    doctorName: "Dr. Vikramaditya Barua",
    specialty: "Orthopedics",
  },
];

export const MOCK_BLOGS = [
  {
    slug: "managing-hypertension-guide",
    title: "10 Daily Habits to Keep Your Blood Pressure in Healthy Range",
    excerpt:
      "Hypertension is often called the silent killer. Learn evidence-based lifestyle changes to protect your heart and blood vessels.",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    slug: "healthy-joint-care-tips",
    title: "Maintaining Strong Joints: Exercises and Nutrition for Mobility",
    excerpt:
      "Preventing osteoarthritis starts with simple daily movements, proper posture, and nutrient-dense foods rich in Vitamin D and Calcium.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
  {
    slug: "telemedicine-preparation-guide",
    title: "How to Prepare for Your Online Video Doctor Consultation",
    excerpt:
      "Make the most of your remote telemedicine appointment with these practical tips for lighting, medical records, and question lists.",
    coverImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  },
];
