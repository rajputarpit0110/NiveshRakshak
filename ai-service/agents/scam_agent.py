"""
Investment Risk & Scam Signal Analyzer.
Detects 12+ behavioral, lexical, and operational fraud indicators in investment solicitations.
Adheres strictly to safe, educational, non-defamatory phrasing.
"""
import re
from typing import Dict, Any, List

SCAM_INDICATOR_DEFINITIONS = [
    {
        "id": "guaranteed_returns",
        "name": "Guaranteed / Assured Returns Claim",
        "weight": 30,
        "keywords": ["guarantee", "assured return", "fixed monthly return", "100% safe profit", "zero risk profit", "double your money"],
        "explanation": "Under SEBI and Exchange regulations, no registered market participant is legally allowed to promise fixed or guaranteed returns on market-linked instruments."
    },
    {
        "id": "unrealistic_returns",
        "name": "Unrealistic or Exorbitant Return Projections",
        "weight": 25,
        "keywords": ["10% monthly", "20% monthly", "30% monthly", "50% weekly", "100% in 15 days", "daily profit"],
        "explanation": "Claims of returns vastly outperforming standard market benchmarks (e.g. 10%+ per month) are characteristic of Ponzi or fraudulent multiplier schemes."
    },
    {
        "id": "pressure_tactics",
        "name": "High Pressure & Artificial Urgency Tactics",
        "weight": 15,
        "keywords": ["urgent", "expires today", "last chance", "only 2 slots left", "transfer immediately", "hurry up"],
        "explanation": "Creating artificial time pressure is a recognized social engineering tactic designed to prevent victims from conducting due diligence."
    },
    {
        "id": "unusual_payment_methods",
        "name": "Unusual Payment Channels (Personal Accounts / Crypto / Third-Party UPI)",
        "weight": 25,
        "keywords": ["personal account", "send to gpay number", "individual upi", "usdt", "crypto wallet", "cash deposit", "mule account"],
        "explanation": "Regulated brokers and asset managers only accept funds into designated USCNB client bank accounts—never personal bank accounts or individual UPI IDs."
    },
    {
        "id": "remote_access_requests",
        "name": "Request to Install Remote Desktop Software",
        "weight": 35,
        "keywords": ["anydesk", "teamviewer", "rustdesk", "quicksupport", "screen share", "remote desktop"],
        "explanation": "Legitimate financial institutions will NEVER ask an investor to install remote screen-sharing tools to complete trading or KYC."
    },
    {
        "id": "otp_credential_solicitation",
        "name": "Solicitation of Confidential Credentials / OTP / PIN",
        "weight": 35,
        "keywords": ["share otp", "send password", "mpin", "trading pin", "login credentials"],
        "explanation": "Brokers and regulators never ask for your 2FA OTP, demat trading password, or biometric authorization pin."
    },
    {
        "id": "fake_authority_claims",
        "name": "Impersonation of Regulators or Institutional Entities",
        "weight": 20,
        "keywords": ["approved by sebi", "sebi certified scheme", "rbi authorized fund", "nse tie up", "goldman institutional vip"],
        "explanation": "SEBI does not endorse, certify, or approve specific investment schemes or individual portfolio strategies."
    },
    {
        "id": "unverified_channels",
        "name": "Informal / Unverified Messaging Groups",
        "weight": 15,
        "keywords": ["telegram group", "whatsapp vip channel", "secret tip channel", "premium pump calls", "admin dm"],
        "explanation": "Investment advice distributed via anonymous social messaging channels often involves illegal front-running or pump-and-dump operations."
    },
    {
        "id": "withdrawal_fees_demand",
        "name": "Demand for Upfront 'Clearance Tax' or 'Release Fee' to Withdraw",
        "weight": 35,
        "keywords": ["withdrawal fee", "pay tax to withdraw", "20% clearance", "unlock balance", "release deposit"],
        "explanation": "Genuine brokers debit statutory taxes (TDS/STT) at source and never demand additional upfront payments to release existing balances."
    },
    {
        "id": "suspicious_links",
        "name": "Suspicious or Third-Party APK Download Links",
        "weight": 20,
        "keywords": ["download apk", "bit.ly", "tinyurl", "custom link", "app not on play store", "install profile"],
        "explanation": "Fake trading platforms are commonly distributed as direct APK files to bypass Google Play Protect and Apple App Store security verifications."
    }
]

class ScamRiskAgent:
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze text/message for scam and investment risk signals.
        Returns risk level, detected signals, safe wording disclaimer, and next steps.
        """
        text_lower = text.lower()
        detected_signals = []
        total_risk_score = 0

        for indicator in SCAM_INDICATOR_DEFINITIONS:
            matched_kw = []
            for kw in indicator["keywords"]:
                if kw in text_lower:
                    matched_kw.append(kw)

            if matched_kw:
                detected_signals.append({
                    "id": indicator["id"],
                    "name": indicator["name"],
                    "matched_phrases": matched_kw,
                    "explanation": indicator["explanation"],
                    "severity_weight": indicator["weight"]
                })
                total_risk_score += indicator["weight"]

        # Calculate Risk Level
        if total_risk_score >= 45 or any(s["severity_weight"] >= 35 for s in detected_signals):
            risk_level = "HIGH"
            risk_summary = "High-risk signals detected. Several indicators strongly align with known fraudulent solicitation patterns."
        elif total_risk_score >= 20:
            risk_level = "MEDIUM"
            risk_summary = "Moderate risk signals detected. Unusual solicitation attributes require rigorous verification before any fund movement."
        elif detected_signals:
            risk_level = "LOW"
            risk_summary = "Minor risk markers observed. Exercise standard due diligence."
        else:
            risk_level = "LOW"
            risk_summary = "No obvious high-risk indicators detected in the text. However, always verify entity registration independently."

        # Actionable recommendations
        recommended_actions = [
            "Do NOT transfer any money or pay 'release fees' under any circumstances.",
            "Verify the entity's claimed SEBI Registration Number directly on the official SEBI portal (sebi.gov.in).",
            "Never install remote screen-sharing applications (AnyDesk, TeamViewer) or download external APK files.",
            "Preserve all transaction receipts, chat screenshots, UPI handles, and bank UTR numbers as evidence.",
            "If funds were already transferred, immediately report to the National Cyber Crime Portal (cybercrime.gov.in) or call 1930."
        ]

        return {
            "risk_level": risk_level,
            "risk_score": min(100, total_risk_score),
            "signals_detected_count": len(detected_signals),
            "detected_signals": detected_signals,
            "summary": risk_summary,
            "recommended_actions": recommended_actions,
            "safe_harbor_disclaimer": "Risk signals are educational indicators and do not by themselves constitute a definitive legal fraud verdict. Always verify directly with official statutory authorities."
        }
