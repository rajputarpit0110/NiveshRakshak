const express = require('express');
const router = express.Router();
const scamController = require('../controllers/scamController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, scamController.checkScam);

module.exports = router;
