"""
NiveshRakshak AI & RAG Microservice.
Provides FastAPI endpoints for Grounded RAG Retrieval, Multi-Agent Orchestration,
Document Intelligence, Scam Risk Detection, Complaint Drafting, and Knowledge Base Management.
"""
import os
import sys
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure path is set
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from rag.pipeline import RAGPipeline
from rag.ingest import IngestionManager
from rag.evaluator import RAGEvaluator
from agents.orchestrator import AgentOrchestrator

app = FastAPI(
    title="NiveshRakshak AI Service",
    description="Statutory Grounded RAG & Multi-Agent Investor Protection Service",
    version="2.0.0"
)

# Enable CORS for Frontend and Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from rag.vector_store import VectorStore

# Initialize core services
storage_dir = os.path.join(current_dir, "rag_storage")
data_dir = os.path.join(os.path.dirname(current_dir), "data", "rag_data")

vector_store = VectorStore(storage_dir=storage_dir)
rag_pipeline = RAGPipeline(vector_store=vector_store)
orchestrator = AgentOrchestrator(rag_pipeline=rag_pipeline)
ingestion_mgr = IngestionManager(data_dir=data_dir, storage_dir=storage_dir)

# ================= Request / Response Schemas =================
class AskRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None

class ScamCheckRequest(BaseModel):
    text: str

class GrievanceAnalyzeRequest(BaseModel):
    description: str
    entity: Optional[str] = None
    date: Optional[str] = None
    amount: Optional[float] = None
    attachedEvidence: Optional[List[str]] = None

class ComplaintDraftRequest(BaseModel):
    entity: str
    category: Optional[str] = "Unauthorized charges"
    amount: Optional[float] = 2500.0
    date: Optional[str] = None
    description: str
    clientId: Optional[str] = "UCC-CLIENT"
    evidence: Optional[List[str]] = None
    requestedResolution: Optional[str] = None
    investorProfile: Optional[Dict[str, Any]] = None

class QualityCheckRequest(BaseModel):
    entity: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[str] = None
    clientId: Optional[str] = None
    evidence: Optional[List[str]] = None
    requestedResolution: Optional[str] = None
    priorCommunication: Optional[str] = None

class QuizSubmissionRequest(BaseModel):
    answers: Dict[str, int]

class RecommendationRequest(BaseModel):
    active_complaints: Optional[List[Dict[str, Any]]] = []
    latest_safety_score: Optional[int] = 72
    weak_areas: Optional[List[str]] = []
    documents_analyzed: Optional[int] = 0

# ================= Endpoints =================

@app.get("/health")
def health_check():
    stats = rag_pipeline.vector_store.get_stats()
    return {
        "status": "healthy",
        "service": "NiveshRakshak-AI-Service",
        "version": "2.0.0",
        "knowledge_base": stats
    }

@app.post("/api/ask")
def ask_rag(request: AskRequest):
    """Grounded RAG retrieval and answer synthesis with source citations."""
    resp = rag_pipeline.query(request.query, filters=request.filters)
    return resp.model_dump()

@app.post("/api/orchestrate")
def orchestrate_query(payload: Dict[str, Any]):
    """Classifies user intent and routes to corresponding specialist agent."""
    intent = payload.get("intent")
    return orchestrator.handle_request(intent=intent, payload=payload)

@app.post("/api/scam-check")
def check_scam_signals(request: ScamCheckRequest):
    """Analyze text for investment risk & scam signals."""
    return orchestrator.scam_agent.analyze_text(request.text)

@app.post("/api/complaints/draft")
def draft_complaint(request: ComplaintDraftRequest):
    """Draft a formal legal grievance complaint and evaluate quality score."""
    return orchestrator.complaint_agent.generate_draft(
        request.model_dump(),
        investor_profile=request.investorProfile
    )

@app.post("/api/complaints/quality-check")
def check_complaint_quality(request: QualityCheckRequest):
    """Calculate 0-100 Complaint Quality Score across statutory rubrics."""
    return orchestrator.complaint_agent.evaluate_quality(request.model_dump())

@app.post("/api/grievance/analyze")
def analyze_grievance_case(request: GrievanceAnalyzeRequest):
    """Analyze grievance severity, financial impact, and evidence completeness."""
    grievance = orchestrator.grievance_agent.analyze_grievance(request.model_dump())
    # Retrieve regulatory citations
    rag_info = rag_pipeline.query(f"{grievance['category']} {grievance['financial_impact']}")
    return {
        "grievance": grievance,
        "regulatory_context": rag_info.model_dump()
    }

