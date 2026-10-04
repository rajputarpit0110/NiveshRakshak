const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  score: {
    type: Number,
    required: true
  },
  topicScores: {
    type: Map,
    of: Number,
    default: {}
  },
  weakAreas: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    default: 'adaptive'
  },
  gradedQuestions: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema);
