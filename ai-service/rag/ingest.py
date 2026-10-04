"""
RAG Ingestion and Indexing Engine.
Scans data/rag_data/, parses documents, produces hierarchical chunks,
generates embeddings, deduplicates via SHA-256 hashes, and maintains knowledge_manifest.json.
"""
import os
import sys
import json
import hashlib
import argparse
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, List

# Ensure current package can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.parser import DocumentParser
from rag.chunker import SmartChunker
from rag.embeddings import EmbeddingService
from rag.vector_store import VectorStore

class IngestionManager:
    def __init__(self, data_dir: str, storage_dir: str = "rag_storage", manifest_path: str = "knowledge_manifest.json"):
        self.data_dir = data_dir
        self.storage_dir = storage_dir
        self.manifest_path = os.path.join(storage_dir, manifest_path)
        self.parser = DocumentParser()
        self.chunker = SmartChunker()
        self.embeddings = EmbeddingService()
        self.vector_store = VectorStore(storage_dir)
        self.manifest = self._load_manifest()

    def _load_manifest(self) -> Dict[str, Any]:
        if os.path.exists(self.manifest_path):
            try:
                with open(self.manifest_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {"documents": {}, "last_ingestion": None}
        return {"documents": {}, "last_ingestion": None}

    def _save_manifest(self) -> None:
        os.makedirs(os.path.dirname(self.manifest_path), exist_ok=True)
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(self.manifest, f, indent=2, ensure_ascii=False)

    def _compute_file_hash(self, file_path: str) -> str:
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            while chunk := f.read(65536):
                hasher.update(chunk)
        return hasher.hexdigest()

    def run_ingestion(self, force_reindex: bool = False) -> Dict[str, Any]:
        """Run ingestion pipeline over data_dir."""
        if force_reindex:
            print("[Ingest] Force reindex requested: Clearing vector store and manifest...")
            self.vector_store.clear()
            self.manifest = {"documents": {}, "last_ingestion": None}

        if not os.path.exists(self.data_dir):
            print(f"[Ingest Error] Data directory '{self.data_dir}' not found.")
            return {"status": "error", "message": f"Directory not found: {self.data_dir}"}

        supported_extensions = {".md", ".markdown", ".pdf", ".txt", ".json", ".csv"}
        found_files: List[str] = []

        for root, _, files in os.walk(self.data_dir):
            for file in files:
                if file.startswith(".") or file.lower() == "readme.md":
                    continue
                ext = Path(file).suffix.lower()
                if ext in supported_extensions:
                    found_files.append(os.path.join(root, file))

        print(f"[Ingest] Found {len(found_files)} potential source documents in '{self.data_dir}'.")

        new_docs = 0
        skipped_docs = 0
        total_chunks_added = 0
        failed_files = []

        for file_path in sorted(found_files):
            rel_path = os.path.relpath(file_path, self.data_dir)
            file_hash = self._compute_file_hash(file_path)

            # Check deduplication
            prev_entry = self.manifest["documents"].get(rel_path)
            if prev_entry and prev_entry.get("hash") == file_hash and not force_reindex:
                skipped_docs += 1
                continue

            try:
                parsed_doc = self.parser.parse_file(file_path)
                chunks = self.chunker.chunk_document(parsed_doc)

                if not chunks:
                    print(f"  [Warning] No valid chunks generated for {rel_path}")
                    skipped_docs += 1
                    continue

                chunk_texts = [c.text for c in chunks]
                chunk_embeddings = self.embeddings.generate_embeddings(chunk_texts)

                self.vector_store.add_chunks(chunks, chunk_embeddings)

                # Record into manifest
                self.manifest["documents"][rel_path] = {
                    "document_title": parsed_doc.metadata.get("document_title", parsed_doc.file_name),
                    "authority": parsed_doc.metadata.get("authority", "SEBI"),
                    "source_type": parsed_doc.metadata.get("source_type", "regulatory_document"),
                    "hash": file_hash,
                    "chunk_count": len(chunks),
                    "ingested_at": datetime.now(timezone.utc).isoformat(),
                    "status": "indexed"
                }

                new_docs += 1
                total_chunks_added += len(chunks)
                print(f"  ✓ Indexed: {rel_path} ({len(chunks)} chunks)")

            except Exception as e:
                print(f"  ✗ Failed to index {rel_path}: {str(e)}")
                failed_files.append({"file": rel_path, "error": str(e)})

        self.manifest["last_ingestion"] = datetime.now(timezone.utc).isoformat()
        self._save_manifest()

        stats = self.vector_store.get_stats()
        print("\n=== Ingestion Complete ===")
        print(f"Newly Indexed Documents: {new_docs}")
        print(f"Unchanged/Skipped:       {skipped_docs}")
        print(f"Total Stored Chunks:     {stats['total_chunks']}")
        print(f"Total Documents:         {stats['total_documents']}")
        print(f"Authorities:             {stats['authorities']}")

        return {
            "status": "success",
            "new_documents": new_docs,
            "skipped_documents": skipped_docs,
            "total_chunks_stored": stats["total_chunks"],
            "total_documents_stored": stats["total_documents"],
            "authorities": stats["authorities"],
            "failed_files": failed_files
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="NiveshRakshak RAG Ingestion Pipeline")
    parser.add_argument("--data-dir", default="../data/rag_data", help="Path to regulatory source documents")
    parser.add_argument("--storage-dir", default="rag_storage", help="Path to store vector data and manifest")
    parser.add_argument("--reindex", action="store_true", help="Force rebuild all embeddings")
    args = parser.parse_args()

    # Resolve relative path if run from root or ai-service
    data_dir = args.data_dir
    if not os.path.isabs(data_dir):
        if not os.path.exists(data_dir):
            alt_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "rag_data")
            if os.path.exists(alt_path):
                data_dir = alt_path

    manager = IngestionManager(data_dir=data_dir, storage_dir=args.storage_dir)
    manager.run_ingestion(force_reindex=args.reindex)
