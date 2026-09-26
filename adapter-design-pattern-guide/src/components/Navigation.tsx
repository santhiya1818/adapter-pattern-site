import React from 'react';
import { Layers, Play } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#intent"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('intent');
          }}
          className="text-base font-bold tracking-tight text-white flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Adapter Pattern</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('intent')}
            className={`transition-colors hover:text-white ${activeSection === 'intent' || activeSection === 'motivation' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Intent & Metaphor
          </button>
          <button
            onClick={() => onNavigate('structure')}
            className={`transition-colors hover:text-white ${activeSection === 'structure' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            UML Structure
          </button>
          <button
            onClick={() => onNavigate('participants')}
            className={`transition-colors hover:text-white ${activeSection === 'participants' || activeSection === 'collaborations' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Participants & Flow
          </button>
          <button
            onClick={() => onNavigate('sample-code')}
            className={`transition-colors hover:text-white ${activeSection === 'sample-code' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Code Lab
          </button>
          <button
            onClick={() => onNavigate('related-patterns')}
            className={`transition-colors hover:text-white ${activeSection === 'related-patterns' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            Command & Relatives
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('sample-code')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Live Sandbox</span>
          </button>
        </div>
      </div>
    </header>
  );
};
