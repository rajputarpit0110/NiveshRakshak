"""
RAG Evaluation Framework.
Evaluates retrieval relevance, citation correctness, groundedness, and out-of-domain rejection.
Calculates honest, computed metrics against a suite of regulatory benchmarks.
"""
import os
import sys
import json
import argparse
from typing import Dict, Any, List

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.pipeline import RAGPipeline
from rag.vector_store import VectorStore

BENCHMARK_TEST_SUITE = [
    {
        "id": "TC01",
        "question": "My stock broker deducted ₹2,500 without explanation. What are my rights and next steps?",
        "expected_authorities": ["SEBI"],
        "expected_terms": ["charge", "tariff", "contract note", "ledger", "scores"],
        "must_be_grounded": True,
        "category": "unauthorized_charge"
    },
    {
        "id": "TC02",
        "question": "What is the mandatory turnaround timeline for an intermediary to resolve a grievance on SCORES 2.0?",
        "expected_authorities": ["SEBI"],
        "expected_terms": ["21", "calendar days", "action taken report", "scores"],
        "must_be_grounded": True,
        "category": "regulatory_timeline"
    },
    {
        "id": "TC03",
        "question": "Can an investment advisor or entity guarantee fixed or monthly returns on trading?",
        "expected_authorities": ["SEBI", "SEBI_NSE"],
        "expected_terms": ["guaranteed", "prohibited", "advisory", "returns"],
        "must_be_grounded": True,
        "category": "scam_signals"
    },
    {
        "id": "TC04",
        "question": "What happens if a mutual fund AMC delays my redemption payout beyond the stipulated time?",
        "expected_authorities": ["AMFI"],
        "expected_terms": ["redemption", "15%", "interest", "delay"],
        "must_be_grounded": True,
        "category": "mutual_funds"
    },
    {
        "id": "TC05",
        "question": "What is the procedure for stock broker dispute arbitration at NSE and IGRC committee?",
        "expected_authorities": ["NSE"],
        "expected_terms": ["igrc", "arbitration", "smart odr"],
        "must_be_grounded": True,
        "category": "arbitration"
    },
    {
        "id": "TC06",
        "question": "How can I complain against an NBFC or unauthorized banking debit under RBI rules?",
        "expected_authorities": ["RBI"],
        "expected_terms": ["ombudsman", "30", "compensation"],
        "must_be_grounded": True,
        "category": "rbi_ombudsman"
    },
    {
        "id": "TC07",
        "question": "How do I make a million dollars by tomorrow using secret crypto insider loops?",
        "expected_authorities": [],
        "expected_terms": [],
        "must_be_grounded": False,
        "category": "out_of_scope_unsupported"
    }
]

class RAGEvaluator:
    def __init__(self, storage_dir: str = "rag_storage"):
        self.vector_store = VectorStore(storage_dir)
        self.pipeline = RAGPipeline(vector_store=self.vector_store)

    def run_evaluation(self) -> Dict[str, Any]:
        print("\n==============================================")
        print("    NIVESHRAKSHAK RAG EVALUATION BENCHMARK    ")
        print("==============================================\n")

        total_tests = len(BENCHMARK_TEST_SUITE)
        retrieval_hits = 0
        citation_correctness_hits = 0
        groundedness_correct_hits = 0
        out_of_scope_blocked_hits = 0
        test_results = []

        for tc in BENCHMARK_TEST_SUITE:
            q = tc["question"]
            resp = self.pipeline.query(q)
            
            # Check retrieval & authority matching
            retrieved_authorities = {s.authority for s in resp.sources}
            exp_auths = set(tc["expected_authorities"])

            if not exp_auths:
                # Negative test (out of scope)
                is_blocked = (resp.confidence == "LOW" or not resp.grounded or "insufficient" in resp.answer.lower())
                if is_blocked:
                    out_of_scope_blocked_hits += 1
                retrieval_pass = is_blocked
                citation_pass = len(resp.sources) <= 1
                grounded_pass = not resp.grounded
            else:
                # Authority overlap (supports composite names like SEBI_FAQ matching SEBI)
                auth_match = any(ea in ra or ra in ea for ea in exp_auths for ra in retrieved_authorities)
                # Term coverage in answer or evidence
                combined_answer = (resp.answer + " " + " ".join(resp.evidence)).lower()
                term_matches = [t for t in tc["expected_terms"] if t.lower() in combined_answer]
                term_score = len(term_matches) / len(tc["expected_terms"])
                
                retrieval_pass = auth_match and term_score >= 0.50
                if retrieval_pass:
                    retrieval_hits += 1

                citation_pass = len(resp.sources) > 0 and all(bool(s.excerpt and s.section) for s in resp.sources)
                if citation_pass:
                    citation_correctness_hits += 1

                grounded_pass = (resp.grounded == tc["must_be_grounded"]) and (resp.confidence in ["HIGH", "MEDIUM"])
                if grounded_pass:
                    groundedness_correct_hits += 1

            passed_all = (retrieval_pass and citation_pass and grounded_pass) if exp_auths else is_blocked

            test_results.append({
                "id": tc["id"],
                "category": tc["category"],
                "question": q,
                "confidence": resp.confidence,
                "confidence_score": resp.confidence_score,
                "grounded": resp.grounded,
                "sources_count": len(resp.sources),
                "passed": passed_all
            })

            status_icon = "✓ PASS" if passed_all else "✗ FAIL"
            print(f"[{tc['id']}] {status_icon} | {tc['category']} | Conf: {resp.confidence} ({resp.confidence_score}) | Grounded: {resp.grounded}")

        positive_count = total_tests - 1
        retrieval_precision = round((retrieval_hits / positive_count) * 100, 1)
        citation_coverage = round((citation_correctness_hits / positive_count) * 100, 1)
        groundedness_rate = round((groundedness_correct_hits / positive_count) * 100, 1)
        blocked_rate = round((out_of_scope_blocked_hits / 1) * 100, 1)
        overall_accuracy = round((sum(1 for t in test_results if t["passed"]) / total_tests) * 100, 1)

        summary = {
            "total_benchmarks": total_tests,
            "overall_accuracy_percentage": overall_accuracy,
            "retrieval_precision_percentage": retrieval_precision,
            "citation_coverage_percentage": citation_coverage,
            "grounded_answers_percentage": groundedness_rate,
            "unsupported_answers_blocked_percentage": blocked_rate,
            "test_details": test_results
        }

        print("\n----------------------------------------------")
        print("          HONEST BENCHMARK RESULTS            ")
        print("----------------------------------------------")
        print(f"Overall Benchmark Accuracy:      {overall_accuracy}%")
        print(f"Retrieval Precision (Top-K):    {retrieval_precision}%")
        print(f"Citation Provenance Coverage:   {citation_coverage}%")
        print(f"Grounded Verified Answers:      {groundedness_rate}%")
        print(f"Unsupported Claims Blocked:     {blocked_rate}%")
        print("==============================================\n")

        # Save evaluation report
        os.makedirs(self.vector_store.storage_dir, exist_ok=True)
        report_path = os.path.join(self.vector_store.storage_dir, "evaluation_report.json")
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)

        return summary

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate NiveshRakshak RAG Pipeline")
    parser.add_argument("--storage-dir", default="rag_storage", help="Storage directory")
    args = parser.parse_args()

    evaluator = RAGEvaluator(storage_dir=args.storage_dir)
    evaluator.run_evaluation()
