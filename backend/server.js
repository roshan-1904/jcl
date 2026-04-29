const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');

// Set DNS servers to Google's to ensure SRV records can be resolved
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// MySQL Connection - Use root user to avoid permission issues
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: 'root',
  password: '',
  database: process.env.DB_NAME || 'jci_db'
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('WARNING: MongoDB connection failed:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Team Member Schema
const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

// Enquiry Schema
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'jclmidtown',
  password: process.env.ADMIN_PASSWORD || 'jcl&123'
};

// Middleware to check DB connection
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection is currently offline. Please verify your MongoDB configuration.',
      status: 'offline'
    });
  }
  next();
};

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.send(`JC Demo Backend is running. Database Status: ${dbStatus}`);
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

// Events endpoints
app.get('/api/events', checkDbConnection, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
});

// ================= EVENTS =================

// GET events
app.get('/api/events', (req, res) => {
  db.query('SELECT * FROM events ORDER BY createdAt DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST event
app.post('/api/events', (req, res) => {
  const { title, date, time, location, description, type, image } = req.body;

  const sql = `
    INSERT INTO events (title, date, time, location, description, type, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, date, time, location, description, type, image], (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Event created', id: result.insertId });
  });
});

// UPDATE event
app.put('/api/events/:id', (req, res) => {
  const { title, date, time, location, description, type, image } = req.body;

  const sql = `
    UPDATE events SET title=?, date=?, time=?, location=?, description=?, type=?, image=?
    WHERE id=?
  `;

  db.query(sql, [title, date, time, location, description, type, image, req.params.id], (err) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Event updated' });
  });
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  db.query('DELETE FROM events WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Event deleted' });
  });
});


// ================= MEMBERS =================

app.get('/api/members', (req, res) => {
  db.query('SELECT * FROM members ORDER BY display_order ASC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/api/members', (req, res) => {
  const { name, role, bio, image, display_order } = req.body;

  db.query(
    'INSERT INTO members (name, role, bio, image, display_order) VALUES (?, ?, ?, ?, ?)',
    [name, role, bio, image, display_order || 0],
    (err, result) => {
      if (err) return res.status(400).json(err);
      res.json({ message: 'Member added', id: result.insertId });
    }
  );
});

app.put('/api/members/:id', (req, res) => {
  const { name, role, bio, image, display_order } = req.body;

  db.query(
    'UPDATE members SET name=?, role=?, bio=?, image=?, display_order=? WHERE id=?',
    [name, role, bio, image, display_order, req.params.id],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: 'Member updated' });
    }
  );
});

// Enquiry endpoints
app.get('/api/enquiries', checkDbConnection, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiries', error: err.message });
  }
});


// ================= ENQUIRIES =================

app.get('/api/enquiries', (req, res) => {
  db.query('SELECT * FROM enquiries ORDER BY createdAt DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, location, message } = req.body;

  db.query(
    'INSERT INTO enquiries (name, email, phone, location, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, location, message],
    (err, result) => {
      if (err) return res.status(400).json(err);
      res.json({ message: 'Enquiry saved', id: result.insertId });
    }
  );
});

app.delete('/api/enquiries/:id', (req, res) => {
  db.query('DELETE FROM enquiries WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Enquiry deleted' });
  });
});