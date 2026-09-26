import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Box, GitFork } from 'lucide-react';

export const StructureVisualizer: React.FC = () => {
  const [adapterType, setAdapterType] = useState<'object' | 'class'>('object');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      if (activeStep < 4) {
        timer = setTimeout(() => {
          setActiveStep((prev) => prev + 1);
        }, 1100);
      } else {
        timer = setTimeout(() => {
          setIsSimulating(false);
          setActiveStep(0);
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [isSimulating, activeStep]);

  const handleStartSimulation = () => {
    setActiveStep(1);
    setIsSimulating(true);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setActiveStep(0);
  };

  return (
    <section id="structure" className="scroll-mt-32 py-16 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold text-cyan-400">05</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Structure</h2>
            </div>
            <p className="text-slate-300 max-w-3xl leading-relaxed">
              The GoF specification defines two distinct architectural structures: <strong className="text-white">Object Adapter</strong> (relying on object composition) and <strong className="text-white">Class Adapter</strong> (relying on multiple inheritance).
            </p>
          </div>

          {/* Segmented control for Object vs Class adapter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => {
                setAdapterType('object');
                handleReset();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                adapterType === 'object'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Object Adapter (Composition)</span>
            </button>
            <button
              onClick={() => {
                setAdapterType('class');
                handleReset();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                adapterType === 'class'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Class Adapter (Inheritance)</span>
            </button>
          </div>
        </div>

        {/* Interactive Diagram Stage */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">
                {adapterType === 'object' ? 'Object Adapter (Preferred in 95% of Modern OO)' : 'Class Adapter (Multiple Inheritance / C++)'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {adapterType === 'object' ? 'HAS-A Relationship' : 'IS-A + Implements'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:pointer-events-none rounded-md transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Simulating Message Flow...' : 'Simulate Call Flow'}</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG UML Canvas */}
          <div className="w-full overflow-x-auto py-6 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
            <svg viewBox="0 0 920 360" className="w-full min-w-[760px] h-auto select-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
                <marker id="arrow-white" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
                <marker id="inheritance" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                  <polygon points="0,0 12,6 0,12" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                </marker>
                <marker id="realization" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="8" markerHeight="8" orient="auto">
                  <polygon points="0,0 12,6 0,12" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                </marker>
              </defs>

              {/* Grid backdrop */}
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* NODE 1: Client */}
              <g
                transform="translate(40, 50)"
                onMouseEnter={() => setHoveredNode('Client')}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-opacity"
              >
                <rect
                  width="140"
                  height="80"
                  rx="6"
                  className={`transition-all duration-300 ${
                    activeStep === 1
                      ? 'fill-cyan-950/80 stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'fill-slate-900 stroke-slate-700 stroke-1'
                  }`}
                />
                <text x="70" y="32" textAnchor="middle" className="fill-white font-bold text-xs font-mono">
                  Client
                </text>
                <line x1="0" y1="46" x2="140" y2="46" stroke="#334155" strokeWidth="1" />
                <text x="14" y="65" className="fill-slate-400 text-[11px] font-mono">
                  doWork()
                </text>
              </g>

              {/* Connection: Client -> Target */}
              <path
                d="M 180 90 L 290 90"
                stroke={activeStep >= 1 ? '#06b6d4' : '#475569'}
                strokeWidth={activeStep >= 1 ? '2.5' : '1.5'}
                markerEnd="url(#arrow)"
                className="transition-all duration-300"
              />
              <text x="235" y="80" textAnchor="middle" className="fill-slate-400 text-[10px] font-mono">
                calls
              </text>

              {/* NODE 2: Target Interface */}
              <g
                transform="translate(290, 40)"
                onMouseEnter={() => setHoveredNode('Target')}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-opacity"
              >
                <rect
                  width="180"
                  height="100"
                  rx="6"
                  className={`transition-all duration-300 ${
                    activeStep === 1 || activeStep === 2
                      ? 'fill-cyan-950/80 stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'fill-slate-900 stroke-slate-700 stroke-1'
                  }`}
                />
                <text x="90" y="24" textAnchor="middle" className="fill-cyan-400 text-[10px] font-mono italic">
                  &laquo;interface&raquo;
                </text>
                <text x="90" y="42" textAnchor="middle" className="fill-white font-bold text-xs font-mono">
                  Target
                </text>
                <line x1="0" y1="56" x2="180" y2="56" stroke="#334155" strokeWidth="1" />
                <text x="14" y="78" className="fill-cyan-300 text-[11px] font-mono">
                  + Request(): void
                </text>
              </g>

              {/* NODE 3: Adapter */}
              <g
                transform="translate(290, 210)"
                onMouseEnter={() => setHoveredNode('Adapter')}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-opacity"
              >
                <rect
                  width="200"
                  height="120"
                  rx="6"
                  className={`transition-all duration-300 ${
                    activeStep === 2 || activeStep === 4
                      ? 'fill-cyan-950/80 stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'fill-slate-900 stroke-slate-700 stroke-1'
                  }`}
                />
                <text x="100" y="28" textAnchor="middle" className="fill-white font-bold text-xs font-mono">
                  Adapter
                </text>
                <line x1="0" y1="40" x2="200" y2="40" stroke="#334155" strokeWidth="1" />
                {adapterType === 'object' && (
                  <>
                    <text x="14" y="58" className="fill-slate-400 text-[10px] font-mono">
                      - adaptee: Adaptee
                    </text>
                    <line x1="0" y1="68" x2="200" y2="68" stroke="#334155" strokeWidth="1" />
                  </>
                )}
                <text x="14" y={adapterType === 'object' ? '88' : '65'} className="fill-cyan-300 text-[11px] font-mono">
                  + Request(): void
                </text>
                <text x="14" y={adapterType === 'object' ? '106' : '85'} className="fill-slate-400 text-[10px] font-mono italic">
                  &#123; adaptee.SpecificRequest() &#125;
                </text>
              </g>

              {/* Relationship: Adapter implements/subclasses Target */}
              <path
                d="M 380 210 L 380 148"
                stroke={activeStep >= 2 ? '#06b6d4' : '#64748b'}
                strokeWidth="1.5"
                strokeDasharray={adapterType === 'object' ? '4,4' : 'none'}
                markerEnd="url(#realization)"
              />
              <text x="395" y="180" className="fill-slate-400 text-[9px] font-mono">
                {adapterType === 'object' ? 'implements' : 'public inherits'}
              </text>

              {/* NODE 4: Adaptee */}
              <g
                transform="translate(640, 210)"
                onMouseEnter={() => setHoveredNode('Adaptee')}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-opacity"
              >
                <rect
                  width="220"
                  height="110"
                  rx="6"
                  className={`transition-all duration-300 ${
                    activeStep === 3
                      ? 'fill-cyan-950/80 stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'fill-slate-900 stroke-slate-700 stroke-1'
                  }`}
                />
                <text x="110" y="28" textAnchor="middle" className="fill-white font-bold text-xs font-mono">
                  Adaptee (Existing Class)
                </text>
                <line x1="0" y1="42" x2="220" y2="42" stroke="#334155" strokeWidth="1" />
                <text x="14" y="64" className="fill-slate-300 text-[11px] font-mono">
                  + SpecificRequest(): void
                </text>
                <text x="14" y="86" className="fill-slate-500 text-[10px] font-mono">
                  // Incompatible Signature
                </text>
              </g>

              {/* Relationship: Adapter to Adaptee */}
              {adapterType === 'object' ? (
                <>
                  {/* Composition / Association arrow */}
                  <path
                    d="M 490 265 L 630 265"
                    stroke={activeStep === 3 ? '#06b6d4' : '#475569'}
                    strokeWidth={activeStep === 3 ? '2.5' : '1.5'}
                    markerEnd="url(#arrow)"
                    className="transition-all duration-300"
                  />
                  <text x="560" y="255" textAnchor="middle" className="fill-slate-400 text-[10px] font-mono">
                    adaptee (holds ref)
                  </text>
                </>
              ) : (
                <>
                  {/* Private inheritance line for Class Adapter */}
                  <path
                    d="M 490 265 L 630 265"
                    stroke={activeStep === 3 ? '#06b6d4' : '#475569'}
                    strokeWidth="1.5"
                    markerEnd="url(#inheritance)"
                  />
                  <text x="560" y="255" textAnchor="middle" className="fill-slate-400 text-[9px] font-mono">
                    private inherits
                  </text>
                </>
              )}

              {/* Animated Message Flow Packet */}
              {activeStep === 1 && (
                <circle cx="235" cy="90" r="5" fill="#22d3ee" className="animate-ping" />
              )}
              {activeStep === 2 && (
                <circle cx="380" cy="180" r="5" fill="#22d3ee" className="animate-ping" />
              )}
              {activeStep === 3 && (
                <circle cx="560" cy="265" r="5" fill="#22d3ee" className="animate-ping" />
              )}
            </svg>
          </div>

          {/* Active step explanation during simulation */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-bold">
                {activeStep === 0 && 'Ready to trace message pipeline'}
                {activeStep === 1 && 'Step 1: Client invokes Request() on Target'}
                {activeStep === 2 && 'Step 2: Adapter intercepts call, converts parameters'}
                {activeStep === 3 && 'Step 3: Adapter delegates to Adaptee.SpecificRequest()'}
                {activeStep === 4 && 'Step 4: Adaptee responds; Adapter converts output to Client'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Hovered: {hoveredNode || 'None'}
            </span>
          </div>

          {/* Deep Architectural Comparison Table */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white mb-3">GoF Analysis: Object Adapter vs. Class Adapter</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Evaluation Dimension</th>
                    <th className="py-2.5 px-4 text-cyan-400">Object Adapter (Composition)</th>
                    <th className="py-2.5 px-4 text-slate-300">Class Adapter (Inheritance)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">Subclass Adaptation</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-medium">Adapts Adaptee AND all its subclasses simultaneously</td>
                    <td className="py-2.5 px-4 text-amber-400 font-medium">Can only adapt a single statically bound class</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">Overriding Adaptee Behavior</td>
                    <td className="py-2.5 px-4 text-amber-400 font-medium">Difficult; requires subclassing the Adaptee separately</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-medium">Trivial; can override virtual methods directly</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">Language Compatibility</td>
                    <td className="py-2.5 px-4 text-emerald-400 font-medium">Universal (TypeScript, Java, C#, Python, Go, Rust)</td>
                    <td className="py-2.5 px-4 text-amber-400 font-medium">Requires Multiple Inheritance (C++, Python); Java/C# need interface hacks</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">Object Pointer Overhead</td>
                    <td className="py-2.5 px-4">Requires 1 internal pointer/reference to Adaptee</td>
                    <td className="py-2.5 px-4">Zero extra pointer indirection; single object identity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
