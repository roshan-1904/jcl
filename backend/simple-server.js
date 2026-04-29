const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: 'Leadership Summit 2024',
    date: '2024-05-15',
    time: '10:00 AM',
    location: 'JCI Salem Hall',
    description: 'Annual leadership summit featuring industry leaders',
    type: 'Conference',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'Community Service Drive',
    date: '2024-06-20',
    time: '9:00 AM',
    location: 'Salem Town Center',
    description: 'Community outreach program for local development',
    type: 'Service',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop',
    createdAt: new Date()
  }
];

const mockMembers = [
  {
    id: 1,
    name: 'JFP. HGF. S. GOWTHAM',
    role: 'President',
    bio: 'Leading the chapter with vision and dedication',
    image: 'https://www.jcislmmidtown.com/assets/images/team/team-1.jpg',
    display_order: 1
  },
  {
    id: 2,
    name: 'Jc. HGF. K. PRABHU',
    role: 'Secretary',
    bio: 'Managing chapter operations and communications',
    image: 'https://www.jcislmmidtown.com/assets/images/team/team-2.jpg',
    display_order: 2
  },
  {
    id: 3,
    name: 'Jc. HGF. R. RAJKUMAR',
    role: 'Member',
    bio: 'Active contributor to chapter initiatives',
    image: 'https://www.jcislmmidtown.com/assets/images/team/team-3.jpg',
    display_order: 3
  }
];

const mockEnquiries = [];

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'jclmidtown',
  password: process.env.ADMIN_PASSWORD || 'jcl&123'
};

app.get('/', (req, res) => {
  res.send('JC Demo Backend (Mock Data) is running...');
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
  res.json(mockEvents);
});

// POST event
app.post('/api/events', (req, res) => {
  const { title, date, time, location, description, type, image } = req.body;
  const newEvent = {
    id: mockEvents.length + 1,
    title,
    date,
    time,
    location,
    description,
    type,
    image,
    createdAt: new Date()
  };
  mockEvents.push(newEvent);
  res.json({ message: 'Event created', id: newEvent.id });
});

// UPDATE event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { title, date, time, location, description, type, image } = req.body;
  const eventIndex = mockEvents.findIndex(e => e.id == id);
  if (eventIndex !== -1) {
    mockEvents[eventIndex] = { ...mockEvents[eventIndex], title, date, time, location, description, type, image };
    res.json({ message: 'Event updated' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const eventIndex = mockEvents.findIndex(e => e.id == id);
  if (eventIndex !== -1) {
    mockEvents.splice(eventIndex, 1);
    res.json({ message: 'Event deleted' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// ================= MEMBERS =================

app.get('/api/members', (req, res) => {
  res.json(mockMembers);
});

app.post('/api/members', (req, res) => {
  const { name, role, bio, image, display_order } = req.body;
  const newMember = {
    id: mockMembers.length + 1,
    name,
    role,
    bio,
    image,
    display_order: display_order || 0
  };
  mockMembers.push(newMember);
  res.json({ message: 'Member added', id: newMember.id });
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const { name, role, bio, image, display_order } = req.body;
  const memberIndex = mockMembers.findIndex(m => m.id == id);
  if (memberIndex !== -1) {
    mockMembers[memberIndex] = { ...mockMembers[memberIndex], name, role, bio, image, display_order };
    res.json({ message: 'Member updated' });
  } else {
    res.status(404).json({ message: 'Member not found' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const memberIndex = mockMembers.findIndex(m => m.id == id);
  if (memberIndex !== -1) {
    mockMembers.splice(memberIndex, 1);
    res.json({ message: 'Member deleted' });
  } else {
    res.status(404).json({ message: 'Member not found' });
  }
});

// ================= ENQUIRIES =================

app.get('/api/enquiries', (req, res) => {
  res.json(mockEnquiries);
});

app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, location, message } = req.body;
  const newEnquiry = {
    id: mockEnquiries.length + 1,
    name,
    email,
    phone,
    location,
    message,
    createdAt: new Date()
  };
  mockEnquiries.push(newEnquiry);
  res.json({ message: 'Enquiry saved', id: newEnquiry.id });
});

app.delete('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const enquiryIndex = mockEnquiries.findIndex(e => e.id == id);
  if (enquiryIndex !== -1) {
    mockEnquiries.splice(enquiryIndex, 1);
    res.json({ message: 'Enquiry deleted' });
  } else {
    res.status(404).json({ message: 'Enquiry not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('✅ Using mock data (no database required)');
});
