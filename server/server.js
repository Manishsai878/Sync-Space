// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const Message = require('./models/Message');

require('dotenv').config();

const app = express();
const server = http.createServer(app); 

const io = require('socket.io')(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://sync-space-vet4.onrender.com"
    ],
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
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// --- DEPLOYMENT FRONTEND CONFIGURATION ---
const frontendBuildPath = path.join(__dirname, '../client/dist');
console.log(`🔍 Checking production assets path at: ${frontendBuildPath}`);

// Serve static assets out of the client build folder
app.use(express.static(frontendBuildPath));

// Strict catch-all for React SPA Router logic
app.get(/^\/(?!api).*/, (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`<h3>Deployment Error: Production build folder missing!</h3><p>Ensure your build script compiled the frontend into: <code>${frontendBuildPath}</code></p>`);
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sync-space')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

// Change your port definition to this:
const PORT = process.env.PORT || 5000;

// Ensure your app.listen uses that PORT variable:
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});