require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Required root route for Render
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    service: 'EarnGenius Backend',
    message: 'API is working correctly'
  });
});

// Mock database
let users = {};

// API Endpoints
app.get('/api/coins/:userId', (req, res) => {
  const userId = req.params.userId;
  users[userId] = users[userId] || { coins: 0 };
  res.json({ coins: users[userId].coins });
});

app.post('/api/add-coins', (req, res) => {
  const { userId, amount } = req.body;
  users[userId] = users[userId] || { coins: 0 };
  users[userId].coins += amount;
  res.json({ success: true, coins: users[userId].coins });
});

app.post('/api/redeem', (req, res) => {
  const { userId } = req.body;
  if (!users[userId] || users[userId].coins < 50) {
    return res.status(400).json({ 
      success: false, 
      message: 'Insufficient coins' 
    });
  }
  users[userId].coins = 0;
  res.json({ success: true, message: 'Redeem successful' });
});

 // To allow requests from your Netlify domain:
const corsOptions = {
  origin: ['https://watchxearn.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
