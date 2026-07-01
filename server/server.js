require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Global Security Hardening Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// API Brute-Force Rate Limiting (100 requests max every 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: 'Too many requests from this device. Please try again later.' }
});
app.use('/api/', apiLimiter);

// Bind Route Controllers
app.use('/api/auth', require('./routes/auth'));

// Base Checkpoint Test Route
app.get('/', (req, res) => res.send('SyncSpace API Core running securely...'));

const PORT = process.env.PORT || 5000;

// Connect to Local/Cloud Cluster Mongo Instance
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully.');
    app.listen(PORT, () => console.log(`Server engine executing safely on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection breakdown encountered:', err.message);
  });