const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  currentScore: {
    type: Number,
    default: 72
  },
  completedModules: {
    type: [String],
    default: ['mod_scams']
  },
  safetyScoreHistory: [
    {
      score: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.LearningProgress || mongoose.model('LearningProgress', learningProgressSchema);
