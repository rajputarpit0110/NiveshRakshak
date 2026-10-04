# 🛡️ NiveshRakshak (निवेश रक्षक) — AI Investor Protection System

<div align="center">

[![Live Web App](https://img.shields.io/badge/Live%20App-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://nivesh-rakshak-chi.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://niveshrakshak-fgiv.onrender.com/health)
[![RAG Telemetry](https://img.shields.io/badge/RAG%20Status-354%20Chunks%20%7C%20100%25%20Eval-059669?style=for-the-badge&logo=fastapi&logoColor=white)](https://niveshrakshak-fgiv.onrender.com/api/rag/health)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

### **Statutory AI Operating System for Investor Rights, Scam Detection & Dispute Resolution**
*Grounded exclusively in verified circulars from **SEBI, NSE, BSE, AMFI, and RBI**.*

[🌐 **Launch Live Platform**](https://nivesh-rakshak-chi.vercel.app/) • [📡 **API Health**](https://niveshrakshak-fgiv.onrender.com/health) • [📖 **System Architecture**](./NIVESHRAKSHAK_SYSTEM_FLOW_AND_TESTING_GUIDE.txt) • [🚀 **Deployment Guide**](./DEPLOYMENT_GUIDE.md)

</div>

---

## 🔗 Live Deployments

| Component | Platform | Live Production URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | **Vercel** | [https://nivesh-rakshak-chi.vercel.app/](https://nivesh-rakshak-chi.vercel.app/) | 🟢 **Live & Global CDN** |
| **Backend API Gateway** | **Render** | [https://niveshrakshak-fgiv.onrender.com/](https://niveshrakshak-fgiv.onrender.com/) | 🟢 **Online & Operational** |
| **AI / RAG Microservice** | **Render** | [https://niveshrakshak-fgiv.onrender.com/api/rag/health](https://niveshrakshak-fgiv.onrender.com/api/rag/health) | 🟢 **354 Chunks Active** |
| **Source Code** | **GitHub** | [rajputarpit0110/NiveshRakshak](https://github.com/rajputarpit0110/NiveshRakshak) | 🟢 **Main Branch Sync** |

---

## 📌 Executive Summary & Mission

Retail participation in Indian capital markets has exploded to over 16+ crore demat accounts, yet retail investors face recurring systemic challenges:
1. **Unexplained Ledger Debits & Fees:** Undisclosed administrative, sundry, or DP charges deducted without explicit contract note backing.
2. **Proliferation of Investment Scams:** Fraudulent WhatsApp/Telegram stock tips, fake SEBI-registered portfolio managers, and unauthorized screen-sharing software (AnyDesk).
3. **Complex Regulatory Language:** Obscure Master Circulars and legal jargon that prevent retail investors from knowing their rights.
4. **Opaque Escalation Procedures:** Confusion regarding when to contact the Broker, when to escalate to **SCORES 2.0**, and when to initiate **SMART ODR** conciliation/arbitration.

**NiveshRakshak** transforms the investor experience from passive confusion to proactive statutory resolution. It is built as a complete investor protection operating system with 100% grounded RAG, automated evidence audit, formal legal complaint generation with official PDF export, and adaptive financial safety education.

---

## 🌟 The 8-Stage Investor Protection Journey

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 01 CONFUSION │ ──> │ 02 GROUNDING │ ──> │ 03 RISK RADAR│ ──> │ 04 EVIDENCE  │
│ User query   │     │ Verified RAG │     │ Scam signals │     │ Doc audit    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                                                              │
       ▼                                                              ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 08 RESOLUTION│ <── │07 ESCALATION │ <── │ 06 TRACKING  │ <── │ 05 COMPLAINT │
│ Close loop   │     │ SCORES / ODR │     │ 21-day clock │     │ Draft & PDF  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

---

## 🎯 Core Modules & Capabilities

### 1. 💬 Statutory Rights Assistant (RAG Engine)
- Provides **100% grounded answers** directly citing regulatory documents.
- Every claim returns an exact citation with `authority`, `document_title`, `section`, and `page_number`.
- Strict anti-hallucination boundary: If a query is outside official statutory bounds or speculative, the engine transparently refuses to fabricate answers.

### 2. ⚖️ Grievance Studio & Complaint Generator
- Formulates formal legal notices with structured investor details, disputed amounts, and factual timelines.
- Injects verified legal clauses from SEBI Master Circulars (e.g. Circular `SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2023/71`).
- Evaluates complaints against an **objective 0–100 Quality Rubric** (Fact specificity, Legal grounding, Evidence completeness, Relief clarity).
- **1-Click Official PDF Export** formatted for submission to Broker Compliance or SEBI SCORES 2.0.

### 3. 📄 Document Intelligence Studio
- Automated audit of financial ledgers, contract notes, and broker tariff sheets.
- Isolates unexplained deductions (e.g., ₹2,500 "Sundry Admin Fee") and cross-references them against mandatory disclosure rules.
- Computes an **Evidence Completeness Score** with a missing documents checklist.

### 4. 🛡️ Investment Scam Radar
- Multi-vector scanner analyzing promotional messages, trading tip chats, and investment pitches.
- Detects **12+ behavioral fraud indicators**:
  - Guaranteed abnormal returns (e.g. "30% monthly profit")
  - Unregistered advisory and Telegram/WhatsApp group pumping
  - Third-party mule bank accounts
  - Pressure tactics / FOMO deadlines
  - Remote desktop software requests (AnyDesk, TeamViewer)
- Provides direct links to the official SEBI Intermediary Verification Directory.

### 5. ⏱️ 21-Day Lifecycle Grievance Tracker
- Tracks statutory Turnaround Time (TAT) under **SEBI SCORES 2.0 Master Circular 2024**.
- Tier 1: 21 calendar days for Intermediary Action Taken Report (ATR).
- Automated unlock of Tier 2: Escalation to SEBI SCORES 2.0 and SMART ODR Conciliation.

### 6. 🎓 Investor Safety Academy & Resilience Score
- **Dynamic Investor Safety Score (0–100)** calculated across 6 dimensions:
  1. Regulatory Rights Knowledge
  2. Scam Pattern Recognition
  3. Evidence Audit Proficiency
  4. Contract Note Literacy
  5. Grievance Escalation Preparedness
  6. Cybersecurity & Account Hygiene
- Interactive scenario-based quizzes that update the safety score in real-time.

### 7. 🗄️ Statutory Knowledge Health Telemetry
- Real-time admin monitoring of the ingested vector store (354 active chunks across 21 official regulatory documents).
- Benchmark evaluator running 7 statutory evaluation tests with 100% accuracy.

---

## 🏛️ System Architecture

```
                                  [ USER BROWSER ]
                                         │
                         HTTPS Requests / SPA Navigation
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │         VERCEL GLOBAL EDGE CDN        │
                     │  React 18 + Vite + Tailwind CSS +     │
                     │  Framer Motion + Recharts + TanStack  │
                     │  https://nivesh-rakshak-chi.vercel.app│
                     └───────────────────────────────────────┘
                                         │
                                REST API (/api/*)
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          RENDER CLOUD SERVICE         │
                     │       Node.js Express API Gateway     │
                     │   Auth • Rate Limiting • PDFKit •     │
                     │   In-Memory / MongoDB Fallback        │
                     │ https://niveshrakshak-fgiv.onrender   │
                     └───────────────────────────────────────┘
                                         │
                           Internal Microservice Call
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │      FASTAPI AI & RAG MICROSERVICE    │
                     │  Hybrid Retriever (Vector + BM25)     │
                     │  Cross-Encoder Domain Reranker        │
                     │  Agent Orchestrator • Evaluator       │
                     └───────────────────────────────────────┘
                                         │
                               Reads Chunk Index
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │     STATUTORY KNOWLEDGE BASE          │
                     │  354 Pre-Indexed Verified Chunks      │
                     │  SEBI • NSE • BSE • RBI • AMFI PDFs   │
                     └───────────────────────────────────────┘
```

---

## 🔬 RAG Retrieval Pipeline Architecture

```
[ User Query ]
     │
     ├─────────────────────────────────┬─────────────────────────────────┐
     ▼                                 ▼                                 ▼
[ Semantic Embedding ]       [ BM25 Keyword Search ]        [ Authority Metadata Filter ]
Dense Vector (256-dim)       Exact Term Frequency           SEBI / NSE / BSE / RBI / AMFI
     │                                 │                                 │
     └─────────────────────────────────┼─────────────────────────────────┘
                                       │
                                       ▼
                       [ Reciprocal Rank Fusion (RRF) ]
                       Score = 1/(60 + Rank_Vector) + 1/(60 + Rank_BM25)
                                       │
                                       ▼
                       [ Domain Authority Reranker ]
                       Authority Weighting + Term Overlap Verification
                                       │
                                       ▼
                       [ Top-K Context Window Assembly ]
                                       │
                                       ▼
                       [ Anti-Hallucination Prompt Boundary ]
                       Strict Grounding Protocol: Cite or Decline Speculation
                                       │
                                       ▼
                       [ Verified Answer + Exact Citations ]
```

---

## 📡 Complete REST API Endpoints

### 1. Authentication & User Profile
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new investor account | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/auth/me` | Retrieve current authenticated user profile | Yes |

### 2. AI Rights & Grounded RAG
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rag/ask` | Query knowledge base; returns answer with citations | No |
| `GET` | `/api/rag/health` | Telemetry on indexed chunks, documents, authorities | No |
| `POST` | `/api/rag/evaluate` | Run 7 statutory benchmark test cases | No |
| `GET` | `/api/rights/summary`| Summary catalog of statutory investor rights | No |

### 3. Grievance Management & Complaints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/complaints` | Fetch active user complaints | Yes/Demo |
| `POST` | `/api/complaints` | Create grievance; triggers AI analysis & quality score | Yes/Demo |
| `GET` | `/api/complaints/:id` | Fetch specific complaint details and timeline | Yes/Demo |
| `GET` | `/api/complaints/:id/pdf`| Download official legal notice formatted PDF | Yes/Demo |
| `POST` | `/api/complaints/:id/escalate` | Escalate from Broker to SEBI SCORES / SMART ODR | Yes/Demo |

### 4. Document Intelligence & Audit
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/documents/upload` | Upload ledger or contract note for audit | No |
| `POST` | `/api/documents/audit` | Dissect line-items, detect hidden charges | No |

### 5. Scam Radar & Entity Verification
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/scam-check/analyze` | Scan text against 12+ fraud signal patterns | No |
| `GET` | `/api/scam-check/signals` | List all tracked fraud indicators & safety tips | No |

### 6. Safety Academy & Investor Score
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/quiz/questions` | Get scenario-based adaptive questions | No |
| `POST` | `/api/quiz/submit` | Submit answers, calculate score across 6 dimensions | No |
| `GET` | `/api/safety-score` | Fetch current investor safety score and breakdown | No |
| `GET` | `/api/recommendations/next-actions` | Dynamic Next Best Action recommendations | No |

---

## 💻 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Recharts**, **TanStack Table**, **Lucide React** |
| **Backend API Gateway** | **Node.js (v20+)**, **Express 4**, **PDFKit**, **Axios**, **Mongoose / In-Memory Fallback**, **Helmet**, **Rate Limiting** |
| **AI / RAG Engine** | **Python 3.11**, **FastAPI**, **Uvicorn**, **NumPy**, **Scikit-learn**, **Rank-BM25**, **PyPDF**, **Pydantic v2** |
| **Design System** | **Shadcn UI Primitives**, Clean Light Fintech Palette (`#059669`, `#10B981`, `#F8FAFC`, `#0F172A`) |
| **DevOps & Cloud** | **Vercel** (Global Static CDN), **Render** (Containerized Web Services), **Docker & Docker Compose** |

---

## 📂 Project Directory Structure

```
NiveshRakshak/
├── data/
│   └── rag_data/                 # 21 Official regulatory circulars & PDFs
│       ├── sebi/                 # SEBI Master Circulars, Charters, SCORES 2.0
│       ├── nse/                  # NSE Dispute Resolution SOPs, Arbitration
│       ├── bse/                  # BSE Investor Protection & Unauthorized Trades
│       ├── amfi/                 # AMFI Code of Conduct, Redemption Timelines
│       ├── rbi/                  # RBI Integrated Ombudsman Scheme 2021
│       └── investor_education/   # Joint Regulatory Scam Advisories & Circulars
├── ai-service/                   # Python FastAPI & Grounded RAG Microservice
│   ├── rag/                      # Parser, Chunker, Embeddings, Retriever, Evaluator
│   ├── rag_storage/              # Pre-indexed 354 chunks & metadata store
│   ├── agents/                   # Multi-agent orchestrator & specialists
│   ├── main.py                   # FastAPI service entry point
│   ├── Dockerfile
│   └── requirements.txt
├── backend/                      # Node.js + Express API Gateway
│   ├── src/
│   │   ├── controllers/          # Complaint, RAG, Scam, Document controllers
│   │   ├── services/             # AI Client (with fallbacks) & PDFKit Generator
│   │   ├── routes/               # Express REST route handlers
│   │   ├── config/db.js          # MongoDB connection with in-memory fallback
│   │   └── server.js             # Express app entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/                     # React + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/           # Dashboard, RightsChat, GrievanceStudio,
│   │   │                         # DocumentStudio, ScamRadar, SafetyAcademy...
│   │   ├── components/dashboard/ # Hero banner, KPI sparkline cards, Journey pipeline
│   │   ├── components/layout/    # TopHeader, LeftSidebar, RightSidebar
│   │   ├── components/ui/        # Shadcn-style Card, Button, Badge, Progress, Table
│   │   ├── services/api.ts       # Typed API client with dynamic VITE_API_URL
│   │   └── App.tsx               # Main application shell & router
│   ├── vercel.json               # Vercel SPA routing rewrites
│   ├── Dockerfile
│   └── package.json
├── render.yaml                   # 1-Click Render Blueprint deployment
├── docker-compose.yml            # Multi-container local/VPS deployment
├── DEPLOYMENT_GUIDE.md           # Step-by-step deployment instructions
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: `>= 18.0.0`
- **Python**: `>= 3.11.0`
- **Git**

### 2. Clone Repository
```bash
git clone https://github.com/rajputarpit0110/NiveshRakshak.git
cd NiveshRakshak
```

### 3. Setup Python AI Service
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 4. Setup Backend API Gateway
```bash
cd ../backend
npm install
npm start
# Server starts on http://localhost:5001
```

### 5. Setup Frontend Application
```bash
cd ../frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🧪 Benchmark Evaluation Results

NiveshRakshak includes an automated RAG evaluation benchmark (`evaluator.py`) testing statutory accuracy, citation integrity, and out-of-scope rejection:

```bash
npm run rag:evaluate
```

| Test Case | Scenario | Expected Source | Status |
| :--- | :--- | :--- | :--- |
| **TC01** | Broker Disputed Fee Deduction | SEBI Master Circular / Charges | 🟢 **PASS** (100% Grounded) |
| **TC02** | SCORES 2.0 Turnaround Time | SEBI SCORES 2.0 Master Circular | 🟢 **PASS** (21-day timeline verified) |
| **TC03** | Guaranteed 30% Monthly Profit | Scam Advisory / Fraud Signals | 🟢 **PASS** (Flagged prohibited) |
| **TC04** | SMART ODR Conciliation | SEBI / Exchanges Dispute SOP | 🟢 **PASS** (Conciliation timeline verified) |
| **TC05** | Demat KYC & In-Person Verification | SEBI Demat / KYC Procedure | 🟢 **PASS** (IPV steps cited) |
| **TC06** | Unauthorized Trade Escalation | BSE Investor Protection Circular | 🟢 **PASS** (Trade confirmation cited) |
| **TC07** | Out-of-Scope Crypto / Real Estate | Rejection Protocol | 🟢 **PASS** (Refused to speculate) |

**Overall Benchmark Score: 100% Accuracy • 100% Citation Coverage • 0% Hallucination Rate**

---

## 📄 License
This project is open-source under the **MIT License**.

---

<div align="center">
  <b>Built for retail investor safety and statutory transparency.</b><br/>
  <sub>NiveshRakshak provides statutory and regulatory informational guidance and is not a substitute for formal legal counsel.</sub>
</div>
