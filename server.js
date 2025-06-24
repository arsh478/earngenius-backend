// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint (CRUCIAL for Render)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'active',
    service: 'EarnGenius Backend',
    version: '1.0.0'
  });
});

// Mock Database
let users = {};

// Initialize user if not exists
const initializeUser = (userId) => {
  if (!users[userId]) {
    users[userId] = { coins: 0 };
  }
  return users[userId];
};

// API Endpoints
app.get('/api/coins/:userId', (req, res) => {
  try {
    const user = initializeUser(req.params.userId);
    res.json({ 
      success: true,
      coins: user.coins 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

app.post('/api/add-coins', (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    const user = initializeUser(userId);
    user.coins += Number(amount);
    
    res.json({ 
      success: true,
      coins: user.coins 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

app.post('/api/redeem', (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing user ID' 
      });
    }

    const user = initializeUser(userId);
    
    if (user.coins < 50) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient coins (minimum 50 required)' 
      });
    }

    user.coins = 0;
    res.json({ 
      success: true,
      message: 'Redeem successful' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
