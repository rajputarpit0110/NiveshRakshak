const fs = require('fs');
const Document = require('../models/Document');
const AIClient = require('../services/aiClient');

let memoryDocuments = [
  {
    _id: 'doc_demo_01',
    userId: '660000000000000000000001',
    fileName: 'Zerodha_Ledger_Statement_Mar2024.pdf',
    extractedText: 'CLIENT LEDGER STATEMENT - ZERODHA BROKING LTD\nAccount UCC: 128945 | Date: 15-Mar-2024\nEntries:\n01-Mar-2024: Buy INFY 100 Shares - Debit: ₹1,55,000.00\n02-Mar-2024: Brokerage & STT - Debit: ₹142.50\n14-Mar-2024: Sundry Admin Maintenance Fee - Debit: ₹2,500.00\nClosing Balance: ₹14,250.00 Cr',
    documentType: 'Financial Statement / Ledger',
    extractedEntities: ['Zerodha Broking Limited', 'SEBI'],
    detectedCharges: [
      {
        amount: 2500,
        formatted: '₹2,500.00',
        raw_context: 'Sundry Admin Maintenance Fee - Debit: ₹2,500.00',
        type: 'Disputed Administrative Fee / Ledger Debit'
      }
    ],
    findings: [
      {
        issue_id: 'iss_2500',
        title: 'Potential issue detected: Unexplained Ledger Debit (₹2,500.00)',
        severity: 'HIGH',
        description: 'Entry reflects an unexplained debit of ₹2,500.00 without itemized statutory invoice breakdown.',
        relevant_rule: 'SEBI Circular on Transparency of Brokerage & Ledger Debits (SEBI/HO/MRD/DP/CIR/P/2023/182)',
        investor_right: 'Right to itemized explanation of all charges within 3 working days.',
        recommended_action: 'Request formal itemized calculation and invoice from broker compliance department.'
      }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
];

exports.analyzeDocument = async (req, res, next) => {
  try {
    let text = req.body.text || '';
    let fileName = 'statement.pdf';

    if (req.file) {
      fileName = req.file.originalname;
      const buffer = fs.readFileSync(req.file.path);
      text = buffer.toString('utf-8', 0, Math.min(buffer.length, 10000));
      // Delete temporary uploaded file to respect privacy
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }

    if (!text || text.trim().length === 0) {
      text = 'CLIENT LEDGER STATEMENT - ZERODHA BROKING LTD\nAccount UCC: 128945 | Date: 15-Mar-2024\n14-Mar-2024: Sundry Admin Maintenance Fee - Debit: ₹2,500.00';
    }

    const aiResult = await AIClient.analyzeDocument({ text });
    const analysis = aiResult.analysis || {};

    let docRecord;
    try {
      docRecord = await Document.create({
        userId: req.user?._id,
        fileName,
        extractedText: text.slice(0, 500),
        documentType: analysis.document_type || 'Financial Statement',
        extractedEntities: analysis.extracted_entities || [],
        detectedCharges: analysis.detected_charges || [],
        findings: analysis.findings || []
      });
    } catch (e) {
      docRecord = {
        _id: `doc_${Date.now()}`,
        userId: req.user?._id,
        fileName,
        extractedText: text.slice(0, 500),
        documentType: analysis.document_type || 'Financial Statement',
        extractedEntities: analysis.extracted_entities || [],
        detectedCharges: analysis.detected_charges || [],
        findings: analysis.findings || [],
        createdAt: new Date()
      };
      memoryDocuments.unshift(docRecord);
    }

    res.json({
      status: 'success',
      documentId: docRecord._id,
      fileName,
      extractedTextPreview: text.slice(0, 300) + '...',
      analysis
    });
  } catch (error) {
    next(error);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    let docs = [];
    try {
      docs = await Document.find().sort({ createdAt: -1 });
    } catch (e) {
      docs = memoryDocuments;
    }
    if (!docs || docs.length === 0) {
      docs = memoryDocuments;
    }
    res.json({ count: docs.length, documents: docs });
  } catch (error) {
    next(error);
  }
};

exports.getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    try {
      doc = await Document.findById(id);
    } catch (e) {}

    if (!doc) {
      doc = memoryDocuments.find(d => d._id === id);
    }

    if (!doc) {
      return res.status(404).json({ message: 'Document analysis not found.' });
    }

    res.json(doc);
  } catch (error) {
    next(error);
  }
};
