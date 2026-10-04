"""
Hybrid Retriever combining Semantic Vector Search with BM25 Keyword Search and Metadata Filtering.
Employs Reciprocal Rank Fusion (RRF) and domain-specific query expansion.
"""
import re
from typing import List, Dict, Any, Optional, Tuple
from rank_bm25 import BM25Okapi
from rag.metadata import Chunk
from rag.vector_store import VectorStore
from rag.embeddings import EmbeddingService

class HybridRetriever:
    def __init__(
        self,
        vector_store: VectorStore,
        embedding_service: EmbeddingService,
        top_k: int = 8,
        similarity_threshold: float = 0.25
    ):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold
        self._bm25: Optional[BM25Okapi] = None
        self._bm25_chunks: List[Chunk] = []
        self._initialize_bm25()

    def _initialize_bm25(self) -> None:
        """Initialize BM25 index over all loaded vector store chunks."""
        self._bm25_chunks = list(self.vector_store.chunks)
        if self._bm25_chunks:
            tokenized_corpus = [
                self._tokenize(chunk.text) for chunk in self._bm25_chunks
            ]
            self._bm25 = BM25Okapi(tokenized_corpus)
        else:
            self._bm25 = None

    def refresh(self) -> None:
        """Refresh BM25 index when new documents are indexed."""
        self._initialize_bm25()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r"\b[a-zA-Z0-9_\-\.]{2,}\b", text.lower())

    def expand_query(self, query: str) -> List[str]:
        """Domain query expansion for Indian investor protection vocabulary."""
        expansions = [query]
        q_lower = query.lower()

        if "charge" in q_lower or "deduct" in q_lower or "2500" in q_lower or "ledger" in q_lower:
            expansions.append("unauthorized ledger debits broker charges transparency contract notes SEBI")
        if "complaint" in q_lower or "grievance" in q_lower or "scores" in q_lower:
            expansions.append("SEBI SCORES 2.0 investor grievance redressal mechanism timeline days")
        if "scam" in q_lower or "fraud" in q_lower or "guaranteed" in q_lower:
            expansions.append("guaranteed returns red flags SEBI advisory unauthorized entities cybercrime")
        if "arbitration" in q_lower or "igrc" in q_lower or "dispute" in q_lower:
            expansions.append("NSE BSE IGRC SMART ODR arbitration investor protection fund")
        if "mutual fund" in q_lower or "amfi" in q_lower or "redemption" in q_lower:
            expansions.append("delayed redemption interest penalty AMFI code of conduct")

        return expansions

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Tuple[Chunk, float, str]]:
        """
        Execute Hybrid Retrieval (Vector + BM25) with Reciprocal Rank Fusion (RRF).
        Returns a list of (Chunk, blended_score, retrieval_method).
        """
        k = top_k or self.top_k
        if not self.vector_store.chunks:
            return []

        if self._bm25 is None or len(self._bm25_chunks) != len(self.vector_store.chunks):
            self.refresh()

        # 1. Query Expansion & Semantic Vector Search
        expanded_queries = self.expand_query(query)
        combined_query = " ".join(expanded_queries)
        q_emb = self.embedding_service.generate_embedding(combined_query)

        vector_results = self.vector_store.search(q_emb, top_k=k * 2, filters=filters)

        # 2. BM25 Keyword Search
        bm25_results: List[Tuple[Chunk, float]] = []
        if self._bm25 and self._bm25_chunks:
            query_tokens = self._tokenize(combined_query)
            bm25_scores = self._bm25.get_scores(query_tokens)
            ranked_bm25_indices = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)
            
            for idx in ranked_bm25_indices[:k * 2]:
                if bm25_scores[idx] > 0.05:
                    chunk = self._bm25_chunks[idx]
                    # Apply filters if any
                    if filters:
                        match = True
                        for f_key, f_val in filters.items():
                            val = getattr(chunk.metadata, f_key, None)
                            if val != f_val:
                                match = False
                                break
                        if not match:
                            continue
                    bm25_results.append((chunk, float(bm25_scores[idx])))

        # 3. Reciprocal Rank Fusion (RRF)
        # RRF formula: score = sum( 1 / (60 + rank) )
        rrf_scores: Dict[str, float] = {}
        chunk_map: Dict[str, Chunk] = {}
        methods: Dict[str, List[str]] = {}

        for rank, (chunk, score) in enumerate(vector_results):
            cid = chunk.id
            chunk_map[cid] = chunk
            methods.setdefault(cid, []).append("vector")
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (60.0 + rank + 1)) * 1.2

        for rank, (chunk, score) in enumerate(bm25_results):
            cid = chunk.id
            chunk_map[cid] = chunk
            methods.setdefault(cid, []).append("keyword")
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + (1.0 / (60.0 + rank + 1)) * 1.0

        # Sort combined results
        sorted_cids = sorted(rrf_scores.keys(), key=lambda cid: rrf_scores[cid], reverse=True)
        final_results: List[Tuple[Chunk, float, str]] = []

        max_score = max(rrf_scores.values()) if rrf_scores else 1.0

        for cid in sorted_cids[:k]:
            normalized_score = rrf_scores[cid] / (max_score + 1e-6)
            if normalized_score >= self.similarity_threshold:
                method_label = "+".join(set(methods.get(cid, ["hybrid"])))
                final_results.append((chunk_map[cid], round(normalized_score, 4), method_label))

        return final_results
