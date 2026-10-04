import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  RotateCcw,
  TrendingUp,
  Award,
  X,
  Scale,
  FileText,
  Check,
  ExternalLink
} from 'lucide-react';

interface SafetyAcademyProps {
  onNavigate?: (tab: string, prefillData?: any) => void;
}

export const SafetyAcademy: React.FC<SafetyAcademyProps> = ({ onNavigate }) => {
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

  const [learningModules, setLearningModules] = useState([
    {
      id: 'm1',
      title: 'Identifying Guaranteed-Return Scams & Fake Advisers',
      dim: 'Scam Awareness',
      time: '5m',
      done: true,
      navTarget: 'scam',
      navLabel: 'Test in Scam Radar',
      overview: 'Understand the hallmarks of Ponzi trading schemes, Telegram/WhatsApp VIP advisory traps, and how to verify registration on SEBI portal before sending funds.',
      takeaways: [
        'SEBI PFUTP regulations explicitly prohibit guaranteed returns in securities markets.',
        'Legitimate brokers and registered advisers never ask for money transfers into personal saving accounts or UPI IDs of private individuals.',
        'Never install third-party APKs or trading bots downloaded via Bitly/Telegram links.'
      ],
      statutoryRule: 'SEBI (Investment Advisers) Regulations, 2013 & SEBI Advisory on Social Media Scams (2024)',
      knowledgeCheck: {
        question: 'An adviser on Telegram promises 25% monthly return and asks for money in their personal account. What is their regulatory status?',
        options: [
          'Unregistered & Illegal — strict scam signal',
          'Permitted under SEBI high-frequency trading rules',
          'Legal if they provide PAN card copy'
        ],
        correct: 0,
        explanation: 'Any guarantee of return is illegal under SEBI norms. Transferring funds to individual accounts is a primary sign of financial fraud.'
      }
    },
    {
      id: 'm2',
      title: 'Reading Broker Ledgers & Challenging Hidden Debits',
      dim: 'Document Audit',
      time: '6m',
      done: true,
      navTarget: 'document',
      navLabel: 'Audit in Document Studio',
      overview: 'Master financial ledger statements, decipher debit/credit vouchers, and assert your right to dispute unauthorized brokerage or admin deductions.',
      takeaways: [
        'Brokers cannot debit unauthorized maintenance or admin fees not explicitly stipulated in the signed Schedule of Charges.',
        'Statutory levies like STT, Stamp Duty, and Exchange Turnover charges must match exact trades executed on that trading date.',
        'Electronic Contract Notes (ECNs) must be delivered within 24 hours of execution.'
      ],
      statutoryRule: 'SEBI Master Circular for Stock Brokers (2023) & SEBI/HO/MIRSD Circular on Levies',
      knowledgeCheck: {
        question: 'Within how much time must a broker respond with an explanation if you dispute an unauthorized ledger entry?',
        options: [
          'Within 3 to 7 working days',
          'After 90 calendar days',
          'Brokers are not obligated to explain ledger entries'
        ],
        correct: 0,
        explanation: 'Under SEBI broker regulations, intermediaries must provide computational breakdown of disputed charges within working day guidelines upon written inquiry.'
      }
    },
    {
      id: 'm3',
      title: 'SCORES 2.0 Two-Tier Escalation Matrix & SMART ODR',
      dim: 'Grievance',
      time: '5m',
      done: false,
      navTarget: 'grievance',
      navLabel: 'Draft in Grievance Studio',
      overview: 'A complete walkthrough of the two-tier dispute resolution mechanism introduced under SCORES 2.0 and the online arbitration portal SMART ODR.',
      takeaways: [
        'Tier 1: Lodge formal grievance directly with the entity compliance desk. They have a strict statutory clock of 21 calendar days.',
        'Tier 2: If unresolved or unsatisfactory, auto-escalates to SEBI Designated Bodies through SCORES 2.0.',
        'SMART ODR offers seamless online conciliation and arbitration for financial claims.'
      ],
      statutoryRule: 'SEBI Master Circular on Investor Grievance Redressal (April 2024)',
      knowledgeCheck: {
        question: 'What is the mandatory statutory timeline for an intermediary to submit an Action Taken Report (ATR) under SCORES 2.0?',
        options: [
          '21 calendar days',
          '60 business days',
          '180 days'
        ],
        correct: 0,
        explanation: 'SEBI Master Circular 2024 mandates an ATR within 21 calendar days, failing which the complaint automatically escalates to Tier-2.'
      }
    },
    {
      id: 'm4',
      title: 'Intermediary Verification & Video KYC Guidelines',
      dim: 'KYC Hygiene',
      time: '4m',
      done: false,
      navTarget: 'chat',
      navLabel: 'Ask Rights Assistant',
      overview: 'Safeguard your identity, learn how Video In-Person Verification works, and understand why Demat Debit and Pledge Instruction (DDPI) replaced power of attorney.',
      takeaways: [
        'Power of Attorney (POA) for stock trading has been replaced by limited DDPI solely for trade settlements.',
        'Always submit Masked Aadhaar (where only last 4 digits are visible) for identity verification.',
        'Verify broker UCC (Unique Client Code) and check exchange SMS/email trade alerts daily.'
      ],
      statutoryRule: 'SEBI Circular on Demat Debit and Pledge Instruction (DDPI) & KRA Guidelines',
      knowledgeCheck: {
        question: 'Can a broker insist on a general Power of Attorney (POA) to operate your trading account?',
        options: [
          'No, general POA is abolished; only limited voluntary DDPI is permitted',
          'Yes, general POA is mandatory for all Demat accounts',
          'Yes, but only for mutual fund investments'
        ],
        correct: 0,
        explanation: 'SEBI has replaced POA with DDPI to protect investors against unauthorized secondary market share transfers.'
      }
    }
  ]);

  const [activeModule, setActiveModule] = useState<typeof learningModules[0] | null>(null);
  const [moduleQuizAnswer, setModuleQuizAnswer] = useState<number | null>(null);

  const handleOpenModule = (m: typeof learningModules[0]) => {
    setActiveModule(m);
    setModuleQuizAnswer(null);
  };

  const handleCompleteModule = (moduleId: string) => {
    setLearningModules(prev => prev.map(mod => {
      if (mod.id === moduleId) {
        return { ...mod, done: true };
      }
      return mod;
    }));

    if (activeModule && activeModule.id === moduleId) {
      setActiveModule({ ...activeModule, done: true });
    }

    setSafetyScore(prev => Math.min(100, prev + 5));
    setScoreHistory(prev => [...prev, Math.min(100, safetyScore + 5)]);
  };

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
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Recommended Learning Modules
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">
            {learningModules.filter(m => m.done).length} of {learningModules.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {learningModules.map((m) => (
            <div 
              key={m.id} 
              onClick={() => handleOpenModule(m)}
              className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between gap-3 hover:border-emerald-400 hover:bg-emerald-50/20 hover:shadow-xs transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex-1 min-w-0 pr-2">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                  {m.dim} • {m.time} read
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5 group-hover:text-emerald-900 transition-colors">
                  {m.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModule(m);
                }}
                className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 transition-all flex items-center gap-1 ${
                  m.done
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-600 hover:text-white shadow-2xs'
                }`}
              >
                {m.done ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <span>Start</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Learning Module Modal Reader */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {activeModule.dim}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeModule.time} interactive read
                  </span>
                  {activeModule.done && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Completed
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeModule.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors shrink-0 ml-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
              {/* Executive Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Executive Briefing
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {activeModule.overview}
                </p>
              </div>

              {/* Core Statutory Takeaways */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Key Regulatory Protections & Checkpoints
                </h4>
                <div className="space-y-2">
                  {activeModule.takeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Citation */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-900">
                <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold">Governing Regulation: </span>
                  <span>{activeModule.statutoryRule}</span>
                </div>
              </div>

              {/* Interactive Knowledge Challenge */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Quick Knowledge Check
                  </span>
                  <span className="text-[10px] text-slate-500">Reinforce your understanding</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  {activeModule.knowledgeCheck.question}
                </p>
                <div className="space-y-1.5">
                  {activeModule.knowledgeCheck.options.map((opt, oIdx) => {
                    const isSelected = moduleQuizAnswer === oIdx;
                    const isCorrect = oIdx === activeModule.knowledgeCheck.correct;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setModuleQuizAnswer(oIdx)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all ${
                          moduleQuizAnswer !== null
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                              : isSelected
                                ? 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-white border-slate-200 opacity-60 text-slate-600'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {moduleQuizAnswer !== null && isCorrect && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {moduleQuizAnswer !== null && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                    <strong>Explanation: </strong>{activeModule.knowledgeCheck.explanation}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {onNavigate && activeModule.navTarget && (
                  <button
                    onClick={() => {
                      const target = activeModule.navTarget;
                      setActiveModule(null);
                      onNavigate(target);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <span>{activeModule.navLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setActiveModule(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
                {!activeModule.done ? (
                  <button
                    onClick={() => handleCompleteModule(activeModule.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete (+5 Score)</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
