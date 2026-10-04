# NiveshRakshak — Regulatory & Investor Protection Knowledge Base (`rag_data`)

Welcome to the primary source repository for **NiveshRakshak**. This directory holds official, authoritative, and verified documentation from Indian financial regulators and market institutions.

The RAG (Retrieval-Augmented Generation) pipeline strictly parses, indexes, and cites documents placed within this directory hierarchy.

---

## 1. Directory Structure & Source Categories

Official documents should be organized into their respective authority or topic folders:

```
data/rag_data/
├── sebi/                 # Securities and Exchange Board of India (Regulations, Master Circulars, SCORES guidelines)
├── nse/                  # National Stock Exchange of India (Investor grievance, arbitration, circulars)
├── bse/                  # Bombay Stock Exchange (Trading rules, investor protection fund, complaints)
├── amfi/                 # Association of Mutual Funds in India (Code of conduct, intermediary rules, NAV disclosures)
├── rbi/                  # Reserve Bank of India (Ombudsman scheme, banking & NBFC investor grievances, unauthorized digital lending)
├── investor_education/   # Investor charters, rights compendiums, safety advisories
├── grievance/            # SOPs for filing complaints, escalation matrices, SCORES 2.0 / SMART ODR protocols
├── circulars/            # Chronological regulatory circulars & amendments
├── regulations/          # Statutory enactments (SEBI Act 1992, SCRA 1956, Depositories Act 1996)
├── faq/                  # Official FAQs published by regulators
└── policies/             # Model broker agreements, margin pledge rules, charter templates
```

*Note: Files placed directly inside `data/rag_data/` are also scanned and indexed automatically.*

---

## 2. Supported Formats

- `.pdf` (Vector text & OCR fallback)
- `.txt` (Plain text / markdown notes)
- `.md` (Structured regulatory guides)
- `.docx` (Official circular drafts)
- `.json` (Structured statutory clauses & FAQ catalogs)
- `.csv` (Regulatory penalty tables, fee schedules)

---

## 3. Recommended Document Naming Convention

To allow the ingestion engine to extract reliable metadata automatically, use descriptive filenames:

`[AUTHORITY]_[DOCUMENT_TYPE]_[SUBJECT]_[YEAR_OR_CIRCULAR_NO].[ext]`

**Examples:**
- `SEBI_CIRCULAR_Investor_Grievance_Redressal_SCORES2_2024.pdf`
- `SEBI_CHARTER_Investor_Rights_And_Responsibilities_2023.md`
- `NSE_SOP_Broker_Dispute_Arbitration_Mechanism_2024.txt`
- `RBI_INTEGRATED_OMBUDSMAN_Grievance_Redressal_Scheme_2021.pdf`
- `AMFI_CODE_Code_of_Conduct_Mutual_Fund_Intermediaries_2023.md`

---

## 4. Metadata Standard

Every indexed chunk stores rich provenance metadata:
```json
{
  "source_name": "SEBI_Investor_Charter.md",
  "source_type": "charter",
  "authority": "SEBI",
  "document_title": "Investor Charter in Respect of Portfolio Management Services and Stock Brokers",
  "document_date": "2023-08-15",
  "effective_date": "2023-09-01",
  "section": "Rights of Investors",
  "subsection": "Brokerage and Charge Transparency",
  "page_number": 1,
  "jurisdiction": "India",
  "topic": "investor_rights",
  "chunk_id": "sebi_charter_p01_c03",
  "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "ingestion_timestamp": "2026-10-04T12:00:00Z"
}
```

---

## 5. Ingestion & Embedding Rebuilding

Whenever new documents are added or existing documents are modified:

### Option A: From Root Package Scripts
```bash
npm run rag:ingest
```
To force a full rebuild and purge obsolete embeddings:
```bash
npm run rag:reindex
```

### Option B: Directly from AI Service
```bash
cd ai-service
python3 -m rag.ingest --data-dir ../data/rag_data
```

### Automatic Deduplication
The pipeline computes a SHA-256 hash for every file and individual chunk. Unaltered documents are automatically skipped during incremental runs to prevent duplicated embeddings.

---

## 6. Regulatory Truth & Anti-Hallucination Policy

1. **Official Sources Only**: The knowledge base must strictly hold verifiable documents issued by statutory or recognized self-regulatory organizations (SEBI, RBI, NSE, BSE, MCX, AMFI, CDSL, NSDL).
2. **Never Fabricate Rules**: The AI model is strictly prohibited from guessing or hallucinating regulatory regulations, timeframes, or penalty clauses.
3. **Explicit Fallback**: If the query is not grounded in an indexed official document, the system responds with:
   > *"I could not find sufficient information in the verified knowledge base. Please consult the official SEBI/NSE grievance portal directly."*
4. **Stale Document Protocol**: Every document specifies an `effective_date` and `last_verified`. Documents older than 36 months without re-verification will display an advisory banner: *"Source may require verification against latest circulars."*
