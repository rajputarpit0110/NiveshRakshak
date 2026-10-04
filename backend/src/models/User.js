const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['investor', 'admin'],
    default: 'investor'
  },
  phone: {
    type: String,
    default: ''
  },
  clientCode: {
    type: String,
    default: 'UCC-78901'
  },
  safetyScore: {
    type: Number,
    default: 72
  },
  weakAreas: {
    type: [String],
    default: ['Scam Awareness', 'Tariff Transparency']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
