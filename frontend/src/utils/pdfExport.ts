import jsPDF from 'jspdf';
import { api } from '../services/api';

export interface PDFExportOptions {
  complaintId?: string;
  entity?: string;
  category?: string;
  amount?: number | string;
  draftText: string;
  date?: string;
}

/**
 * Client-side PDF generation using jsPDF
 * Guarantees instantaneous, 100% reliable PDF download in any browser/environment
 */
export function generateClientPDF(options: PDFExportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // 1. Header Bar (Deep Slate #0f172a)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 24, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NIVESHRAKSHAK', margin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('AI-Powered Investor Rights & Statutory Grievance Assistant', margin, 17);

  // Ref ID Badge
  const refId = options.complaintId || 'INV-10234';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text(`REF: ${refId}`, pageWidth - margin, 14, { align: 'right' });

  // 2. Metadata Box
  let currentY = 30;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  const col1 = margin + 4;
  const col2 = margin + (contentWidth / 2);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Target Intermediary: ', col1, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(options.entity || 'Registered Broker / Intermediary', col1 + 32, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Filing Date: ', col1, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(options.date || new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }), col1 + 32, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Grievance Category: ', col2, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(options.category || 'Unauthorized charges', col2 + 32, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Disputed Amount: ', col2, currentY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`₹${Number(options.amount || 2500).toLocaleString('en-IN')}`, col2 + 32, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.text('Statutory Target TAT: 21 Calendar Days (SEBI Master Circular 2024)', col1, currentY + 19);

  // 3. Subject Line
  currentY += 31;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SUBJECT: Formal Dispute Notice & Statutory Grievance Redressal Request', margin, currentY);

  // 4. Draft Text Body
  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const cleanDraftText = options.draftText || 'No grievance text specified.';
  const splitText = doc.splitTextToSize(cleanDraftText, contentWidth);
  
  const lineHeight = 4.2;
  for (let i = 0; i < splitText.length; i++) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }
    doc.text(splitText[i], margin, currentY);
    currentY += lineHeight;
  }

  // 5. Statutory Regulatory Notice Box
  currentY += 4;
  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // green-800
  doc.text('STATUTORY REGULATORY NOTICE (SEBI SCORES 2.0 PROTOCOL):', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 83, 45); // green-900
  const noticeLines = doc.splitTextToSize(
    'Under the SEBI Master Circular on Investor Grievance Redressal, the intermediary is mandated to provide an Action Taken Report (ATR) within 21 calendar days. Non-resolution gives the investor statutory right to escalate to SEBI SCORES (scores.sebi.gov.in) and SMART ODR arbitration.',
    contentWidth - 8
  );
  doc.text(noticeLines, margin + 4, currentY + 10);

  // 6. Footer Disclaimer
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Disclaimer: Generated via NiveshRakshak AI Investor Protection Platform. Review all particulars prior to dispatch.',
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Trigger immediate file download
  doc.save(`NiveshRakshak_${refId}.pdf`);
}

/**
 * Downloads complaint PDF with server-first strategy and client-side fallback
 */
export async function downloadComplaintPDF(options: PDFExportOptions): Promise<void> {
  const refId = options.complaintId || 'INV-10234';
  
  try {
    // Try fetching from backend endpoint with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const pdfUrl = api.getComplaintPDFUrl(refId);
    const response = await fetch(pdfUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `NiveshRakshak_${refId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        return;
      }
    }
  } catch (err) {
    // Backend fetch failed or timed out, gracefully continue to client generation
    console.warn('Backend PDF fetch failed or timed out, generating via client jsPDF:', err);
  }

  // Robust Client-side jsPDF fallback
  generateClientPDF(options);
}
