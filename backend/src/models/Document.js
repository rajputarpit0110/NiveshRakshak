const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  fileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    default: 'Financial Statement'
  },
  extractedEntities: {
    type: [String],
    default: []
  },
  findings: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  detectedCharges: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Document || mongoose.model('Document', documentSchema);
