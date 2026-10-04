import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export const SafetyAcademy: React.FC = () => {
  const [safetyScore, setSafetyScore] = useState(82);
  const [scoreHistory, setScoreHistory] = useState([68, 76, 82]);
  
  const [topicScores] = useState<Record<string, number>>({
    'Scam Awareness': 90,
    'Document Audit': 85,
    'Grievance Redressal': 80,
    'Investor Rights': 75,
    'KYC Hygiene': 70,
    'Digital Safety': 85
  });

  const questions = [
    {
      id: 'q01',
      dimension: 'Scam Awareness',
      scenario: 'You receive a WhatsApp message from a "SEBI Certified Profit Club" claiming guaranteed 30% monthly profits on algorithmic options trading. What is the safest first action?',
      options: [
        'Transfer a trial amount of ₹5,000 to test returns',
        'Ignore and report because registered entities are legally prohibited from guaranteeing fixed returns',
        'Ask the admin for an Aadhaar photo before sending funds',
        'Download their custom APK application'
      ],
      correctIndex: 1,
      explanation: 'Under SEBI regulations, no registered market participant is legally permitted to offer guaranteed or fixed returns on market-linked investments. Any claim of 30% monthly returns is a recognized red flag.'
    },
    {
      id: 'q02',
      dimension: 'Document Audit',
      scenario: 'Your broker ledger displays a deduction of ₹2,500 marked as "Sundry Administrative Debit" without prior disclosure in your agreed tariff sheet. What should you do?',
      options: [
        'Wait 6 months for automatic reversal',
        'Email the broker compliance officer demanding an itemized breakdown citing SEBI transparency rules',
        'Pay another ₹2,500 to keep the account active',
        'File an FIR without contacting the broker'
      ],
      correctIndex: 1,
      explanation: 'Brokers cannot levy ad-hoc admin charges without prior disclosure in the tariff sheet. You must lodge a written protest to trigger the statutory 21-day clock.'
    },
    {
      id: 'q03',
      dimension: 'Grievance Redressal',
      scenario: 'You lodged a complaint with your broker regarding an unauthorized trade. 21 calendar days have passed without any reply. What is the next escalation step?',
      options: [
        'Escalate to SEBI SCORES 2.0 (scores.sebi.gov.in) attaching your initial email proof',
        'Post on social media and close the account',
        'Wait another 60 days',
        'Hire a private recovery agent'
      ],
      correctIndex: 0,
      explanation: 'Intermediaries have a statutory 21-day timeline to submit an Action Taken Report. If breached, the investor can escalate directly to SCORES 2.0.'
    },
    {
      id: 'q04',
      dimension: 'Investor Rights',
      scenario: 'Within how many hours of trade execution must a stock broker deliver digitally signed Electronic Contract Notes (ECN)?',
      options: [
        'Within 7 business days',
        'Within 24 hours of trade execution',
        'Only at the end of the quarter',
        'Only upon extra payment'
      ],
      correctIndex: 1,
      explanation: 'Brokers are obligated to deliver digitally signed contract notes to the investor\'s registered email within 24 hours of trade execution.'
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (qid: string, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qid]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    const calculated = Math.round((correct / questions.length) * 100);
    setSubmitted(true);

    const newOverall = Math.min(100, Math.round(safetyScore * 0.7 + calculated * 0.3));
    setSafetyScore(newOverall);
    setScoreHistory(prev => [...prev, newOverall]);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const modules = [
    { id: 'm1', title: 'Identifying Guaranteed-Return Scams & Fake Advisers', dim: 'Scam Awareness', time: '5m', done: true },
    { id: 'm2', title: 'Reading Broker Ledgers & Challenging Hidden Debits', dim: 'Document Audit', time: '6m', done: true },
    { id: 'm3', title: 'SCORES 2.0 Two-Tier Escalation Matrix & SMART ODR', dim: 'Grievance', time: '5m', done: false },
    { id: 'm4', title: 'Intermediary Verification & Video KYC Guidelines', dim: 'KYC Hygiene', time: '4m', done: false }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="fintech-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Safety Academy
            </span>
            <span className="text-xs text-slate-500 font-medium">Adaptive Learning Loop</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Investor Safety Score & Academy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Scenario dilemmas that identify weak dimensions, test your statutory knowledge, and recalculate your Safety Score dynamically.
          </p>
        </div>

        {/* Safety Score Counter Display */}
        <div className="flex items-center gap-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/90 shrink-0 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
            {safetyScore}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">SAFETY RATING</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {safetyScore >= 80 ? 'High Resilience' : 'Moderate Resilience'}
            </span>
            <span className="text-[11px] text-emerald-700 block font-mono font-medium mt-0.5">
              Score Loop: {scoreHistory.join(' → ')}
            </span>
          </div>
        </div>
      </div>

      {/* 6 Dimensions Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(topicScores).map(([topic, score]) => (
          <div key={topic} className="fintech-card p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-600 block truncate" title={topic}>
              {topic}
            </span>
            <span className="text-xl font-extrabold text-slate-900 block font-mono">
              {score}%
            </span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Scenario Quiz */}
      <div className="fintech-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Adaptive Scenario Challenge
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">4 practical decision dilemmas based on market cases</p>
          </div>

          {submitted && (
            <button
              onClick={handleResetQuiz}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Challenge
            </button>
          )}
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;

            return (
              <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Question {idx + 1} of {questions.length}</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {q.dimension}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                  {q.scenario}
                </p>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === optIdx;
                    let optStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                      } else if (isSelected) {
                        optStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-2.5 ${optStyle}`}
                      >
                        <span className="font-mono text-slate-400 font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}>
                    <strong>{isCorrect ? '✓ Correct Decision!' : '✗ Regulatory Rationale:'}</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < questions.length}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 active:scale-95"
            >
              <span>Submit & Recalculate Safety Score</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Recommended Learning Path */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Recommended Learning Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modules.map((m) => (
            <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  {m.dim} • {m.time} read
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                  {m.title}
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                m.done
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}>
                {m.done ? 'Done' : 'Start'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
