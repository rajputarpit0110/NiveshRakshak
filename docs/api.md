# NiveshRakshak API Specification

## Authentication
- `POST /api/auth/register` — Register a retail investor account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve authenticated user profile

## RAG & Regulatory Intelligence
- `POST /api/ask` — Query grounded RAG with question and optional authority filter
- `GET /api/rag/health` — Retrieve knowledge base metrics and chunk counts
- `POST /api/rag/ingest` — Ingest new documents from `data/rag_data/`
- `POST /api/rag/reindex` — Purge and rebuild vector embeddings
- `POST /api/rag/evaluate` — Run benchmark test suite (TC01-TC07)

## Grievances & Complaints
- `POST /api/complaints` — Save complaint and initiate 21-day timeline
- `GET /api/complaints` — Retrieve investor's active grievances
- `GET /api/complaints/:id` — Get single grievance with full audit trail
- `POST /api/complaints/:id/analyze` — Run grievance intelligence
- `POST /api/complaints/:id/draft` — Generate formal legal draft
- `POST /api/complaints/:id/quality-check` — Score draft on 0-100 rubric
- `POST /api/complaints/:id/status` — Advance lifecycle stage
- `GET /api/complaints/:id/pdf` — Download clean official PDF notice

## Risk Detection & Prevention
- `POST /api/scam-check` — Analyze text against 12+ scam signals
- `POST /api/documents/analyze` — Audit financial statement / ledger
- `GET /api/documents` — List audited statements

## Academy & Dynamic Guidance
- `GET /api/rights` — Searchable statutory rights catalog
- `GET /api/quiz` — Scenario-based adaptive dilemma questions
- `POST /api/quiz/submit` — Submit answers and update safety score
- `GET /api/safety-score` — Retrieve 6-dimensional score and loop history
- `GET /api/recommendations` — Compute dynamic Next Best Action
