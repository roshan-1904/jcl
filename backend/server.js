const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Set DNS servers to Google's to ensure SRV records can be resolved
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

// 1. DYNAMIC CORS - Whitelist approach
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://jclsalem.netlify.app',
  'https://jclsalem.netlify.app/',
  'https://jc-demo.netlify.app',
  'https://jc-demo.netlify.app/'
].filter(Boolean);

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204
}));

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// 🚀 PRODUCTION OPTIMIZATIONS
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression()); // Gzip compression

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// MongoDB Connection
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in .env file');
} else {
  mongoose.connect(MONGO_URI, {
    maxPoolSize: 10, // Connection pooling
  })
    .then(() => {
      console.log('Successfully connected to MongoDB');
    })
    .catch((err) => {
      console.error('WARNING: MongoDB connection failed:', err.message);
    });
}

// Event Schema - Added Indexing
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, index: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

const Event = mongoose.model('Event', eventSchema);

// Team Member Schema - Added Indexing
const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0, index: true },
  createdAt: { type: Date, default: Date.now }
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

// Enquiry Schema - Added Indexing
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

// President Schema
const presidentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  image: { type: String, required: true }, // Stores URL or Base64
  createdAt: { type: Date, default: Date.now }
});

const President = mongoose.model('President', presidentSchema);

// Legacy Image Schema
const legacyImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: 'Legacy Memory' },
  createdAt: { type: Date, default: Date.now, index: true }
});

const LegacyImage = mongoose.model('LegacyImage', legacyImageSchema);

// About Content Schema
const aboutContentSchema = new mongoose.Schema({
  title: { type: String, default: 'About JCI MidTown' },
  subtitle: { type: String, default: 'Leadership Since 1981' },
  description: { type: String, default: 'Dedicated to empowering young leaders, fostering community development, and driving positive change.' },
  image: { type: String, default: '' },
  homeAboutImage: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'jclmidtown',
  password: process.env.ADMIN_PASSWORD || 'jcl&123'
};

// Middleware to check DB connection
const checkDbConnection = (req, res, next) => {
  const state = mongoose.connection.readyState;
  if (state !== 1) {
    const states = {
      0: 'disconnected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized',
    };
    return res.status(503).json({ 
      message: 'Database connection is not ready.',
      status: states[state] || 'unknown',
      info: 'Please check your MONGO_URI and MongoDB Atlas IP whitelist.'
    });
  }
  next();
};

app.get('/', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized',
  };
  res.send(`JC Demo Backend is running. Status: ${states[state] || 'Unknown'}`);
});

// 🏥 Health Check Endpoint
app.get('/api/health', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };
  
  const state = mongoose.connection.readyState;
  
  res.json({
    status: state === 1 ? 'healthy' : 'unhealthy',
    database: {
      state: states[state] || 'unknown',
      connected: state === 1,
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 🔐 Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// ================= ABOUT CONTENT =================

app.get('/api/about-content', checkDbConnection, async (req, res) => {
  try {
    let content = await AboutContent.findOne().lean();
    if (!content) {
      content = await AboutContent.create({
        title: 'About JCI MidTown',
        subtitle: 'Leadership Since 1981',
        description: 'Dedicated to empowering young leaders, fostering community development, and driving positive change.',
        image: '',
        homeAboutImage: ''
      });
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching about content', error: err.message });
  }
});

app.put('/api/about-content', checkDbConnection, async (req, res) => {
  try {
    const content = await AboutContent.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: 'Error updating about content', error: err.message });
  }
});

// ================= EVENTS =================

// GET events - Using select() to fetch only needed fields for performance
app.get('/api/events', checkDbConnection, async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=60'); 
    const events = await Event.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean(); // Faster execution
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// POST event
app.post('/api/events', checkDbConnection, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Event created', id: savedEvent._id });
  } catch (err) {
    res.status(400).json({ message: 'Error creating event', error: err.message });
  }
});

// UPDATE event
app.put('/api/events/:id', checkDbConnection, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating event', error: err.message });
  }
});

// DELETE event
app.delete('/api/events/:id', checkDbConnection, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting event', error: err.message });
  }
});


// ================= MEMBERS =================

app.get('/api/members', checkDbConnection, async (req, res) => {
  try {
    const members = await TeamMember.find()
      .select('-__v')
      .sort({ order: 1 })
      .lean();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching members', error: err.message });
  }
});

app.post('/api/members', checkDbConnection, async (req, res) => {
  try {
    const newMember = new TeamMember(req.body);
    const savedMember = await newMember.save();
    res.status(201).json({ message: 'Member added', id: savedMember._id });
  } catch (err) {
    res.status(400).json({ message: 'Error adding member', error: err.message });
  }
});

// ================= PRESIDENTS =================

app.get('/api/presidents', checkDbConnection, async (req, res) => {
  try {
    const presidents = await President.find().sort({ year: -1 }).lean();
    res.json(presidents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching presidents', error: err.message });
  }
});

app.post('/api/presidents', checkDbConnection, async (req, res) => {
  try {
    const newPresident = new President(req.body);
    const saved = await newPresident.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error adding president', error: err.message });
  }
});

app.put('/api/presidents/:id', checkDbConnection, async (req, res) => {
  try {
    const updated = await President.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error updating president', error: err.message });
  }
});

app.delete('/api/presidents/:id', checkDbConnection, async (req, res) => {
  try {
    await President.findByIdAndDelete(req.params.id);
    res.json({ message: 'President deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting president', error: err.message });
  }
});

// ================= LEGACY IMAGES =================

app.get('/api/legacy-images', checkDbConnection, async (req, res) => {
  try {
    const images = await LegacyImage.find().sort({ createdAt: -1 }).lean();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching legacy images', error: err.message });
  }
});

app.post('/api/legacy-images', checkDbConnection, async (req, res) => {
  try {
    const newImage = new LegacyImage(req.body);
    const saved = await newImage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error adding legacy image', error: err.message });
  }
});

app.delete('/api/legacy-images/:id', checkDbConnection, async (req, res) => {
  try {
    await LegacyImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Legacy image deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting legacy image', error: err.message });
  }
});

// ================= ENQUIRIES =================

app.get('/api/enquiries', checkDbConnection, async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiries', error: err.message });
  }
});

app.post('/api/enquiries', checkDbConnection, async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    const savedEnquiry = await newEnquiry.save();
    res.status(201).json({ message: 'Enquiry saved', id: savedEnquiry._id });
  } catch (err) {
    res.status(400).json({ message: 'Error saving enquiry', error: err.message });
  }
});

app.delete('/api/enquiries/:id', checkDbConnection, async (req, res) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deletedEnquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting enquiry', error: err.message });
  }
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server is running on port ${PORT}`);
  }
});
