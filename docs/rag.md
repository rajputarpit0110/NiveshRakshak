# RAG Pipeline & Retrieval Architecture

## 1. Pipeline Overview

```
User Query
   ↓
Query Expansion (Financial Domain Vocabulary)
   ↓
Parallel Hybrid Retrieval
   ├── Dense Semantic Vector Search (Cosine Similarity)
   ├── Lexical Keyword Search (BM25Okapi)
   └── Regulatory Metadata Filtering (Authority / Topic)
   ↓
Reciprocal Rank Fusion (RRF: sum( 1 / (60 + rank) ))
   ↓
Domain Reranker (Authority Weights + Term Coverage + Section Boost)
   ↓
Top-K Context Chunks
   ↓
Grounding & Confidence Scoring
   ↓
Structured Answer Synthesis + Provenance Citations
```

## 2. Chunking Hierarchy

Documents are parsed using `rag.parser.DocumentParser` and divided by `rag.chunker.SmartChunker`:
- Headings & Clauses (e.g. `2.1 Right to Transparency`)
- FAQ units (`Q1: ... Answer: ...`)
- Retains hierarchical breadcrumbs: `Document > Authority > Section > Subsection > Page Number`.

## 3. Anti-Hallucination & Groundedness Policy

- If composite confidence is `< 0.45`, the pipeline triggers the statutory fallback:
  > *"I could not find sufficient information in the verified knowledge base. Please consult the official SEBI/NSE grievance portal directly."*
- Zero regulatory speculation. Real citations attached with document name, authority, and line-item excerpt.
