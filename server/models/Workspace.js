const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  channels: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Channel' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', WorkspaceSchema);