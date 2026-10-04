"""
Metadata specifications and schemas for RAG knowledge chunks and query responses.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class ChunkMetadata(BaseModel):
    chunk_id: str
    source_name: str
    source_type: str = "regulatory_document"  # master_circular, charter, circular, faq, sop, code_of_conduct
    authority: str = "SEBI"                   # SEBI, NSE, BSE, AMFI, RBI, etc.
    document_title: str
    document_date: Optional[str] = None
    effective_date: Optional[str] = None
    section: Optional[str] = None
    subsection: Optional[str] = None
    page_number: int = 1
    source_url: Optional[str] = None
    jurisdiction: str = "India"
    topic: str = "investor_rights"
    hash: str
    ingestion_timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Chunk(BaseModel):
    id: str
    text: str
    metadata: ChunkMetadata

class Citation(BaseModel):
    citation_id: str
    source_name: str
    source_type: str
    authority: str
    document_title: str
    document_date: Optional[str] = None
    section: Optional[str] = None
    subsection: Optional[str] = None
    page_number: int = 1
    source_url: Optional[str] = None
    relevance_score: float
    excerpt: str

class RAGResponse(BaseModel):
    answer: str
    confidence: str  # HIGH, MEDIUM, LOW
    confidence_score: float
    grounded: bool
    sources: List[Citation] = []
    evidence: List[str] = []
    limitations: Optional[str] = None
    recommended_action: Optional[str] = None
    query_intent: Optional[str] = None
