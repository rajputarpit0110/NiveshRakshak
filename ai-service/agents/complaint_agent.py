"""
Complaint Drafting Engine & Quality Evaluator.
Drafts formal legal-grade investor complaints and calculates a 0-100 Complaint Quality Score
across 7 objective dimensional rubrics.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class ComplaintAgent:
    def evaluate_quality(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate Complaint Quality Score (0-100) based on 7 statutory criteria.
        Returns score, passed checks, missing elements, and actionable recommendations.
        """
        entity = (data.get("entity") or "").strip()
        description = (data.get("description") or "").strip()
        amount = data.get("amount")
        date_str = (data.get("date") or "").strip()
        client_id = (data.get("clientId") or data.get("ucc") or "").strip()
        prior_comm = (data.get("priorCommunication") or "").strip()
        evidence_list = data.get("evidence") or []
        resolution_requested = (data.get("requestedResolution") or "").strip()

        score = 0
        checks_passed = []
        improvements_needed = []

        # 1. Entity Information (15 pts)
        if entity and len(entity) >= 3 and entity.lower() != "financial intermediary":
            score += 15
            checks_passed.append(f"Regulated entity clearly identified: '{entity}'")
        elif entity:
            score += 8
            improvements_needed.append("Specify the registered corporate name and SEBI Registration Number of the entity.")
        else:
            improvements_needed.append("Entity name is missing. State the specific stock broker or depository.")

        # 2. Issue Description & Clarity (20 pts)
        if len(description) >= 60:
            score += 20
            checks_passed.append("Issue is described with detailed factual background")
        elif len(description) >= 20:
            score += 12
            improvements_needed.append("Elaborate on what occurred, specifying transaction sequence and dates.")
        else:
            improvements_needed.append("Issue description is too brief. Provide detailed specifics of the disputed event.")

        # 3. Financial Quantum / Disputed Amount (15 pts)
        if amount and float(str(amount).replace(",", "").replace("₹", "")) > 0:
            score += 15
            checks_passed.append(f"Precise financial claim identified: ₹{float(str(amount).replace(',', '').replace('₹', '')):,.2f}")
        else:
            improvements_needed.append("Disputed monetary amount is missing or zero. Specify the exact deduction or loss value.")

        # 4. Timeline / Transaction Date (15 pts)
        if date_str and len(date_str) >= 8:
            score += 15
            checks_passed.append(f"Transaction date and timeline established: {date_str}")
        else:
            improvements_needed.append("Transaction or incident date is missing. Add specific dates to prove timeliness under regulatory limits.")

        # 5. Client Identification (10 pts)
        if client_id and len(client_id) >= 4:
            score += 10
            checks_passed.append(f"Unique Client Code / Demat ID provided: {client_id}")
        else:
            improvements_needed.append("Unique Client Code (UCC) or Demat account number is missing.")

        # 6. Supporting Evidence Attached (15 pts)
        if len(evidence_list) >= 2:
            score += 15
            checks_passed.append(f"{len(evidence_list)} supporting evidence records identified (Ledger, Contract note, etc.)")
        elif len(evidence_list) == 1:
            score += 8
            improvements_needed.append("Attach at least one additional supporting document (e.g. Tariff schedule or bank statement).")
        else:
            improvements_needed.append("No supporting documents attached. Attach ledger statements or contract notes.")

        # 7. Requested Remedy & Prior Communication (10 pts)
        if prior_comm or "emailed" in description.lower() or "called" in description.lower():
            score += 5
            checks_passed.append("Prior correspondence with the intermediary established")
        else:
            improvements_needed.append("State previous communication attempts (ticket numbers, email timestamps).")

        if resolution_requested or "refund" in description.lower() or "reverse" in description.lower():
            score += 5
            checks_passed.append("Specific requested resolution stated")
        else:
            improvements_needed.append("Explicitly state requested relief (e.g., immediate ledger reversal with statutory interest).")

        final_score = min(100, max(0, score))

        return {
            "quality_score": final_score,
            "rating": "EXCELLENT" if final_score >= 80 else ("GOOD" if final_score >= 60 else "NEEDS_IMPROVEMENT"),
            "checks_passed": checks_passed,
            "improvements_needed": improvements_needed,
            "is_ready_for_filing": final_score >= 70,
            "next_best_action": "Proceed to download formal complaint PDF." if final_score >= 70 else (improvements_needed[0] if improvements_needed else "Review draft details.")
        }

    def generate_draft(self, data: Dict[str, Any], investor_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Draft a formal legal-grade grievance complaint.
        Adheres to SEBI SCORES 2.0 and Stock Exchange IGRC format.
        """
        investor = investor_profile or {}
        investor_name = investor.get("name") or data.get("investorName") or "Aggrieved Investor"
        email = investor.get("email") or data.get("email") or "investor@example.com"
        phone = investor.get("phone") or data.get("phone") or "+91-XXXXXXXXXX"
        client_id = data.get("clientId") or data.get("ucc") or "UCC-XXXXXX"
        
        entity = data.get("entity") or "Registered Stock Broker"
        category = data.get("category") or "Unauthorized charges"
        amount = data.get("amount") or 2500.0
        date_str = data.get("date") or datetime.now(timezone.utc).strftime("%d-%b-%Y")
        description = data.get("description") or f"Unauthorized ledger debit of ₹{amount:,.2f} reflected on trading account without tariff disclosure or contract note justification."
        evidence_list = data.get("evidence") or ["Trading Ledger Extract", "Contract Note", "Account Tariff Schedule"]
        resolution = data.get("requestedResolution") or f"Immediate reversal and full credit of the disputed debit of ₹{amount:,.2f} along with itemized written explanation."

        subject = f"FORMAL GRIEVANCE: Disputed Deduction of ₹{amount:,.2f} on Account {client_id} — {entity}"

        draft_body = f"""To,
The Compliance Officer / Principal Officer,
{entity}
(Registered with SEBI / Member of NSE & BSE)

Date: {date_str}
Subject: {subject}

Respected Sir / Madam,

I am a registered retail client maintaining a Trading and Demat account with your firm under Unique Client Code (UCC) / Client ID: {client_id}.

1. STATEMENT OF DISPUTED TRANSACTION:
On or around {date_str}, I observed an unauthorized / unexplained debit entry of ₹{amount:,.2f} in my financial ledger statement. 
Brief details of the grievance:
"{description}"

2. CONTRAVENTION OF REGULATORY NORMS:
Under the SEBI Master Circular for Stock Brokers and the SEBI Investor Charter:
(a) No broker shall debit any charge, penalty, or administrative levy that was not explicitly disclosed in the agreed Schedule of Charges at the time of client onboarding.
(b) The client is entitled to an itemized invoice and computational justification within three (3) working days of inquiry.
(c) The intermediary is mandated to resolve all client grievances within twenty-one (21) calendar days.

3. EVIDENCE FURNISHED:
I hereby submit the following documents in support of my claim:
{chr(10).join(f"- {e}" for e in evidence_list)}

4. REQUESTED RELIEF:
In light of the statutory regulations cited above, I respectfully request:
1. Immediate reversal and ledger credit of ₹{amount:,.2f} to my account.
2. Furnishing of an itemized calculation and relevant contract note justifying the deduction if claimed to be a statutory levy.
3. Written confirmation within the statutory 21-day timeline under SEBI norms.

DECLARATION:
I confirm that the facts stated above are true and accurate to the best of my knowledge. In the event of non-resolution within 21 calendar days or an inadequate response, I reserve the right to escalate this dispute to the SEBI SCORES 2.0 portal (scores.sebi.gov.in) and the SMART ODR platform for conciliation and arbitration.

Yours faithfully,

{investor_name}
Client Code (UCC): {client_id}
Email: {email}
Phone: {phone}
"""

        # Calculate quality of this generated draft
        quality_eval = self.evaluate_quality({
            "entity": entity,
            "description": description,
            "amount": amount,
            "date": date_str,
            "clientId": client_id,
            "evidence": evidence_list,
            "requestedResolution": resolution
        })

        return {
            "subject": subject,
            "draft_text": draft_body,
            "investor_details": {
                "name": investor_name,
                "email": email,
                "phone": phone,
                "clientId": client_id
            },
            "entity_details": {
                "name": entity
            },
            "financial_impact": amount,
            "date": date_str,
            "attachments": evidence_list,
            "requested_resolution": resolution,
            "quality_evaluation": quality_eval,
            "mandatory_disclaimer": "AI-generated draft — review and verify all details before submitting to the intermediary."
        }
