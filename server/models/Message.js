// server/models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Automatically tracks when messages were created

module.exports = mongoose.model('Message', MessageSchema);