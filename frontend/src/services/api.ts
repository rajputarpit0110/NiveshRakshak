const API_BASE = '/api';

export interface Citation {
  citation_id: string;
  source_name: string;
  source_type: string;
  authority: string;
  document_title: string;
  document_date?: string;
  section?: string;
  subsection?: string;
  page_number: number;
  source_url?: string;
  relevance_score: number;
  excerpt: string;
}

export interface RAGResponse {
  answer: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_score: number;
  grounded: boolean;
  sources: Citation[];
  evidence: string[];
  limitations?: string | null;
  recommended_action?: string | null;
}

export interface GrievanceAnalysis {
  category: string;
  subcategory: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: string;
  financial_impact: number;
  detected_entity: string;
  date: string;
  evidence_completeness_pct: number;
  verified_evidence: string[];
  missing_evidence: string[];
  recommended_action: string;
  next_best_action: string;
  escalation_path: Array<{ step: number; entity: string; timeline: string; status: string }>;
  confidence: string;
}

export interface ComplaintDraft {
  subject: string;
  draft_text: string;
  financial_impact: number;
  quality_evaluation?: {
    quality_score: number;
    rating: string;
    checks_passed: string[];
    improvements_needed: string[];
    is_ready_for_filing: boolean;
    next_best_action: string;
  };
  mandatory_disclaimer: string;
}

export interface ScamSignal {
  id: string;
  name: string;
  matched_phrases: string[];
  explanation: string;
  severity_weight: number;
}

export interface ScamAnalysis {
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  risk_score: number;
  signals_detected_count: number;
  detected_signals: ScamSignal[];
  summary: string;
  recommended_actions: string[];
  safe_harbor_disclaimer: string;
}

export const api = {
  async askRAG(query: string, filters?: any): Promise<RAGResponse> {
    const res = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, filters })
    });
    return res.json();
  },

  async analyzeGrievance(data: any): Promise<{ grievance: GrievanceAnalysis; regulatory_context: RAGResponse }> {
    const res = await fetch(`${API_BASE}/complaints/c_new/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async draftComplaint(data: any): Promise<ComplaintDraft> {
    const res = await fetch(`${API_BASE}/complaints/c_new/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async checkQuality(data: any) {
    const res = await fetch(`${API_BASE}/complaints/c_new/quality-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createComplaint(data: any) {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getComplaints() {
    const res = await fetch(`${API_BASE}/complaints`);
    return res.json();
  },

  async getComplaintById(id: string) {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    return res.json();
  },

  async updateComplaintStatus(id: string, stage: string, note?: string) {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, note })
    });
    return res.json();
  },

  getComplaintPDFUrl(id: string): string {
    return `${API_BASE}/complaints/${id}/pdf`;
  },

  async checkScam(text: string): Promise<ScamAnalysis> {
    const res = await fetch(`${API_BASE}/scam-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  async analyzeDocument(formData: FormData) {
    const res = await fetch(`${API_BASE}/documents/analyze`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    return res.json();
  },

  async getRights(category?: string) {
    const url = category ? `${API_BASE}/rights?category=${encodeURIComponent(category)}` : `${API_BASE}/rights`;
    const res = await fetch(url);
    return res.json();
  },

  async getQuiz(difficulty?: string) {
    const url = difficulty ? `${API_BASE}/quiz?difficulty=${difficulty}` : `${API_BASE}/quiz`;
    const res = await fetch(url);
    return res.json();
  },

  async submitQuiz(answers: Record<string, number>) {
    const res = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return res.json();
  },

  async getSafetyScore() {
    const res = await fetch(`${API_BASE}/safety-score`);
    return res.json();
  },

  async getRecommendations() {
    const res = await fetch(`${API_BASE}/recommendations`);
    return res.json();
  },

  async getRAGHealth() {
    const res = await fetch(`${API_BASE}/rag/health`);
    return res.json();
  },

  async triggerIngest() {
    const res = await fetch(`${API_BASE}/rag/ingest`, { method: 'POST' });
    return res.json();
  },

  async triggerReindex() {
    const res = await fetch(`${API_BASE}/rag/reindex`, { method: 'POST' });
    return res.json();
  },

  async triggerEvaluate() {
    const res = await fetch(`${API_BASE}/rag/evaluate`, { method: 'POST' });
    return res.json();
  }
};
