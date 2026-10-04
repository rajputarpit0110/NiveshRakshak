"""
Persistent Vector Store for knowledge chunks.
Stores embeddings, chunks, and metadata with cosine similarity search and metadata filtering.
"""
import os
import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from rag.metadata import Chunk, ChunkMetadata

class VectorStore:
    def __init__(self, storage_dir: str = "rag_storage"):
        self.storage_dir = storage_dir
        self.chunks_file = os.path.join(storage_dir, "chunks.json")
        self.embeddings_file = os.path.join(storage_dir, "embeddings.npy")
        self.chunks: List[Chunk] = []
        self.embeddings: Optional[np.ndarray] = None
        os.makedirs(storage_dir, exist_ok=True)
        self.load()

    def add_chunks(self, chunks: List[Chunk], embeddings: List[List[float]]) -> None:
        """Add new chunks and their corresponding embedding vectors."""
        if not chunks:
            return

        new_emb_array = np.array(embeddings, dtype=np.float32)
        
        # Deduplicate chunks by ID
        existing_ids = {c.id: idx for idx, c in enumerate(self.chunks)}
        
        to_append_chunks = []
        to_append_embs = []

        for chunk, emb in zip(chunks, new_emb_array):
            if chunk.id in existing_ids:
                # Update existing
                idx = existing_ids[chunk.id]
                self.chunks[idx] = chunk
                if self.embeddings is not None and idx < len(self.embeddings):
                    self.embeddings[idx] = emb
            else:
                to_append_chunks.append(chunk)
                to_append_embs.append(emb)

        if to_append_chunks:
            self.chunks.extend(to_append_chunks)
            if self.embeddings is None or len(self.embeddings) == 0:
                self.embeddings = np.array(to_append_embs, dtype=np.float32)
            else:
                self.embeddings = np.vstack([self.embeddings, np.array(to_append_embs, dtype=np.float32)])

        self.save()

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Tuple[Chunk, float]]:
        """Perform cosine similarity vector search with optional metadata filtering."""
        if self.embeddings is None or len(self.chunks) == 0:
            return []

        q_vec = np.array(query_embedding, dtype=np.float32)
        norm_q = np.linalg.norm(q_vec)
        if norm_q > 1e-8:
            q_vec = q_vec / norm_q

        # Compute cosine similarities
        scores = np.dot(self.embeddings, q_vec)
        
        # Filter indices
        ranked_indices = np.argsort(scores)[::-1]
        results: List[Tuple[Chunk, float]] = []

        for idx in ranked_indices:
            chunk = self.chunks[idx]
            score = float(scores[idx])

            # Apply metadata filters if provided
            if filters:
                match = True
                for f_key, f_val in filters.items():
                    val = getattr(chunk.metadata, f_key, None)
                    if isinstance(f_val, list):
                        if val not in f_val:
                            match = False
                            break
                    elif val != f_val:
                        match = False
                        break
                if not match:
                    continue

            results.append((chunk, score))
            if len(results) >= top_k:
                break

        return results

    def save(self) -> None:
        """Persist chunks and embeddings to disk."""
        chunk_data = [
            {
                "id": c.id,
                "text": c.text,
                "metadata": c.metadata.model_dump()
            }
            for c in self.chunks
        ]
        with open(self.chunks_file, "w", encoding="utf-8") as f:
            json.dump(chunk_data, f, ensure_ascii=False, indent=2)

        if self.embeddings is not None:
            np.save(self.embeddings_file, self.embeddings)

    def load(self) -> None:
        """Load stored chunks and embeddings from disk if present."""
        if os.path.exists(self.chunks_file):
            try:
                with open(self.chunks_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                self.chunks = [
                    Chunk(id=item["id"], text=item["text"], metadata=ChunkMetadata(**item["metadata"]))
                    for item in data
                ]
            except Exception as e:
                self.chunks = []

        if os.path.exists(self.embeddings_file):
            try:
                self.embeddings = np.load(self.embeddings_file)
            except Exception:
                self.embeddings = None

    def clear(self) -> None:
        """Clear all stored chunks and vectors."""
        self.chunks = []
        self.embeddings = None
        if os.path.exists(self.chunks_file):
            os.remove(self.chunks_file)
        if os.path.exists(self.embeddings_file):
            os.remove(self.embeddings_file)

    def get_stats(self) -> Dict[str, Any]:
        """Return vector store health statistics."""
        docs = set(c.metadata.source_name for c in self.chunks)
        authorities = {}
        for c in self.chunks:
            auth = c.metadata.authority
            authorities[auth] = authorities.get(auth, 0) + 1

        return {
            "total_chunks": len(self.chunks),
            "total_documents": len(docs),
            "authorities": authorities,
            "has_embeddings": self.embeddings is not None and len(self.embeddings) > 0,
            "vector_dimension": int(self.embeddings.shape[1]) if self.embeddings is not None and len(self.embeddings) > 0 else 0
        }
