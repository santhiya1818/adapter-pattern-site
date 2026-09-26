import React, { useState } from 'react';
import { Check, AlertTriangle, HelpCircle } from 'lucide-react';

export const ApplicabilitySection: React.FC = () => {
  const [evaluations, setEvaluations] = useState({
    existingClassMismatch: true,
    reusableComponent: true,
    subclassProliferation: false
  });

  const getVerdict = () => {
    if (evaluations.existingClassMismatch && evaluations.subclassProliferation) {
      return {
        recommendation: 'Highly Recommended: Object Adapter Pattern',
        reason: 'You need to adapt an existing class and avoid subclass proliferation across multiple variants. Object Adapter with composition is the optimal architectural choice.',
        isPositive: true
      };
    }
    if (evaluations.existingClassMismatch) {
      return {
        recommendation: 'Recommended: Adapter Pattern',
        reason: 'Classic textbook applicability. Use an Adapter to bridge the incompatible signatures without modifying third-party or legacy code.',
        isPositive: true
      };
    }
    if (!evaluations.existingClassMismatch && !evaluations.reusableComponent) {
      return {
        recommendation: 'Not Recommended: Refactoring or Direct Invocation',
        reason: 'If you control both caller and callee interfaces, it is cleaner to align their interfaces directly rather than introducing unnecessary indirection layers.',
        isPositive: false
      };
    }
    return {
      recommendation: 'Candidate: Pluggable Adapter or Interface Alignment',
      reason: 'Evaluate whether an adapter or a simple callback/strategy fits best.',
      isPositive: true
    };
  };

  const verdict = getVerdict();

  return (
    <section id="applicability" className="scroll-mt-32 py-16 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">04</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Applicability</h2>
          </div>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            The Gang of Four defines three specific circumstances under which the Adapter pattern should be applied.
          </p>
        </div>

        {/* 3 GoF Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-cyan-400">Condition 01</span>
              <h3 className="text-base font-bold text-white">Incompatible Existing Class</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You want to use an existing class, and its interface does not match the one you need. You cannot modify the existing class because it comes from a third-party library, legacy code base, or frozen binary SDK.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Applies to: Class & Object Adapters
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-cyan-400">Condition 02</span>
              <h3 className="text-base font-bold text-white">Reusable Pluggable Component</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You want to create a reusable class that cooperates with unrelated or unforeseen classes—classes that don’t necessarily have compatible interfaces and might not be designed at the same time.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Applies to: Pluggable Adapters
            </div>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold text-cyan-400">Condition 03</span>
              <h3 className="text-base font-bold text-white">Subclass Hierarchy Adaptation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You need to adapt several existing subclasses, but it is impractical to adapt their interface by subclassing every one. An Object Adapter can adapt the interface of its parent class via composition.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Applies strictly to: Object Adapter
            </div>
          </div>
        </div>

        {/* When NOT to use & Interactive Decision Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>When NOT to Use the Adapter Pattern</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <li className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-slate-100 block mb-0.5">When you own both caller and callee:</strong>
                If you have full source control and both systems are early in development, simply align the interfaces directly. Adding an adapter introduces needless indirection.
              </li>
              <li className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-slate-100 block mb-0.5">When behavior itself must change:</strong>
                Adapters only bridge interfaces and translate parameters; they should not inject complex business algorithms. Use Decorator or Strategy if business semantics are expanding.
              </li>
              <li className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <strong className="text-slate-100 block mb-0.5">When you need a simplified facade over 10+ classes:</strong>
                If your goal is to present a simpler higher-level interface over a large subsystem, choose the <strong className="text-cyan-400">Facade Pattern</strong> instead.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Interactive Applicability Evaluator</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Design Assistant</span>
            </div>

            <p className="text-xs text-slate-300">
              Answer the architecture questions below to verify whether an Adapter pattern matches your engineering constraints:
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={evaluations.existingClassMismatch}
                  onChange={(e) => setEvaluations({ ...evaluations, existingClassMismatch: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Existing Class Interface Mismatch</span>
                  <span className="text-[11px] text-slate-400">Do you have an existing class/library whose interface does not match what your client expects?</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={evaluations.reusableComponent}
                  onChange={(e) => setEvaluations({ ...evaluations, reusableComponent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Reusable / Third-Party Isolation</span>
                  <span className="text-[11px] text-slate-400">Must the client stay completely decoupled from vendor-specific libraries?</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={evaluations.subclassProliferation}
                  onChange={(e) => setEvaluations({ ...evaluations, subclassProliferation: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">Multi-Subclass Inheritance Strain</span>
                  <span className="text-[11px] text-slate-400">Do you have multiple subclasses of the Adaptee that would otherwise require writing duplicate adapter subclasses?</span>
                </div>
              </label>
            </div>

            <div className={`p-4 rounded-lg border text-xs space-y-1 ${
              verdict.isPositive ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Check className={`w-4 h-4 ${verdict.isPositive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="font-bold text-white">{verdict.recommendation}</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">{verdict.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
