const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticate } = require('../middleware/auth');

router.get('/', quizController.getQuiz);
router.post('/submit', authenticate, quizController.submitQuiz);
router.get('/safety-score', authenticate, quizController.getSafetyScore);

module.exports = router;
