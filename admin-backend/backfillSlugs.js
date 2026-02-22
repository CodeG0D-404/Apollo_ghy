const mongoose = require("mongoose");
const Doctor = require("./models/Doctor");
const slugify = require("slugify");

async function backfillSlugs() {
  try {
    // 🔹 Use your Atlas connection string
    await mongoose.connect(
      "mongodb+srv://DrCipher:xH3Cv6sz7Lbabh9F@clusterapollo.qypmsmw.mongodb.net/apollo?retryWrites=true&w=majority&appName=ClusterApollo"
    );

    const doctors = await Doctor.find({ slug: { $exists: false } });
    for (const doc of doctors) {
      doc.slug = slugify(doc.name, { lower: true, strict: true });
      await doc.save();
      console.log(`✅ Updated slug for: ${doc.name} → ${doc.slug}`);
    }

    console.log("🎉 Backfill completed!");
  } catch (err) {
    console.error("❌ Error backfilling slugs:", err);
  } finally {
    mongoose.disconnect();
  }
}

backfillSlugs();
