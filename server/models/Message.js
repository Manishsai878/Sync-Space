const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  channelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Channel', 
    required: true, 
    index: true 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  textContent: { 
    type: String, 
    required: false,
    trim: true 
  },
  fileUrl: { 
    type: String, 
    required: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);