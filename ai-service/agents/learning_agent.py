"""
Investor Safety Score & Adaptive Learning Engine.
Evaluates 6 financial safety dimensions, tracks learning loops (72 -> 78 -> 86),
and serves scenario-based adaptive quizzes with dynamic weak-area targeting.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

SCENARIO_QUIZ_REPOSITORY = [
    {
        "id": "q01",
        "dimension": "Scam Awareness",
        "difficulty": "beginner",
        "scenario": "You receive a WhatsApp message from a group named 'SEBI Certified VIP Profit Club' claiming guaranteed 30% monthly profit on algorithmic options trading. What is the safest first action?",
        "options": [
            "Transfer a trial amount of ₹5,000 to test the returns",
            "Ignore and report the group because SEBI-registered entities are strictly prohibited from guaranteeing fixed returns",
            "Ask the admin to share their Aadhaar card before transferring money",
            "Download their custom APK application to inspect the trades"
        ],
        "correct_index": 1,
        "explanation": "Under SEBI regulations, no registered market participant is legally permitted to offer guaranteed or fixed returns on market-linked investments. Any claim of 30% monthly returns is a recognized red flag.",
        "related_module": "Module 1: Identifying Guaranteed-Return Scams"
    },
    {
        "id": "q02",
        "dimension": "Document Awareness",
        "difficulty": "intermediate",
        "scenario": "Your monthly trading ledger displays a deduction of ₹2,500 with the description 'Sundry Administrative Debit'. You never agreed to this charge during account opening. What should you do?",
        "options": [
            "Wait for 6 months to see if it gets reversed automatically",
            "Immediately email the broker's compliance officer demanding an itemized breakdown and cite SEBI brokerage transparency circulars",
            "Pay another ₹2,500 to maintain active account status",
            "File a direct police FIR without contacting the stock broker"
        ],
        "correct_index": 1,
        "explanation": "Brokers cannot levy ad-hoc admin charges without prior disclosure in your agreed Tariff Sheet. You must lodge a written protest to the broker's compliance desk, which triggers the statutory 21-day redressal clock.",
        "related_module": "Module 4: Reading Financial Ledgers & Challenging Hidden Charges"
    },
    {
        "id": "q03",
        "dimension": "Grievance Awareness",
        "difficulty": "intermediate",
        "scenario": "You lodged an email complaint with your stock broker regarding an unauthorized trade. 21 calendar days have passed without any reply or resolution. What is your legal escalation step?",
        "options": [
            "Escalate your complaint to SEBI SCORES 2.0 (scores.sebi.gov.in) attaching your initial email proof",
            "Post negative reviews on social media and close your demat account",
            "Send the same email again and wait another 60 days",
            "Hire a private investigator to track down the broker"
        ],
        "correct_index": 0,
        "explanation": "Under SEBI Master Circular guidelines, intermediaries have a mandatory 21-day timeline to issue an Action Taken Report. If breached, the investor can escalate directly to SCORES 2.0.",
        "related_module": "Module 2: The Two-Tier Escalation Matrix & SCORES 2.0"
    },
    {
        "id": "q04",
        "dimension": "Investor Rights",
        "difficulty": "beginner",
        "scenario": "Within how many hours of trade execution is a stock broker mandated to deliver digitally signed Electronic Contract Notes (ECN)?",
        "options": [
            "Within 7 business days",
            "Within 24 hours of trade execution",
            "Only at the end of the financial quarter",
            "Only if the investor pays an extra courier fee"
        ],
        "correct_index": 1,
        "explanation": "Brokers are obligated to deliver digitally signed contract notes to the investor's registered email within 24 hours of trade execution.",
        "related_module": "Module 5: Fundamental Investor Rights & Contract Notes"
    },
    {
        "id": "q05",
        "dimension": "KYC Awareness",
        "difficulty": "advanced",
        "scenario": "A caller claiming to be from your depository participant says your Demat account will be frozen in 1 hour due to 'Re-KYC failure' unless you install AnyDesk to verify your PAN card. What is happening?",
        "options": [
            "A standard remote KYC verification procedure",
            "A high-risk credential-theft scam using remote desktop screen-sharing",
            "An official SEBI depository audit",
            "A routine telecom verification"
        ],
        "correct_index": 1,
        "explanation": "Depository participants and banks will NEVER request you to install remote access applications like AnyDesk or TeamViewer. This is an impersonation tactic used to compromise 2FA credentials.",
        "related_module": "Module 3: Verifying Intermediaries & Secure KYC Practices"
    },
    {
        "id": "q06",
        "dimension": "Financial Safety Habits",
        "difficulty": "intermediate",
        "scenario": "Which of the following bank accounts is safe to transfer investment money for stock trading?",
        "options": [
            "A personal savings account belonging to your relationship manager",
            "An individual UPI handle with an '@okaxis' extension given in a Telegram chat",
            "The designated client bank account (USCNB / clearing account) registered in the broker's corporate name on NSE/BSE",
            "A foreign USDT cryptocurrency wallet"
        ],
        "correct_index": 2,
        "explanation": "All legitimate client funds must strictly flow into designated Upstreaming Client Bank Accounts (USCNB) held by the registered stock broker. Never remit funds to individual accounts.",
        "related_module": "Module 6: Safe Fund Transfers & Asset Segregation"
    }
]

LEARNING_MODULES_CATALOG = [
    {
        "id": "mod_scams",
        "title": "Identifying Guaranteed-Return Scams & Fake Advisors",
        "dimension": "Scam Awareness",
        "estimated_minutes": 5,
        "summary": "Learn how fraudsters construct fake SEBI registration certificates, use social media multiplier schemes, and why guaranteed returns are legally impossible.",
        "key_takeaways": [
            "No SEBI-registered entity can guarantee fixed market returns.",
            "Verify registration numbers directly on sebi.gov.in.",
            "Never transfer money to personal savings accounts or individual UPIs."
        ]
    },
    {
        "id": "mod_escalation",
        "title": "The Two-Tier Escalation Matrix & SCORES 2.0",
        "dimension": "Grievance Awareness",
        "estimated_minutes": 6,
        "summary": "Master the 21-day timeline, how to register on SCORES 2.0, and how SMART ODR conciliation and exchange arbitration work.",
        "key_takeaways": [
            "Intermediary gets 21 calendar days to provide Action Taken Report.",
            "SCORES 2.0 routes complaints automatically with exchange oversight.",
            "SMART ODR enables low-cost online conciliation and arbitration."
        ]
    },
    {
        "id": "mod_charges",
        "title": "Reading Financial Ledgers & Challenging Hidden Charges",
        "dimension": "Document Awareness",
        "estimated_minutes": 5,
        "summary": "Understand how to audit contract notes against ledger debits, detect unexplained administrative fees, and invoke your statutory right to itemized invoices.",
        "key_takeaways": [
            "Brokers must provide charge calculations within 3 working days.",
            "Undisclosed tariff modifications require 30 days prior written notice.",
            "Contract notes must detail STT, GST, and turnover levies separately."
        ]
    },
    {
        "id": "mod_kyc",
        "title": "Verifying Intermediaries & Secure KYC Practices",
        "dimension": "KYC Awareness",
        "estimated_minutes": 4,
        "summary": "Safeguard against remote access scams, fraudulent Re-KYC links, and ensure your DDPI authorizations are not misused.",
        "key_takeaways": [
            "Never install AnyDesk or screen-share apps for KYC.",
            "Check official depository websites directly for demat holding status.",
            "DDPI authorization is limited strictly to trade settlement."
        ]
    }
]

class LearningAgent:
    def get_quiz_questions(self, count: int = 4, difficulty: Optional[str] = None) -> List[Dict[str, Any]]:
        questions = list(SCENARIO_QUIZ_REPOSITORY)
        if difficulty:
            filtered = [q for q in questions if q["difficulty"] == difficulty]
            if filtered:
                questions = filtered
        
        # Return sanitized questions without correct answers exposed
        sanitized = []
        for q in questions[:count]:
            sanitized.append({
                "id": q["id"],
                "dimension": q["dimension"],
                "difficulty": q["difficulty"],
                "scenario": q["scenario"],
                "options": q["options"],
                "related_module": q["related_module"]
            })
        return sanitized

    def evaluate_quiz_submission(self, answers: Dict[str, int]) -> Dict[str, Any]:
        """
        Evaluate answers: dict of {question_id: selected_index}.
        Computes topic scores, overall safety score, weak areas, and recommended modules.
        """
        total_questions = len(SCENARIO_QUIZ_REPOSITORY)
        correct_count = 0
        dimension_stats: Dict[str, Dict[str, int]] = {}

        q_map = {q["id"]: q for q in SCENARIO_QUIZ_REPOSITORY}
        graded_results = []

        for qid, q in q_map.items():
            dim = q["dimension"]
            dimension_stats.setdefault(dim, {"total": 0, "correct": 0})
            dimension_stats[dim]["total"] += 1

            user_choice = answers.get(qid)
            is_correct = (user_choice == q["correct_index"])

            if is_correct:
                correct_count += 1
                dimension_stats[dim]["correct"] += 1

            graded_results.append({
                "id": qid,
                "dimension": dim,
                "scenario": q["scenario"],
                "user_choice": user_choice,
                "correct_index": q["correct_index"],
                "is_correct": is_correct,
                "explanation": q["explanation"],
                "related_module": q["related_module"]
            })

        # Calculate Dimensional Scores (0-100)
        topic_scores = {}
        weak_areas = []
        strong_areas = []

        for dim, stats in dimension_stats.items():
            pct = int((stats["correct"] / stats["total"]) * 100) if stats["total"] > 0 else 50
            topic_scores[dim] = pct
            if pct < 70:
                weak_areas.append(dim)
            else:
                strong_areas.append(dim)

        overall_score = int(sum(topic_scores.values()) / len(topic_scores)) if topic_scores else 60

        # Recommend learning modules based on weak areas
        recommended_modules = []
        for mod in LEARNING_MODULES_CATALOG:
            if mod["dimension"] in weak_areas or not weak_areas:
                recommended_modules.append(mod)

        if not recommended_modules:
            recommended_modules = LEARNING_MODULES_CATALOG[:2]

        return {
            "overall_safety_score": overall_score,
            "topic_scores": topic_scores,
            "strong_areas": strong_areas,
            "weak_areas": weak_areas,
            "recommended_modules": recommended_modules,
            "graded_questions": graded_results,
            "next_best_action": f"Complete '{recommended_modules[0]['title']}' to boost your Investor Safety Score." if recommended_modules else "Take an advanced adaptive challenge."
        }

    def get_modules(self) -> List[Dict[str, Any]]:
        return LEARNING_MODULES_CATALOG
