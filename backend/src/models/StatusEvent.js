const mongoose = require('mongoose');

const statusEventSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    index: true
  },
  stage: {
    type: String,
    enum: ['Submitted', 'Acknowledged', 'Under Review', 'Escalated', 'Resolved'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: true
  }
});

module.exports = mongoose.models.StatusEvent || mongoose.model('StatusEvent', statusEventSchema);
