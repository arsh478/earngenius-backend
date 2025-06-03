// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Mock DB
let users = {
  'demo_user': { coins: 0 }
};

// Endpoint to get user coins
app.get('/api/coins/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!users[userId]) users[userId] = { coins: 0 };
  res.json({ coins: users[userId].coins });
});

// Add coins after task
app.post('/api/add-coins', (req, res) => {
  const { userId, amount } = req.body;
  if (!users[userId]) users[userId] = { coins: 0 };
  users[userId].coins += amount;
  res.json({ success: true, coins: users[userId].coins });
});

// Redeem coins
app.post('/api/redeem', (req, res) => {
  const { userId } = req.body;
  if (!users[userId] || users[userId].coins < 50) {
    return res.status(400).json({ success: false, message: 'Insufficient coins' });
  }
  users[userId].coins = 0;
  res.json({ success: true, message: 'Redeem request successful' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
