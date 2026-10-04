"""
Grievance Intelligence & Evidence Completeness Engine.
Extracts entities, financial impact, dates, severity, missing evidence, and escalation timelines.
Calculates dynamic Evidence Completeness percentage and next best action.
"""
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

EVIDENCE_REQUIREMENTS_BY_CATEGORY = {
    "Unauthorized charges": [
        {"id": "ledger", "name": "Trading account ledger statement showing disputed debit", "weight": 25},
        {"id": "contract_note", "name": "Relevant contract notes for the disputed period", "weight": 25},
        {"id": "tariff_sheet", "name": "Agreed Schedule of Charges / Tariff Sheet", "weight": 20},
        {"id": "prior_communication", "name": "Prior email / letter sent to broker compliance", "weight": 20},
        {"id": "bank_statement", "name": "Bank account statement showing funds transfer", "weight": 10}
    ],
    "Unauthorized transaction": [
        {"id": "contract_note", "name": "Disputed contract note / trade execution log", "weight": 30},
        {"id": "login_logs", "name": "Lack of 2FA OTP verification / unrecognized IP records", "weight": 25},
        {"id": "voice_recording_refusal", "name": "Absence of dealer telephone recording confirmation", "weight": 25},
        {"id": "prior_communication", "name": "Immediate notification email sent to compliance within 24h", "weight": 20}
    ],
    "Delayed redemption": [
        {"id": "redemption_request", "name": "Redemption request confirmation / transaction slip", "weight": 35},
        {"id": "bank_statement", "name": "Bank statement verifying delayed credit date", "weight": 35},
        {"id": "prior_communication", "name": "Grievance ticket raised with RTA / AMC", "weight": 30}
    ],
    "Broker misconduct": [
        {"id": "communication_records", "name": "Written chat / email / message records of misrepresentation", "weight": 35},
        {"id": "ledger", "name": "Ledger or portfolio holding statement", "weight": 35},
        {"id": "prior_communication", "name": "Formal complaint letter lodged with broker", "weight": 30}
    ],
    "Default": [
        {"id": "primary_statement", "name": "Financial statement or transaction extract", "weight": 40},
        {"id": "prior_communication", "name": "Copy of correspondence with the financial entity", "weight": 35},
        {"id": "id_proof", "name": "Client identification details (UCC / Folio Number)", "weight": 25}
    ]
}

