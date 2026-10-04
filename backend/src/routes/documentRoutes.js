const express = require('express');
const router = express.Router();
const multer = require('multer');
const os = require('os');
const path = require('path');
const documentController = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');

const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15 MB limit
});

router.post('/analyze', authenticate, upload.single('file'), documentController.analyzeDocument);
router.get('/', authenticate, documentController.getDocuments);
router.get('/:id', authenticate, documentController.getDocumentById);

module.exports = router;
