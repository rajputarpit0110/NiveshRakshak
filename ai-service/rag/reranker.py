"""
Reranker module.
Reranks candidate chunks based on lexical-semantic coverage, regulatory authority hierarchy,
section specificity, and answer grounding potential.
"""
import re
from typing import List, Tuple
from rag.metadata import Chunk

class Reranker:
    def __init__(self, rerank_top_k: int = 4):
        self.rerank_top_k = rerank_top_k
        self.authority_weights = {
            "SEBI": 1.25,
            "NSE": 1.15,
            "BSE": 1.15,
            "RBI": 1.20,
            "AMFI": 1.10,
            "SEBI_NSE": 1.25,
            "SEBI_EXCHANGES": 1.25,
            "SEBI_FAQ": 1.20
        }

    def rerank(
        self,
        query: str,
        candidates: List[Tuple[Chunk, float, str]],
        top_k: int = 4
    ) -> List[Tuple[Chunk, float]]:
        """
        Rerank hybrid retrieval candidates.
        Computes composite relevance score factoring term coverage, authority weight, and heading alignment.
        """
        if not candidates:
            return []

        q_terms = set(re.findall(r"\b[a-z0-9]{3,}\b", query.lower()))
        reranked = []

        for chunk, base_score, method in candidates:
            chunk_text = chunk.text.lower()
            meta = chunk.metadata

            # 1. Term Coverage Ratio
            matched_terms = [t for t in q_terms if t in chunk_text]
            coverage_ratio = len(matched_terms) / (len(q_terms) + 1e-6)

            # 2. Section Heading Alignment
            sec_boost = 1.0
            if meta.section:
                sec_lower = meta.section.lower()
                sec_matches = [t for t in q_terms if t in sec_lower]
                if sec_matches:
                    sec_boost += 0.25 * len(sec_matches)

            # 3. Regulatory Authority Weight
            auth_weight = self.authority_weights.get(meta.authority, 1.0)

            # 4. Composite Rerank Score
            composite_score = (
                (base_score * 0.40) +
                (coverage_ratio * 0.35) +
                (sec_boost * 0.15) +
                (auth_weight * 0.10)
            )

            # Normalize to 0.0 - 1.0 range
            normalized = min(1.0, max(0.0, composite_score / 1.5))
            reranked.append((chunk, round(normalized, 4)))

        # Sort descending by composite score
        reranked.sort(key=lambda x: x[1], reverse=True)
        return reranked[:top_k]
