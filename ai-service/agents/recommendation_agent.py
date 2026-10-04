"""
Next Best Action & System Recommendation Engine.
Produces actionable, context-aware next steps across all user states and modules.
"""
from typing import Dict, Any, List, Optional

class RecommendationAgent:
    @staticmethod
    def generate_recommendations(user_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Derive dynamic priority recommendations based on aggregated user state.
        user_state keys:
        - active_complaints: list
        - documents_analyzed: int
        - latest_safety_score: int
        - weak_areas: list
        - recent_scam_checked: bool
        """
        active_complaints = user_state.get("active_complaints") or []
        safety_score = user_state.get("latest_safety_score", 70)
        weak_areas = user_state.get("weak_areas") or []
        doc_count = user_state.get("documents_analyzed", 0)

        recommendations = []

        # Priority 1: Incomplete evidence on active complaints
        for comp in active_complaints:
            completeness = comp.get("evidenceCompleteness", 100)
            cid = comp.get("complaintId", "Grievance")
            if completeness < 75:
                recommendations.append({
                    "priority": "HIGH",
                    "action_title": f"Upload Missing Evidence for Complaint #{cid}",
                    "description": f"Evidence completeness is currently {completeness}%. Uploading your ledger and tariff schedule strengthens your legal standing.",
                    "module": "grievance_evidence",
                    "target_id": comp.get("_id") or cid,
                    "cta": "Upload Evidence"
                })
                break

        # Priority 2: Unresolved complaints nearing 21-day TAT
        for comp in active_complaints:
            days_elapsed = comp.get("daysElapsed", 0)
            status = comp.get("status", "Submitted")
            cid = comp.get("complaintId", "Grievance")
            if days_elapsed >= 21 and status in ["Submitted", "Under Review"]:
                recommendations.append({
                    "priority": "URGENT",
                    "action_title": f"Escalate #{cid} to SEBI SCORES 2.0",
                    "description": "The broker has exceeded the statutory 21-calendar-day timeline without resolving your grievance. You are eligible to file on SCORES.",
                    "module": "escalation",
                    "target_id": comp.get("_id") or cid,
                    "cta": "Escalate to SCORES"
                })
                break

        # Priority 3: Low safety score in specific weak area
        if weak_areas:
            primary_weak = weak_areas[0]
            recommendations.append({
                "priority": "MEDIUM",
                "action_title": f"Complete {primary_weak} Safety Module",
                "description": f"Your safety score has room for improvement in {primary_weak}. A 5-minute scenario quiz will strengthen your protection.",
                "module": "learning",
                "target_id": primary_weak.lower().replace(" ", "_"),
                "cta": "Start Module"
            })
        elif safety_score < 75:
            recommendations.append({
                "priority": "MEDIUM",
                "action_title": "Take the Adaptive Investor Safety Challenge",
                "description": "Assess your resilience against modern financial scams and unauthorized broker debits.",
                "module": "quiz",
                "target_id": "adaptive_quiz",
                "cta": "Take Safety Quiz"
            })

        # Priority 4: Statement audit recommendation if no docs uploaded yet
        if doc_count == 0:
            recommendations.append({
                "priority": "LOW",
                "action_title": "Run AI Document Audit on Your Statement",
                "description": "Upload your latest broker ledger or contract note to automatically scan for hidden administrative fees or unusual debits.",
                "module": "document_analysis",
                "target_id": "doc_audit",
                "cta": "Audit Statement"
            })

        top_priority_action = recommendations[0]["action_title"] if recommendations else "Stay safe: regularly verify broker trade SMS alerts against contract notes."

        return {
            "top_priority_action": top_priority_action,
            "recommendations": recommendations,
            "total_pending_actions": len(recommendations)
        }