class GrievanceAgent:
    def analyze_grievance(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze an investment grievance.
        Input keys: description, entity, date, amount, transactionDetails, attachedEvidence
        """
        desc = (data.get("description") or "").strip()
        entity = (data.get("entity") or "").strip()
        date_str = (data.get("date") or "").strip()
        amount_input = data.get("amount")
        attached_evidence = data.get("attachedEvidence") or []

        # 1. Extract Amounts (e.g. ₹2,500, 2500, Rs. 2,500)
        detected_amount = None
        if amount_input is not None and str(amount_input).strip():
            try:
                detected_amount = float(re.sub(r"[^\d\.]", "", str(amount_input)))
            except Exception:
                pass
        if not detected_amount:
            amt_match = re.search(r"(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)", desc, re.IGNORECASE)
            if amt_match:
                detected_amount = float(amt_match.group(1).replace(",", ""))

        # 2. Extract Entities
        detected_entity = entity
        if not detected_entity:
            known_entities = ["zerodha", "groww", "angelone", "upstox", "icici direct", "hdfc securities", "kotak securities", "motilal oswal", "sharekhan", "sbi mutual fund", "hdfc mutual fund"]
            for ke in known_entities:
                if ke in desc.lower():
                    detected_entity = ke.title()
                    break
        if not detected_entity:
            detected_entity = "Financial Intermediary"

        # 3. Classify Category & Subcategory
        desc_lower = desc.lower()
        if any(w in desc_lower for w in ["charge", "deduct", "debit", "admin fee", "sundry", "maintenance", "tariff"]):
            category = "Unauthorized charges"
            subcategory = "Disputed Ledger Entry / Undisclosed Tariff"
        elif any(w in desc_lower for w in ["unauthorized trade", "traded without permission", "did not place order", "stolen shares"]):
            category = "Unauthorized transaction"
            subcategory = "Trade Execution without Client Consent"
        elif any(w in desc_lower for w in ["redemption", "nav", "mutual fund", "sip", "payout delayed"]):
            category = "Delayed redemption"
            subcategory = "Delay in Mutual Fund Proceeds (T+3 breached)"
        elif any(w in desc_lower for w in ["guaranteed", "scam", "telegram", "ponzi", "fake advisor"]):
            category = "Fraud/scam"
            subcategory = "Unregistered Solicitations / Promised Assured Returns"
        elif any(w in desc_lower for w in ["kyc", "pan", "aadhar", "re-kyc"]):
            category = "KYC issue"
            subcategory = "Account Frozen due to KYC non-compliance"
        else:
            category = "Broker misconduct"
            subcategory = "Deficiency in Brokerage Service"

        # 4. Determine Severity & Urgency
        severity = "MEDIUM"
        urgency = "Standard (21-Day Redressal Cycle)"

        if detected_amount and detected_amount >= 50000:
            severity = "HIGH"
            urgency = "Urgent: High Financial Exposure"
        elif category in ["Unauthorized transaction", "Fraud/scam"]:
            severity = "HIGH"
            urgency = "Critical: Immediate Account Freeze Recommended"
        elif detected_amount and detected_amount < 5000:
            severity = "MEDIUM"
            urgency = "Routine Financial Dispute"

        # 5. Evaluate Evidence Completeness
        req_list = EVIDENCE_REQUIREMENTS_BY_CATEGORY.get(category, EVIDENCE_REQUIREMENTS_BY_CATEGORY["Default"])
        verified_evidence = []
        missing_evidence = []
        total_weight = 0
        earned_weight = 0

        # Normalize attached evidence list
        attached_names = [str(e).lower() for e in attached_evidence]
        desc_evidence_check = desc.lower()

        for req in req_list:
            total_weight += req["weight"]
            req_id = req["id"]
            # Check if mentioned in attached documents or explicitly noted in text
            is_present = any(req_id in att or req["name"].lower() in att for att in attached_names)
            if not is_present and ("ledger" in req_id and "ledger" in desc_evidence_check):
                is_present = True
            if not is_present and ("contract" in req_id and "contract note" in desc_evidence_check):
                is_present = True
            if not is_present and ("communication" in req_id and ("emailed" in desc_evidence_check or "complained" in desc_evidence_check)):
                is_present = True

            if is_present:
                earned_weight += req["weight"]
                verified_evidence.append(req["name"])
            else:
                missing_evidence.append(req["name"])

        completeness_pct = min(100, int((earned_weight / total_weight) * 100)) if total_weight > 0 else 50

        # 6. Next Best Action
        if missing_evidence:
            next_best_action = f"Upload the {missing_evidence[0]} to strengthen your formal grievance."
        else:
            next_best_action = "Your evidence package is 100% complete. Proceed to generate your formal complaint draft."

        # 7. Escalation Path
        escalation_path = [
            {"step": 1, "entity": f"{detected_entity} Grievance Cell", "timeline": "21 Calendar Days", "status": "Current / Next Action"},
            {"step": 2, "entity": "SEBI SCORES 2.0 Portal", "timeline": "21 Calendar Days", "status": "Escalation Level 1"},
            {"step": 3, "entity": "SMART ODR / Exchange Arbitration", "timeline": "21-30 Days Conciliation", "status": "Escalation Level 2"}
        ]

        return {
            "category": category,
            "subcategory": subcategory,
            "severity": severity,
            "urgency": urgency,
            "financial_impact": detected_amount or 0.0,
            "detected_entity": detected_entity,
            "date": date_str or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            "evidence_completeness_pct": completeness_pct,
            "verified_evidence": verified_evidence,
            "missing_evidence": missing_evidence,
            "recommended_action": f"Request formal itemized ledger breakdown from {detected_entity}.",
            "next_best_action": next_best_action,
            "escalation_path": escalation_path,
            "confidence": "HIGH" if detected_amount and detected_entity != "Financial Intermediary" else "MEDIUM"
        }
