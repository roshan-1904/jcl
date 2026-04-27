const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection - Use root user to avoid permission issues
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: 'root',
  password: '',
  database: process.env.DB_NAME || 'jci_db'
});

db.connect((err) => {
  if (err) {
    console.error(' MySQL connection error:', err);
  } else {
    console.log(' Connected to MySQL');
    console.log('✅ Connected to MySQL');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
});

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'jclmidtown',
  password: process.env.ADMIN_PASSWORD || 'jcl&123'
};

app.get('/', (req, res) => {
  res.send('JC Demo Backend (MySQL) is running...');
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

app.delete('/api/members/:id', (req, res) => {
  db.query('DELETE FROM members WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Member deleted' });
  });
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