const express = require('express');
const router = express.Router();
const ragController = require('../controllers/ragController');
const { authenticate } = require('../middleware/auth');

router.post('/ask', authenticate, ragController.ask);
router.get('/health', ragController.getHealth);
router.post('/ingest', ragController.triggerIngest);
router.post('/reindex', ragController.triggerReindex);
router.post('/evaluate', ragController.triggerEvaluate);

module.exports = router;
