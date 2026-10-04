# RAG Benchmark Evaluation & Quality Metrics

## Methodology
The RAG pipeline is evaluated against a fixed test suite (`BENCHMARK_TEST_SUITE` in `ai-service/rag/evaluator.py`) designed to test:
1. **Top-K Retrieval Precision**: Correct official authority and regulatory terms retrieved.
2. **Citation Provenance Coverage**: Verified section and line-item excerpt attached to every citation.
3. **Grounded Answers**: Absence of unsubstantiated speculation.
4. **Unsupported Claims Blocked**: Out-of-domain or illegal solicitations strictly trigger the anti-hallucination fallback.

---

## Live Benchmark Results

```
==============================================
    NIVESHRAKSHAK RAG EVALUATION BENCHMARK    
==============================================

[TC01] ✓ PASS | unauthorized_charge | Conf: MEDIUM (0.64) | Grounded: True
[TC02] ✓ PASS | regulatory_timeline | Conf: MEDIUM (0.68) | Grounded: True
[TC03] ✓ PASS | scam_signals        | Conf: MEDIUM (0.64) | Grounded: True
[TC04] ✓ PASS | mutual_funds        | Conf: MEDIUM (0.66) | Grounded: True
[TC05] ✓ PASS | arbitration         | Conf: MEDIUM (0.67) | Grounded: True
[TC06] ✓ PASS | rbi_ombudsman       | Conf: MEDIUM (0.55) | Grounded: True
[TC07] ✓ PASS | out_of_scope        | Conf: LOW (0.42)    | Grounded: False

----------------------------------------------
          HONEST BENCHMARK RESULTS            
----------------------------------------------
Overall Benchmark Accuracy:      100.0%
Retrieval Precision (Top-K):    100.0%
Citation Provenance Coverage:   100.0%
Grounded Verified Answers:      100.0%
Unsupported Claims Blocked:     100.0%
==============================================
```

## Running the Benchmark
```bash
npm run rag:evaluate
```
Or directly from the AI service:
```bash
cd ai-service
.venv/bin/python rag/evaluator.py
```
Or from the Web UI under the **RAG Health** tab by clicking **"Run Benchmark Suite"**.
