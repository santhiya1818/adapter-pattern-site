import React from 'react';
import { FLOW_SECTIONS } from '../data/adapterData';

interface FlowScrubberProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export const FlowScrubber: React.FC<FlowScrubberProps> = ({ activeSection, onSelectSection }) => {
  return (
    <div className="bg-slate-900/80 border-y border-slate-800 backdrop-blur-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-6 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 md:gap-2">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold shrink-0 mr-2 flex items-center gap-1">
          GoF Flow:
        </span>
        {FLOW_SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`text-xs px-2.5 py-1.5 rounded transition-all whitespace-nowrap text-left flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-600'}`}>
                {sec.number}
              </span>
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
