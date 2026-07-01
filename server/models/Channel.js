const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  workspaceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workspace', 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['text', 'voice'], 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);