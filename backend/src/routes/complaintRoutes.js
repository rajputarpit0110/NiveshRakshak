const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, complaintController.createComplaint);
router.get('/', authenticate, complaintController.getComplaints);
router.get('/:id', authenticate, complaintController.getComplaintById);
router.post('/:id/analyze', authenticate, complaintController.analyzeComplaint);
router.post('/:id/draft', authenticate, complaintController.draftComplaint);
router.post('/:id/quality-check', authenticate, complaintController.qualityCheck);
router.post('/:id/status', authenticate, complaintController.updateStatus);
router.get('/:id/pdf', authenticate, complaintController.downloadPDF);

module.exports = router;
