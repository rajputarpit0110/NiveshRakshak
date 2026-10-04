"""
Multi-Agent Orchestrator.
Classifies user intent, delegates execution to specialist agents,
and unifies context with verified RAG provenance citations.
"""
import re
from typing import Dict, Any, Optional
from rag.pipeline import RAGPipeline
from agents.rights_agent import RightsAgent
from agents.grievance_agent import GrievanceAgent
from agents.scam_agent import ScamRiskAgent
from agents.document_agent import DocumentAgent
from agents.complaint_agent import ComplaintAgent
from agents.learning_agent import LearningAgent
from agents.recommendation_agent import RecommendationAgent

class AgentOrchestrator:
    def __init__(self, rag_pipeline: Optional[RAGPipeline] = None):
        self.rag_pipeline = rag_pipeline or RAGPipeline()
        self.rights_agent = RightsAgent(self.rag_pipeline)
        self.grievance_agent = GrievanceAgent()
        self.scam_agent = ScamRiskAgent()
        self.document_agent = DocumentAgent()
        self.complaint_agent = ComplaintAgent()
        self.learning_agent = LearningAgent()
        self.recommendation_agent = RecommendationAgent()

    def classify_intent(self, text: str) -> str:
        """Classify user intent into primary domain sub-agent."""
        t = text.lower()
        if any(w in t for w in ["scam", "fraud", "telegram", "guaranteed return", "fake advisor", "whatsapp group", "anydesk", "double money"]):
            return "scam_risk"
        elif any(w in t for w in ["complaint", "draft", "file grievance", "scores format", "letter to broker"]):
            return "complaint_draft"
        elif any(w in t for w in ["deducted", "debit", "unauthorized charge", "ledger", "problem with broker", "redemption delay", "lost money"]):
            return "grievance_analysis"
        elif any(w in t for w in ["analyze document", "contract note", "statement audit", "pdf check"]):
            return "document_analysis"
        elif any(w in t for w in ["quiz", "test my knowledge", "safety score", "learning", "module"]):
            return "learning"
        else:
            return "rights_inquiry"

    def handle_request(self, intent: Optional[str], payload: Dict[str, Any]) -> Dict[str, Any]:
        """Route request to appropriate specialist agent."""
        query_text = payload.get("query") or payload.get("text") or payload.get("description") or ""
        inferred_intent = intent or self.classify_intent(query_text)

        if inferred_intent == "scam_risk":
            analysis = self.scam_agent.analyze_text(query_text)
            return {
                "intent": "scam_risk",
                "result": analysis,
                "agent": "ScamRiskAgent"
            }

        elif inferred_intent == "grievance_analysis":
            grievance_info = self.grievance_agent.analyze_grievance(payload)
            # Enrich with RAG regulatory grounding
            rag_info = self.rag_pipeline.query(f"{grievance_info['category']} {grievance_info['financial_impact']}")
            return {
                "intent": "grievance_analysis",
                "grievance": grievance_info,
                "regulatory_context": rag_info.model_dump(),
                "agent": "GrievanceAgent"
            }

        elif inferred_intent == "complaint_draft":
            draft = self.complaint_agent.generate_draft(payload, investor_profile=payload.get("investorProfile"))
            return {
                "intent": "complaint_draft",
                "draft": draft,
                "agent": "ComplaintAgent"
            }

        elif inferred_intent == "document_analysis":
            analysis = self.document_agent.analyze_document_content(query_text, file_name=payload.get("fileName", "uploaded_statement.pdf"))
            return {
                "intent": "document_analysis",
                "document_analysis": analysis,
                "agent": "DocumentAgent"
            }

        elif inferred_intent == "learning":
            quiz = self.learning_agent.get_quiz_questions()
            modules = self.learning_agent.get_modules()
            return {
                "intent": "learning",
                "quiz": quiz,
                "modules": modules,
                "agent": "LearningAgent"
            }

        else:
            # Default: Rights Inquiry with Grounded RAG Pipeline
            rights_data = self.rights_agent.analyze_rights_query(query_text)
            return {
                "intent": "rights_inquiry",
                "response": rights_data["rag_response"],
                "matched_rights": rights_data["matched_rights"],
                "agent": "RightsAgent"
            }
