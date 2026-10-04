"""
Citation generation and formatting module.
Transforms retrieved and verified chunks into formal regulatory citations with exact provenance.
"""
import re
from typing import List, Tuple
from rag.metadata import Chunk, Citation

class CitationFormatter:
    @staticmethod
    def extract_relevant_excerpt(query: str, text: str, max_chars: int = 240) -> str:
        """Find the most relevant sentence or snippet in the chunk matching the query."""
        clean_text = re.sub(r"^(?:Document|Authority|Section|Subsection):[^\n]+\n*", "", text, flags=re.MULTILINE).strip()
        sentences = re.split(r"(?<=[.!?])\s+", clean_text)
        
        q_words = set(re.findall(r"\b[a-zA-Z0-9]{3,}\b", query.lower()))
        best_sentence = clean_text[:max_chars]
        best_match_count = -1

        for sentence in sentences:
            s_clean = sentence.strip()
            if not s_clean:
                continue
            s_words = set(re.findall(r"\b[a-zA-Z0-9]{3,}\b", s_clean.lower()))
            matches = len(q_words.intersection(s_words))
            if matches > best_match_count:
                best_match_count = matches
                best_sentence = s_clean

        if len(best_sentence) > max_chars:
            best_sentence = best_sentence[:max_chars].rsplit(" ", 1)[0] + "..."

        return best_sentence

    @classmethod
    def create_citations(cls, query: str, ranked_chunks: List[Tuple[Chunk, float]]) -> List[Citation]:
        citations = []
        for idx, (chunk, score) in enumerate(ranked_chunks):
            meta = chunk.metadata
            excerpt = cls.extract_relevant_excerpt(query, chunk.text)
            
            citation = Citation(
                citation_id=f"cit_{meta.authority.lower()}_{meta.chunk_id[:16]}",
                source_name=meta.source_name,
                source_type=meta.source_type,
                authority=meta.authority,
                document_title=meta.document_title,
                document_date=meta.document_date,
                section=meta.section,
                subsection=meta.subsection,
                page_number=meta.page_number,
                source_url=meta.source_url or f"https://www.sebi.gov.in/legal/{meta.source_name}",
                relevance_score=score,
                excerpt=excerpt
            )
            citations.append(citation)

        return citations
