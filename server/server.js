// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const Message = require('./models/Message');

require('dotenv').config();

const app = express();
const server = http.createServer(app); 

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Could not load messages" });
  }
});

// Socket.io Real-Time Logic
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('sendMessage', async (messageData) => {
    try {
      const newMessage = new Message({
        text: messageData.text,
        sender: messageData.sender,
        timestamp: messageData.timestamp
      });
      await newMessage.save();

      io.emit('receiveMessage', messageData);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: /${socket.id}`);
  });
});

// --- COMPLETE THE APP: SERVE FRONTEND ---
// 1. Point Express to the React build folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// 2. Catch-all route: Using a strict regex literal to match everything safely in Express v5 🚀
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sync-space')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});