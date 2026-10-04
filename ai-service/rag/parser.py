"""
Multi-format document parser supporting PDF, Markdown, Plain Text, JSON, and CSV.
Extracts structured document sections, pages, and frontmatter metadata.
"""
import os
import re
import json
import csv
from typing import List, Dict, Any, Tuple
from pathlib import Path

class ParsedSection:
    def __init__(self, title: str, content: str, page_number: int = 1, section_num: str = ""):
        self.title = title
        self.content = content
        self.page_number = page_number
        self.section_num = section_num

class ParsedDocument:
    def __init__(self, file_path: str, raw_text: str, metadata: Dict[str, Any], sections: List[ParsedSection]):
        self.file_path = file_path
        self.file_name = os.path.basename(file_path)
        self.raw_text = raw_text
        self.metadata = metadata
        self.sections = sections

class DocumentParser:
    @staticmethod
    def extract_yaml_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
        """Extract frontmatter between --- and --- if present."""
        metadata = {}
        body = content
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                yaml_text = parts[1].strip()
                body = parts[2].strip()
                for line in yaml_text.split("\n"):
                    line = line.strip()
                    if ":" in line and not line.startswith("#"):
                        key, val = line.split(":", 1)
                        metadata[key.strip()] = val.strip().strip("'\"")
        return metadata, body

    @classmethod
    def parse_markdown(cls, file_path: str) -> ParsedDocument:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        meta, body = cls.extract_yaml_frontmatter(content)
        
        # Infer title and authority if missing
        if "document_title" not in meta:
            h1_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
            meta["document_title"] = h1_match.group(1) if h1_match else Path(file_path).stem.replace("_", " ")

        if "authority" not in meta:
            folder = os.path.basename(os.path.dirname(file_path)).upper()
            if folder in ["SEBI", "NSE", "BSE", "AMFI", "RBI"]:
                meta["authority"] = folder
            else:
                meta["authority"] = "SEBI"

        # Split into sections based on markdown headings
        sections: List[ParsedSection] = []
        heading_pattern = re.compile(r"^(#{1,3})\s+(.+)$", re.MULTILINE)
        matches = list(heading_pattern.finditer(body))

        if not matches:
            sections.append(ParsedSection("General", body.strip(), 1))
        else:
            for i, match in enumerate(matches):
                title = match.group(2).strip()
                start_idx = match.end()
                end_idx = matches[i + 1].start() if i + 1 < len(matches) else len(body)
                sec_content = body[start_idx:end_idx].strip()
                
                # Check for section number e.g. "Section 1:" or "1.2"
                sec_num_match = re.match(r"(?:Section\s+)?([0-9]+(?:\.[0-9]+)?)", title, re.IGNORECASE)
                sec_num = sec_num_match.group(1) if sec_num_match else ""
                
                sections.append(ParsedSection(title, sec_content, 1, sec_num))

        return ParsedDocument(file_path, body, meta, sections)

    @classmethod
    def infer_authority(cls, file_path: str, text: str = "") -> str:
        folder = os.path.basename(os.path.dirname(file_path)).upper()
        if folder in ["SEBI", "NSE", "BSE", "AMFI", "RBI"]:
            return folder
        
        name_upper = Path(file_path).name.upper()
        if "SEBI" in name_upper:
            return "SEBI"
        elif "NSE" in name_upper:
            return "NSE"
        elif "BSE" in name_upper:
            return "BSE"
        elif "AMFI" in name_upper or "MF" in name_upper:
            return "AMFI"
        elif "RBI" in name_upper:
            return "RBI"
        elif "DEPOSITORY" in name_upper or "NSDL" in name_upper or "CDSL" in name_upper:
            return "DEPOSITORIES"
        
        # Check text preview
        text_upper = text[:2000].upper()
        if "RESERVE BANK OF INDIA" in text_upper:
            return "RBI"
        elif "SECURITIES AND EXCHANGE BOARD OF INDIA" in text_upper:
            return "SEBI"
        elif "ASSOCIATION OF MUTUAL FUNDS IN INDIA" in text_upper:
            return "AMFI"
        elif "NATIONAL STOCK EXCHANGE" in text_upper:
            return "NSE"
        elif "BOMBAY STOCK EXCHANGE" in text_upper:
            return "BSE"
            
        return "SEBI"

    @classmethod
    def parse_pdf(cls, file_path: str) -> ParsedDocument:
        meta = {
            "document_title": Path(file_path).stem.replace("_", " ").replace(".pdf", ""),
            "source_type": "pdf_document"
        }

        sections: List[ParsedSection] = []
        full_text = []

        try:
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            for page_idx, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                clean_text = re.sub(r"\s+", " ", page_text).strip()
                full_text.append(clean_text)
                if clean_text:
                    sections.append(ParsedSection(f"Page {page_idx + 1}", clean_text, page_idx + 1))
        except Exception as e:
            # Fallback if pdf fails or empty
            sections.append(ParsedSection("Extraction Error", f"Error reading PDF: {str(e)}", 1))

        joined_text = "\n\n".join(full_text)
        meta["authority"] = cls.infer_authority(file_path, joined_text)

        return ParsedDocument(file_path, joined_text, meta, sections)

    @classmethod
    def parse_text(cls, file_path: str) -> ParsedDocument:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()

        meta = {
            "document_title": Path(file_path).stem.replace("_", " "),
            "source_type": "text_document"
        }
        folder = os.path.basename(os.path.dirname(file_path)).upper()
        meta["authority"] = folder if folder in ["SEBI", "NSE", "BSE", "AMFI", "RBI"] else "SEBI"

        # Split on double newlines
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        sections = [ParsedSection(f"Section {idx+1}", p, 1) for idx, p in enumerate(paragraphs)]

        return ParsedDocument(file_path, content, meta, sections)

    @classmethod
    def parse_json(cls, file_path: str) -> ParsedDocument:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            data = json.load(f)

        meta = {
            "document_title": Path(file_path).stem.replace("_", " "),
            "source_type": "json_catalog"
        }
        folder = os.path.basename(os.path.dirname(file_path)).upper()
        meta["authority"] = folder if folder in ["SEBI", "NSE", "BSE", "AMFI", "RBI"] else "SEBI"

        sections: List[ParsedSection] = []
        raw_text_parts = []

        if isinstance(data, list):
            for idx, item in enumerate(data):
                title = item.get("title") or item.get("question") or f"Item {idx+1}"
                content = item.get("content") or item.get("answer") or json.dumps(item)
                sections.append(ParsedSection(str(title), str(content), 1))
                raw_text_parts.append(f"{title}: {content}")
        elif isinstance(data, dict):
            for k, v in data.items():
                content = json.dumps(v, indent=2) if isinstance(v, (dict, list)) else str(v)
                sections.append(ParsedSection(str(k), content, 1))
                raw_text_parts.append(f"{k}: {content}")

        return ParsedDocument(file_path, "\n".join(raw_text_parts), meta, sections)

    @classmethod
    def parse_file(cls, file_path: str) -> ParsedDocument:
        ext = Path(file_path).suffix.lower()
        if ext in [".md", ".markdown"]:
            return cls.parse_markdown(file_path)
        elif ext == ".pdf":
            return cls.parse_pdf(file_path)
        elif ext == ".json":
            return cls.parse_json(file_path)
        elif ext in [".txt", ".csv"]:
            return cls.parse_text(file_path)
        else:
            return cls.parse_text(file_path)
