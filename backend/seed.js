const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Set DNS servers to Google's to ensure SRV records can be resolved
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not found in .env');
  process.exit(1);
}

const presidentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const President = mongoose.model('President', presidentSchema);

const staticPresidents = [
  { name: "Jc. Ashok", year: "2026", imageFile: "ASHOK.jpg" },
  { name: "Jc. Ashif Iqbal", year: "2025", imageFile: "ASHIF IQBAL.jpg" },
  { name: "Jc. Hari Prasad", year: "2024", imageFile: "HARI PRASAD.jpg" },
  { name: "Jc. Hari Prasath", year: "2023", imageFile: "HARI PRASATH.jpg" },
  { name: "Jc. Jayahari", year: "2022", imageFile: "JAYAHARI.jpg" },
  { name: "Jc. Manikandan", year: "2021", imageFile: "MANIKANDAN.jpg" },
  { name: "Jc. Nagaraj", year: "2020", imageFile: "NAGARAJ.jpg" },
  { name: "Jc. Prabhakaran", year: "2019", imageFile: "PRABHAKARAN.jpg" },
  { name: "Jc. Raj Vignesh", year: "2018", imageFile: "RAJ VIGNESH.jpg" },
  { name: "Jc. Sabari", year: "2017", imageFile: "SABARI.jpg" },
  { name: "Jc. Sakthivel", year: "2016", imageFile: "SAKTHIVEL.jpg" },
  { name: "Jc. Sanjaykumar", year: "2015", imageFile: "SANJAYKUMAR.jpg" },
  { name: "Jc. Sathish Kumar", year: "2014", imageFile: "SATHISH KUMAR.jpg" },
  { name: "Jc. Swati Ravikumar", year: "2013", imageFile: "SWATI RAVIKUMAR.jpg" },
  { name: "Jc. Tharunvel", year: "2012", imageFile: "THARUNVEL.jpg" },
  { name: "Jc. Varoon Rajan", year: "2011", imageFile: "VAROON RAJAN.jpg" },
  { name: "Jc. Vijayaragavan", year: "2010", imageFile: "VIJAYARAGAVAN.jpg" }
];

const imageDir = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'image');

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const presidentsToInsert = [];

    for (const p of staticPresidents) {
      const imagePath = path.join(imageDir, p.imageFile);
      let base64Image = '';
      
      if (fs.existsSync(imagePath)) {
        const fileBuffer = fs.readFileSync(imagePath);
        const extension = path.extname(imagePath).replace('.', '');
        base64Image = `data:image/${extension === 'jpg' ? 'jpeg' : extension};base64,${fileBuffer.toString('base64')}`;
      } else {
        console.warn(`Image not found: ${imagePath}`);
        base64Image = 'https://via.placeholder.com/400x400?text=Leader'; // Fallback
      }

      presidentsToInsert.push({
        name: p.name,
        year: p.year,
        image: base64Image
      });
    }

    // Clear existing to ensure fresh start as requested
    await President.deleteMany({});
    await President.insertMany(presidentsToInsert);
    console.log(`Successfully migrated ${presidentsToInsert.length} presidents to the database with Base64 images.`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
  }
}

seed();
