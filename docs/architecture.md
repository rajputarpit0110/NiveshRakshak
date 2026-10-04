# NiveshRakshak Architecture Documentation

## 1. System Philosophy: "From Confusion to Complaint to Resolution"

NiveshRakshak is designed not as a generic chat interface, but as a specialized investor protection operating system. It bridges the gap between retail investor grievances and Indian statutory regulatory bodies (SEBI, NSE, BSE, AMFI, RBI).

```
CONFUSION  →  UNDERSTANDING  →  RISK DETECTION  →  EVIDENCE  →  GRIEVANCE  →  COMPLAINT  →  ESCALATION  →  RESOLUTION
```

---

## 2. Multi-Tier Microservice Topology

The platform comprises three decoupled tiers:

1. **Frontend Tier (React + Vite + TypeScript + Tailwind CSS)**:
   - High-trust, financial security visual language.
   - Interactive components: CommandCenter, RightsChat with `<SourceCitation />`, GrievanceStudio, GrievanceTracker, DocumentStudio, ScamRadar, SafetyAcademy, RightsLibrary, KnowledgeHealth.
   - 1-Click Investor Demo Mode.

2. **Backend API Gateway Tier (Node.js + Express + Mongoose + JWT + Helmet)**:
   - Port `5001`.
   - Manages user sessions, complaint life cycles, document audits, and PDF report generation.
   - Forwards AI requests to Python microservice with resilient in-memory fallback.

3. **AI & Grounded RAG Tier (Python FastAPI + Hybrid Retriever + Reranker + Multi-Agent Orchestrator)**:
   - Port `8000`.
   - Hybrid retrieval (Semantic Vector Search + BM25 Lexical + Reciprocal Rank Fusion).
   - Smart chunking respecting regulatory hierarchies (Act → Circular → Section → Clause).
   - Strict anti-hallucination guardrail enforcing explicit insufficient evidence fallback.

4. **Statutory Knowledge Repository (`/data/rag_data/`)**:
   - Official regulatory publications across SEBI, NSE, BSE, AMFI, and RBI.
