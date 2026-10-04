"""
Smart Hierarchical Chunker.
Splits parsed documents based on semantic boundaries (regulation clauses, headings, bullet groups, FAQs)
preserving document hierarchy and generating unique chunk IDs with hashes.
"""
import re
import hashlib
from typing import List
from pathlib import Path
from rag.parser import ParsedDocument, ParsedSection
from rag.metadata import Chunk, ChunkMetadata

class SmartChunker:
    def __init__(self, target_chunk_size: int = 600, chunk_overlap: int = 100):
        self.target_chunk_size = target_chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_document(self, doc: ParsedDocument) -> List[Chunk]:
        chunks: List[Chunk] = []
        doc_meta = doc.metadata
        source_name = doc.file_name
        doc_title = doc_meta.get("document_title", Path(source_name).stem.replace("_", " "))
        authority = doc_meta.get("authority", "SEBI")
        source_type = doc_meta.get("source_type", "regulatory_document")
        doc_date = doc_meta.get("document_date", None)
        effective_date = doc_meta.get("effective_date", None)
        topic = doc_meta.get("topic", "investor_rights")
        jurisdiction = doc_meta.get("jurisdiction", "India")
        source_url = doc_meta.get("source_url", None)

        chunk_counter = 0

        for section in doc.sections:
            section_title = section.title
            page_num = section.page_number
            content = section.content.strip()

            if not content:
                continue

            # Split section by subsections or bullet blocks / regulation clauses
            sub_units = self._split_into_units(content)

            for unit in sub_units:
                unit_text = unit.strip()
                if not unit_text or len(unit_text) < 30:
                    continue

                chunk_counter += 1
                chunk_id = f"{Path(source_name).stem[:24]}_p{page_num:02d}_c{chunk_counter:03d}".lower()
                chunk_hash = hashlib.sha256(unit_text.encode("utf-8")).hexdigest()

                # Infer subsection if unit starts with e.g. "2.1 Right to..." or "Q1:"
                subsection = None
                sub_match = re.match(r"^(\*?\*?[0-9]+(?:\.[0-9]+)*\*?\*?|[A-Z][0-9]*\.|Q[0-9]+:)\s*([^\n\.\:]{3,60})", unit_text)
                if sub_match:
                    subsection = f"{sub_match.group(1).replace('*', '').strip()} {sub_match.group(2).strip()}"

                meta = ChunkMetadata(
                    chunk_id=chunk_id,
                    source_name=source_name,
                    source_type=source_type,
                    authority=authority,
                    document_title=doc_title,
                    document_date=doc_date,
                    effective_date=effective_date,
                    section=section_title,
                    subsection=subsection,
                    page_number=page_num,
                    source_url=source_url,
                    jurisdiction=jurisdiction,
                    topic=topic,
                    hash=chunk_hash
                )

                # Format text with hierarchical context for better retrieval
                enriched_text = f"Document: {doc_title}\nAuthority: {authority}\nSection: {section_title}"
                if subsection:
                    enriched_text += f"\nSubsection: {subsection}"
                enriched_text += f"\n\n{unit_text}"

                chunks.append(Chunk(
                    id=chunk_id,
                    text=enriched_text,
                    metadata=meta
                ))

        return chunks

    def _split_into_units(self, text: str) -> List[str]:
        """Split text by clause numbers, bullet groups, or double-newlines."""
        # Check for clauses like 1.1, 2.1 or bullet points
        clause_pattern = re.compile(r"\n(?=(?:[0-9]+\.[0-9]+|\*?\*?[0-9]+\.[0-9]+\*?\*?|###\s+|Q[0-9]+:))")
        parts = clause_pattern.split(text)
        
        results = []
        for part in parts:
            part = part.strip()
            if not part:
                continue
            # If a part is still too large, split by paragraphs
            if len(part) > 1200:
                paras = [p.strip() for p in part.split("\n\n") if p.strip()]
                current_p = ""
                for p in paras:
                    if len(current_p) + len(p) > self.target_chunk_size and current_p:
                        results.append(current_p)
                        current_p = p
                    else:
                        current_p = f"{current_p}\n\n{p}".strip()
                if current_p:
                    results.append(current_p)
            else:
                results.append(part)

        return results if results else [text]