@app.post("/api/documents/analyze")
async def analyze_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    """Analyze uploaded statement/contract or raw extracted text."""
    extracted_text = ""
    file_name = "document.pdf"

    if file:
        file_name = file.filename
        content_bytes = await file.read()
        ext = os.path.splitext(file_name)[1].lower()
        
        if ext == ".pdf":
            try:
                import io
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(content_bytes))
                pages_text = [p.extract_text() or "" for p in reader.pages]
                extracted_text = "\n".join(pages_text)
            except Exception as e:
                extracted_text = f"Error extracting PDF: {str(e)}"
        else:
            extracted_text = content_bytes.decode("utf-8", errors="replace")

    if not extracted_text and text:
        extracted_text = text

    if not extracted_text:
        # Default realistic demo statement if empty
        extracted_text = """
        CLIENT LEDGER STATEMENT - ZERODHA BROKING LTD
        Account UCC: 128945 | Date: 15-Mar-2024
        Entries:
        01-Mar-2024: Buy INFY 100 Shares - Debit: ₹1,55,000.00
        02-Mar-2024: Brokerage & STT - Debit: ₹142.50
        14-Mar-2024: Sundry Admin Maintenance Fee - Debit: ₹2,500.00
        Closing Balance: ₹14,250.00 Cr
        """
        file_name = "broker_ledger_statement.pdf"

    analysis = orchestrator.document_agent.analyze_document_content(extracted_text, file_name=file_name)
    return {
        "status": "success",
        "file_name": file_name,
        "extracted_text_preview": extracted_text[:400] + "...",
        "analysis": analysis
    }

@app.get("/api/rights")
def get_rights(category: Optional[str] = Query(None)):
    """Searchable catalog of statutory investor rights."""
    return orchestrator.rights_agent.get_all_rights(category=category)

@app.get("/api/rights/{right_id}")
def get_single_right(right_id: str):
    right = orchestrator.rights_agent.get_right_by_id(right_id)
    if not right:
        raise HTTPException(status_code=404, detail="Right not found")
    return right

@app.get("/api/quiz")
def get_quiz(difficulty: Optional[str] = Query(None), count: int = Query(4)):
    """Retrieve adaptive scenario-based quiz questions."""
    return orchestrator.learning_agent.get_quiz_questions(count=count, difficulty=difficulty)

@app.post("/api/quiz/submit")
def submit_quiz(request: QuizSubmissionRequest):
    """Evaluate quiz answers and return updated safety scores and learning path."""
    return orchestrator.learning_agent.evaluate_quiz_submission(request.answers)

@app.get("/api/modules")
def get_learning_modules():
    return orchestrator.learning_agent.get_modules()

@app.post("/api/recommendations")
def get_recommendations(request: RecommendationRequest):
    """Derive dynamic Next Best Action based on active complaints and safety score."""
    return orchestrator.recommendation_agent.generate_recommendations(request.model_dump())

@app.post("/api/rag/ingest")
def trigger_rag_ingest():
    """Trigger ingestion of regulatory documents in data/rag_data/."""
    result = ingestion_mgr.run_ingestion(force_reindex=False)
    rag_pipeline.retriever.refresh()
    return result

@app.post("/api/rag/reindex")
def trigger_rag_reindex():
    """Purge and rebuild all vector embeddings."""
    result = ingestion_mgr.run_ingestion(force_reindex=True)
    rag_pipeline.retriever.refresh()
    return result

@app.get("/api/rag/health")
def rag_health():
    """Return knowledge base status and chunk metrics."""
    stats = rag_pipeline.vector_store.get_stats()
    manifest = ingestion_mgr._load_manifest()
    
    # Read evaluation report if present
    eval_report = None
    report_path = os.path.join(storage_dir, "evaluation_report.json")
    if os.path.exists(report_path):
        try:
            import json
            with open(report_path, "r", encoding="utf-8") as f:
                eval_report = json.load(f)
        except Exception:
            pass

    return {
        "status": "online",
        "stats": stats,
        "last_ingestion": manifest.get("last_ingestion"),
        "indexed_documents_count": len(manifest.get("documents", {})),
        "evaluation_summary": eval_report
    }

@app.post("/api/rag/evaluate")
def run_rag_eval():
    """Run RAG evaluation benchmark."""
    evaluator = RAGEvaluator(storage_dir=storage_dir)
    return evaluator.run_evaluation()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("AI_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
