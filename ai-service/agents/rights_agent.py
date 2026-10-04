"""
Investor Rights Agent.
Maps queries to statutory investor protection rights, retrieves official circular citations,
and provides legal -> simple translation with real-world examples and action steps.
"""
from typing import Dict, Any, List, Optional
from rag.pipeline import RAGPipeline
from rag.metadata import RAGResponse

INVESTOR_RIGHTS_CATALOG = [
    {
        "id": "right_transparency",
        "title": "Right to Transparency in Charges & Tariffs",
        "category": "Transparency",
        "legal_basis": "SEBI Master Circular for Stock Brokers / Tariff Schedule Disclosures",
        "simple_language": "Your broker cannot deduct any fee, penalty, or charge unless it was clearly listed in the tariff sheet you agreed to during onboarding. You have the right to an itemized invoice for any deduction within 3 working days.",
        "real_world_example": "If your trading ledger shows a debit of ₹2,500 labelled 'sundry charges' or 'administrative fee', the broker is legally required to explain the calculation or reverse it.",
        "what_you_can_do": "Demand an itemized billing statement via email. If not resolved within 21 days, escalate to SEBI SCORES 2.0.",
        "related_grievance_types": ["Unauthorized charges", "Broker misconduct"]
    },
    {
        "id": "right_contract_notes",
        "title": "Right to Timely & Digitally Signed Contract Notes",
        "category": "Information",
        "legal_basis": "SEBI Circular on Electronic Contract Notes (ECN)",
        "simple_language": "You are entitled to receive digitally signed contract notes within 24 hours of trade execution, showing exact trade prices, brokerage, STT, and exchange fees.",
        "real_world_example": "If you buy shares on Monday, your broker must email you the verified contract note by Tuesday evening.",
        "what_you_can_do": "Check contract notes against your SMS trade alerts. Report missing contract notes immediately to the exchange.",
        "related_grievance_types": ["Unauthorized transaction", "Non-receipt of contract note"]
    },
    {
        "id": "right_grievance_redressal",
        "title": "Right to Time-Bound Grievance Redressal (21 Days)",
        "category": "Grievance Redressal",
        "legal_basis": "SEBI SCORES 2.0 Redressal Master Circular 2024",
        "simple_language": "Any registered market intermediary (broker, AMC, DP) must resolve your written complaint within a maximum of 21 calendar days and furnish an Action Taken Report.",
        "real_world_example": "If a broker ignores your complaint for 21 days, your case can be escalated automatically to SEBI SCORES with priority tracking.",
        "what_you_can_do": "Record the submission timestamp. On day 22, lodge a complaint on scores.sebi.gov.in with your initial email proof.",
        "related_grievance_types": ["Broker misconduct", "Delayed redemption", "Delayed settlement"]
    },
    {
        "id": "right_fund_settlement",
        "title": "Right to Periodic Settlement of Funds (Running Account)",
        "category": "Fair Treatment",
        "legal_basis": "SEBI Running Account Settlement Norms",
        "simple_language": "Brokers must return all unutilized client funds back to your bank account on the first Friday of every month or quarter, without any deduction.",
        "real_world_example": "Your broker cannot withhold unpledged cash balances for months to earn interest or fund internal operations.",
        "what_you_can_do": "Review monthly settlement credits in your bank passbook. Discrepancies should be reported to exchange compliance.",
        "related_grievance_types": ["Non-receipt of funds", "Settlement delay"]
    },
    {
        "id": "right_asset_segregation",
        "title": "Right to Segregation of Client Collateral & Demat Assets",
        "category": "Privacy & Security",
        "legal_basis": "SEBI Client Asset Pledging Regulations",
        "simple_language": "Your shares and funds cannot be pledged for anyone else's trades or used for the broker's proprietary bets.",
        "real_world_example": "A broker cannot take credit lines against your long-term portfolio without explicit OTP margin pledge authorization.",
        "what_you_can_do": "Check monthly NSDL/CDSL CAS (Consolidated Account Statement) to verify your demat balance directly.",
        "related_grievance_types": ["Unauthorized transaction", "Collateral misuse"]
    },
    {
        "id": "right_fair_redemption",
        "title": "Right to Timely Mutual Fund Redemption & 15% Interest",
        "category": "Fair Treatment",
        "legal_basis": "SEBI Mutual Fund Regulations / AMFI Code of Conduct",
        "simple_language": "Mutual funds must disburse redemption proceeds within T+3 days (T+1 for liquid funds). Any delay legally incurs 15% annual interest paid directly to you.",
        "real_world_example": "If your equity mutual fund redemption is credited 10 days late without regulatory halt, AMC must compensate you with 15% p.a. interest.",
        "what_you_can_do": "File a claim with the AMC Investor Relations Officer calculating interest for the delay period.",
        "related_grievance_types": ["Delayed redemption", "Mutual fund issue"]
    }
]

class RightsAgent:
    def __init__(self, rag_pipeline: RAGPipeline):
        self.rag_pipeline = rag_pipeline
        self.catalog = INVESTOR_RIGHTS_CATALOG

    def get_all_rights(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        if not category or category.lower() == "all":
            return self.catalog
        return [r for r in self.catalog if r["category"].lower() == category.lower()]

    def get_right_by_id(self, right_id: str) -> Optional[Dict[str, Any]]:
        for r in self.catalog:
            if r["id"] == right_id:
                return r
        return None

    def analyze_rights_query(self, query: str) -> Dict[str, Any]:
        rag_resp: RAGResponse = self.rag_pipeline.query(query)
        
        # Match catalog rights
        matched_rights = []
        q_lower = query.lower()
        for r in self.catalog:
            if any(term in q_lower for term in r["title"].lower().split()) or any(g.lower() in q_lower for g in r["related_grievance_types"]):
                matched_rights.append(r)

        if not matched_rights:
            matched_rights.append(self.catalog[0])

        return {
            "rag_response": rag_resp.model_dump(),
            "matched_rights": matched_rights,
            "category": matched_rights[0]["category"] if matched_rights else "Investor Protection",
            "recommended_action": rag_resp.recommended_action
        }
