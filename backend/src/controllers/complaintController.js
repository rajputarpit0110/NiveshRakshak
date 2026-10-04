const crypto = require('crypto');
const Complaint = require('../models/Complaint');
const StatusEvent = require('../models/StatusEvent');
const AIClient = require('../services/aiClient');
const PDFService = require('../services/pdfService');

// In-memory fallback if MongoDB is not connected
let memoryComplaints = [
  {
    _id: 'c_demo_01',
    complaintId: 'INV-10234',
    userId: '660000000000000000000001',
    entity: 'Zerodha Broking Limited',
    category: 'Unauthorized charges',
    subcategory: 'Disputed Ledger Debit',
    severity: 'HIGH',
    description: 'Noticed an unexplained ledger debit of ₹2,500 marked as "Sundry Admin Fee" without any prior contract note or tariff schedule disclosure.',
    amount: 2500,
    evidence: [
      { name: 'Financial Ledger Extract showing ₹2,500 debit', verified: true },
      { name: 'Contract Note for settlement period', verified: true }
    ],
    qualityScore: 88,
    status: 'Under Review',
    daysRemaining: 14,
    escalationEligible: false,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    draftText: 'To,\nThe Compliance Officer,\nZerodha Broking Limited\n\nSubject: Formal Dispute regarding ₹2,500 Ledger Debit on Account UCC-78901\n\nI am writing to register an official dispute regarding an unexplained deduction of ₹2,500 reflected in my ledger under UCC UCC-78901. Under SEBI regulations, all levies must be supported by transparent disclosure in the tariff sheet and relevant contract notes. Kindly reverse this debit or furnish an itemized calculation within 3 working days.\n\nYours faithfully,\nRohan Sharma\nClient Code: UCC-78901',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

let memoryStatusEvents = [
  {
    complaintId: 'INV-10234',
    stage: 'Submitted',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    note: 'Initial formal grievance notice generated and sent to broker compliance officer.'
  },
  {
    complaintId: 'INV-10234',
    stage: 'Acknowledged',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    note: 'Broker automated acknowledgment received with Ticket #ZD-883921.'
  },
  {
    complaintId: 'INV-10234',
    stage: 'Under Review',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    note: 'Complaint under compliance officer audit. 14 days remaining before SCORES escalation.'
  }
];

exports.createComplaint = async (req, res, next) => {
  try {
    const { entity, category, description, amount, evidence, clientId } = req.body;
    const complaintId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Analyze with AI
    const analysis = await AIClient.analyzeGrievance({
      entity,
      category,
      description,
      amount,
      attachedEvidence: evidence
    });

    // 2. Draft Complaint with AI
    const draft = await AIClient.draftComplaint({
      entity,
      category,
      description,
      amount,
      clientId: clientId || req.user?.clientCode || 'UCC-78901',
      evidence,
      investorProfile: {
        name: req.user?.name || 'Aggrieved Investor',
        email: req.user?.email || 'investor@example.com'
      }
    });

    const qualityScore = draft.quality_evaluation?.quality_score || 85;

    let complaintDoc;
    try {
      complaintDoc = await Complaint.create({
        complaintId,
        userId: req.user?._id,
        entity,
        category: category || analysis.grievance?.category || 'Unauthorized charges',
        subcategory: analysis.grievance?.subcategory || 'Disputed Ledger Debit',
        severity: analysis.grievance?.severity || 'MEDIUM',
        description,
        amount: Number(amount) || analysis.grievance?.financial_impact || 0,
        evidence: evidence || analysis.grievance?.verified_evidence || [],
        analysis: analysis.grievance || {},
        draftText: draft.draft_text || '',
        qualityScore,
        status: 'Submitted',
        daysRemaining: 21,
        escalationEligible: false,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      });

      // Initial StatusEvent
      await StatusEvent.create({
        complaintId,
        stage: 'Submitted',
        note: `Grievance submitted regarding disputed amount of ₹${amount || 0}. 21-day statutory clock initiated.`
      });
    } catch (e) {
      // Memory fallback
      complaintDoc = {
        _id: `c_${Date.now()}`,
        complaintId,
        userId: req.user?._id,
        entity,
        category: category || 'Unauthorized charges',
        subcategory: 'Disputed Ledger Debit',
        severity: 'MEDIUM',
        description,
        amount: Number(amount) || 0,
        evidence: evidence || [],
        analysis: analysis.grievance || {},
        draftText: draft.draft_text || '',
        qualityScore,
        status: 'Submitted',
        daysRemaining: 21,
        escalationEligible: false,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      };
      memoryComplaints.unshift(complaintDoc);
      memoryStatusEvents.push({
        complaintId,
        stage: 'Submitted',
        timestamp: new Date(),
        note: `Grievance submitted regarding disputed amount of ₹${amount || 0}. 21-day statutory clock initiated.`
      });
    }

    res.status(201).json({
      message: 'Complaint created successfully.',
      complaint: complaintDoc,
      analysis: analysis.grievance,
      draft: draft
    });
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    let complaints = [];
    try {
      complaints = await Complaint.find().sort({ createdAt: -1 });
    } catch (e) {
      complaints = memoryComplaints;
    }

    if (!complaints || complaints.length === 0) {
      complaints = memoryComplaints;
    }

    res.json({
      count: complaints.length,
      complaints
    });
  } catch (error) {
    next(error);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let complaint = null;
    let events = [];

    try {
      complaint = await Complaint.findOne({ $or: [{ _id: id }, { complaintId: id }] });
      if (complaint) {
        events = await StatusEvent.find({ complaintId: complaint.complaintId }).sort({ timestamp: 1 });
      }
    } catch (e) {
      // Memory fallback
    }

    if (!complaint) {
      complaint = memoryComplaints.find(c => c._id === id || c.complaintId === id);
      if (complaint) {
        events = memoryStatusEvents.filter(e => e.complaintId === complaint.complaintId);
      }
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.json({
      complaint,
      events
    });
  } catch (error) {
    next(error);
  }
};

exports.analyzeComplaint = async (req, res, next) => {
  try {
    const result = await AIClient.analyzeGrievance(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.draftComplaint = async (req, res, next) => {
  try {
    const result = await AIClient.draftComplaint(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.qualityCheck = async (req, res, next) => {
  try {
    const result = await AIClient.checkComplaintQuality(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage, note } = req.body;

    if (!stage) {
      return res.status(400).json({ message: 'Stage is required.' });
    }

    let complaint = null;
    try {
      complaint = await Complaint.findOne({ $or: [{ _id: id }, { complaintId: id }] });
      if (complaint) {
        complaint.status = stage;
        if (stage === 'Resolved') {
          complaint.daysRemaining = 0;
        } else if (stage === 'Escalated') {
          complaint.escalationEligible = true;
        }
        await complaint.save();

        await StatusEvent.create({
          complaintId: complaint.complaintId,
          stage,
          note: note || `Stage updated to ${stage}`
        });
      }
    } catch (e) {
      // Memory fallback
    }

    if (!complaint) {
      const idx = memoryComplaints.findIndex(c => c._id === id || c.complaintId === id);
      if (idx !== -1) {
        memoryComplaints[idx].status = stage;
        complaint = memoryComplaints[idx];
        memoryStatusEvents.push({
          complaintId: complaint.complaintId,
          stage,
          timestamp: new Date(),
          note: note || `Stage updated to ${stage}`
        });
      }
    }

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.json({
      message: 'Status updated successfully.',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

exports.downloadPDF = async (req, res, next) => {
  try {
    const { id } = req.params;
    let complaint = null;

    try {
      complaint = await Complaint.findOne({ $or: [{ _id: id }, { complaintId: id }] });
    } catch (e) {}

    if (!complaint) {
      complaint = memoryComplaints.find(c => c._id === id || c.complaintId === id);
    }

    if (!complaint) {
      complaint = memoryComplaints[0];
    }

    const pdfBuffer = await PDFService.generateComplaintPDF(complaint);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=NiveshRakshak_${complaint.complaintId || 'Grievance'}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
