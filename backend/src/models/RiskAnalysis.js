const mongoose = require('mongoose');

const riskAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  textExcerpt: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
    default: 'LOW'
  },
  riskScore: {
    type: Number,
    default: 0
  },
  signals: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  recommendedActions: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.RiskAnalysis || mongoose.model('RiskAnalysis', riskAnalysisSchema);
