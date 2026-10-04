const AIClient = require('../services/aiClient');
const QuizResult = require('../models/QuizResult');
const LearningProgress = require('../models/LearningProgress');
const User = require('../models/User');

let memorySafetyScore = {
  currentScore: 82,
  history: [
    { score: 68, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { score: 76, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { score: 82, date: new Date() }
  ],
  topicScores: {
    'Scam Awareness': 90,
    'Document Awareness': 85,
    'Grievance Process': 80,
    'Investor Rights': 75,
    'KYC Awareness': 70,
    'Financial Safety Habits': 85
  },
  strongAreas: ['Scam Awareness', 'Document Awareness', 'Financial Safety Habits'],
  weakAreas: ['KYC Awareness', 'Investor Rights'],
  completedModules: ['mod_scams', 'mod_charges']
};

exports.getQuiz = async (req, res, next) => {
  try {
    const { difficulty, count } = req.query;
    const questions = await AIClient.getQuiz(difficulty, count ? Number(count) : 4);
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

exports.submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Valid answers object required.' });
    }

    const evaluation = await AIClient.submitQuiz(answers);
    const newScore = evaluation.overall_safety_score || 82;

    // Update memory state
    memorySafetyScore.history.push({
      score: newScore,
      date: new Date()
    });
    memorySafetyScore.currentScore = newScore;
    memorySafetyScore.topicScores = evaluation.topic_scores || memorySafetyScore.topicScores;
    memorySafetyScore.weakAreas = evaluation.weak_areas || memorySafetyScore.weakAreas;
    memorySafetyScore.strongAreas = evaluation.strong_areas || memorySafetyScore.strongAreas;

    // Persist to DB if connected
    try {
      if (req.user?._id) {
        await QuizResult.create({
          userId: req.user._id,
          score: newScore,
          topicScores: evaluation.topic_scores,
          weakAreas: evaluation.weak_areas,
          gradedQuestions: evaluation.graded_questions
        });

        await User.findByIdAndUpdate(req.user._id, {
          safetyScore: newScore,
          weakAreas: evaluation.weak_areas
        });
      }
    } catch (e) {}

    res.json({
      message: 'Quiz evaluated successfully.',
      newSafetyScore: newScore,
      topicScores: memorySafetyScore.topicScores,
      strongAreas: memorySafetyScore.strongAreas,
      weakAreas: memorySafetyScore.weakAreas,
      recommendedModules: evaluation.recommended_modules,
      nextBestAction: evaluation.next_best_action
    });
  } catch (error) {
    next(error);
  }
};

exports.getSafetyScore = async (req, res, next) => {
  try {
    res.json(memorySafetyScore);
  } catch (error) {
    next(error);
  }
};
