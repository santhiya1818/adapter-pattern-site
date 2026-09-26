import React from 'react';
import { Layers, ArrowUp } from 'lucide-react';
import { FLOW_SECTIONS } from '../data/adapterData';

interface FooterProps {
  onScrollToTop: () => void;
  onNavigate: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Adapter Design Pattern Reference</span>
            </div>
            <p className="text-slate-400 max-w-md">
              A comprehensive architectural study based on the Gang of Four (Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides) catalog.
            </p>
          </div>

          <button
            onClick={onScrollToTop}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors w-fit"
          >
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Top</span>
          </button>
        </div>

        {/* Quick jump flow index */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FLOW_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onNavigate(sec.id)}
              className="text-left text-slate-400 hover:text-cyan-400 transition-colors py-1 flex items-baseline gap-1.5"
            >
              <span className="font-mono text-[10px] text-slate-600">{sec.number}.</span>
              <span className="truncate">{sec.title}</span>
            </button>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-600">
          <span>Design Patterns: Elements of Reusable Object-Oriented Software</span>
          <span>Open Educational Reference Guide</span>
        </div>
      </div>
    </footer>
  );
};
