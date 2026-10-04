const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  entity: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Unauthorized charges'
  },
  subcategory: {
    type: String,
    default: 'Disputed Ledger Entry'
  },
  severity: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'MEDIUM'
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  evidence: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  analysis: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  draftText: {
    type: String,
    default: ''
  },
  qualityScore: {
    type: Number,
    default: 75
  },
  status: {
    type: String,
    enum: ['Submitted', 'Acknowledged', 'Under Review', 'Escalated', 'Resolved'],
    default: 'Submitted'
  },
  daysRemaining: {
    type: Number,
    default: 21
  },
  escalationEligible: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date,
    default: () => new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

complaintSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
