const PDFDocument = require('pdfkit');

class PDFService {
  static generateComplaintPDF(complaintData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        const primaryColor = '#0f172a'; // Deep Navy Slate
        const accentColor = '#059669';  // Emerald Green
        const mutedColor = '#64748b';   // Slate Muted

        // Header / Branding Bar
        doc.rect(0, 0, doc.page.width, 70).fill(primaryColor);
        doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
           .text('NIVESHRAKSHAK', 40, 20);
        doc.fillColor('#94a3b8').fontSize(9).font('Helvetica')
           .text('AI-Powered Investor Rights & Statutory Grievance Assistant', 40, 42);

        doc.fillColor('#10b981').fontSize(10).font('Helvetica-Bold')
           .text(`COMPLAINT REF: ${complaintData.complaintId || 'INV-10234'}`, doc.page.width - 240, 28, { align: 'right', width: 200 });

        doc.moveDown(4);
        doc.fillColor(primaryColor);

        // Document Meta Information
        const startY = 90;
        doc.fontSize(10).font('Helvetica-Bold').text('Date Generated: ', 40, startY);
        doc.font('Helvetica').text(new Date(complaintData.createdAt || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'long' }), 130, startY);

        doc.font('Helvetica-Bold').text('Target Entity: ', 40, startY + 16);
        doc.font('Helvetica').text(complaintData.entity || 'Registered Intermediary', 130, startY + 16);

        doc.font('Helvetica-Bold').text('Grievance Category: ', 300, startY);
        doc.font('Helvetica').text(complaintData.category || 'Unauthorized charges', 420, startY);

        doc.font('Helvetica-Bold').text('Disputed Quantum: ', 300, startY + 16);
        doc.fillColor(accentColor).font('Helvetica-Bold').text(`₹${(complaintData.amount || 0).toLocaleString('en-IN')}`, 420, startY + 16);

        doc.fillColor(primaryColor);

        // Horizontal Line
        doc.moveTo(40, startY + 40).lineTo(doc.page.width - 40, startY + 40).strokeColor('#cbd5e1').stroke();

        // Formal Complaint Subject
        doc.fontSize(12).font('Helvetica-Bold')
           .text(`SUBJECT: Formal Dispute Notice regarding Disputed Ledger Entry / Unauthorized Charges`, 40, startY + 55, { width: doc.page.width - 80 });

        // Body Content / Draft Text
        doc.fontSize(10).font('Helvetica').lineGap(4);
        const draftContent = complaintData.draftText || complaintData.description || 'Details of the grievance entered by investor.';
        doc.text(draftContent, 40, startY + 85, {
          width: doc.page.width - 80,
          align: 'justify'
        });

        doc.moveDown(2);

        // Supporting Evidence & Attachments Box
        const currentY = doc.y;
        if (currentY < doc.page.height - 180) {
          doc.rect(40, currentY, doc.page.width - 80, 80).fillAndStroke('#f8fafc', '#e2e8f0');
          doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
             .text('VERIFIED EVIDENCE & ATTACHMENTS ATTACHED:', 50, currentY + 10);

          const evidenceList = Array.isArray(complaintData.evidence) && complaintData.evidence.length > 0
            ? complaintData.evidence.map(e => typeof e === 'string' ? e : e.name || JSON.stringify(e))
            : ['Trading Account Financial Ledger Extract', 'Relevant Electronic Contract Notes', 'Schedule of Charges / Tariff Sheet'];

          doc.fillColor('#334155').fontSize(9).font('Helvetica');
          let evY = currentY + 28;
          evidenceList.slice(0, 3).forEach((item, idx) => {
            doc.text(`[✓] Evidence Item ${idx + 1}: ${item}`, 50, evY);
            evY += 15;
          });
        }

        // Statutory Regulatory Timelines Notice
        const noticeY = doc.page.height - 100;
        doc.rect(40, noticeY, doc.page.width - 80, 50).fillAndStroke('#f0fdf4', '#bbf7d0');
        doc.fillColor('#166534').fontSize(8.5).font('Helvetica-Bold')
           .text('STATUTORY REGULATORY NOTICE (SEBI SCORES 2.0 PROTOCOL):', 50, noticeY + 8);
        doc.fillColor('#14532d').fontSize(8).font('Helvetica')
           .text('Under the SEBI Master Circular on Investor Grievance Redressal, the intermediary is mandated to provide an Action Taken Report (ATR) within 21 calendar days. Non-resolution gives the investor statutory right to escalate to SEBI SCORES (scores.sebi.gov.in) and SMART ODR arbitration.', 50, noticeY + 22, { width: doc.page.width - 100 });

        // Footer & Disclaimer
        doc.fillColor(mutedColor).fontSize(7.5).font('Helvetica')
           .text('DISCLAIMER: AI-generated grievance draft for investor empowerment. Review all factual particulars before physical or electronic dispatch. This document does not constitute formal legal counsel.', 40, doc.page.height - 35, { align: 'center', width: doc.page.width - 80 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = PDFService;
