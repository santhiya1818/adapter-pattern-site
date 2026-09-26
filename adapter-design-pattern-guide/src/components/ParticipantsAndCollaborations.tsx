import React, { useState } from 'react';
import { Target, Users, Server, Shuffle, Play, Pause, SkipForward, RotateCcw, Cpu, Layers } from 'lucide-react';

interface ParticipantDetail {
  id: string;
  name: string;
  role: string;
  gofRole: string;
  responsibilities: string[];
  interfaceSignature: string;
  icon: React.ReactNode;
}

const PARTICIPANTS: ParticipantDetail[] = [
  {
    id: 'target',
    name: 'Target',
    role: 'Domain Contract',
    gofRole: 'Defines the domain-specific interface that Client uses.',
    responsibilities: [
      'Specifies uniform method signatures (e.g., processPayment, renderShape).',
      'Abstracts away vendor-specific quirks and infrastructure details.',
      'Enables client polymorphism; client code only imports and depends on this interface.'
    ],
    interfaceSignature: `interface Target {\n  request(): ResponsePayload;\n}`,
    icon: <Target className="w-5 h-5 text-cyan-400" />
  },
  {
    id: 'client',
    name: 'Client',
    role: 'Consumer / Caller',
    gofRole: 'Collaborates with objects conforming to the Target interface.',
    responsibilities: [
      'Executes high-level business workflow.',
      'Remains completely agnostic of whether an Adapter or direct implementation is running.',
      'Protected from third-party vendor churn and library breaking changes.'
    ],
    interfaceSignature: `function clientCode(target: Target) {\n  const result = target.request();\n}`,
    icon: <Users className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'adapter',
    name: 'Adapter',
    role: 'Mediator / Translator',
    gofRole: 'Adapts the interface of Adaptee to the Target interface.',
    responsibilities: [
      'Implements (or inherits) the Target interface.',
      'Maintains an internal reference to the Adaptee instance (in Object Adapter).',
      'Translates incoming parameter types, unit scales, and error codes into Adaptee’s dialect.',
      'Unpacks Adaptee return payloads into Target response schemas.'
    ],
    interfaceSignature: `class Adapter implements Target {\n  constructor(private adaptee: Adaptee) {}\n  request() {\n    return this.translate(this.adaptee.specificRequest());\n  }\n}`,
    icon: <Shuffle className="w-5 h-5 text-amber-400" />
  },
  {
    id: 'adaptee',
    name: 'Adaptee',
    role: 'Legacy / External Service',
    gofRole: 'Defines an existing interface that needs adapting.',
    responsibilities: [
      'Contains useful, battle-tested domain logic.',
      'Cannot be easily modified (compiled DLL, npm package, legacy database driver).',
      'Exposes an incompatible API signature (e.g., specificRequest).'
    ],
    interfaceSignature: `class Adaptee {\n  specificRequest(legacyFlag: number): RawBinary {\n    /* Proprietary logic */\n  }\n}`,
    icon: <Server className="w-5 h-5 text-emerald-400" />
  }
];

export const ParticipantsAndCollaborations: React.FC = () => {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantDetail>(PARTICIPANTS[0]);
  const [collabStep, setCollabStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Stepper timeline
  const COLLAB_STEPS = [
    {
      title: 'Initiate Request',
      from: 'Client',
      to: 'Adapter (Target interface)',
      action: 'Client calls adapter.request(args)',
      detail: 'Client executes standard business method expecting standard domain types (e.g. processPayment(50.00, "USD")).'
    },
    {
      title: 'Argument & Schema Translation',
      from: 'Adapter Internal',
      to: 'Adapter Pipeline',
      action: 'Adapter maps input data to Adaptee format',
      detail: 'Adapter converts 50.00 USD to 5000 integer cents, looks up vendor authentication headers, and formats the payload.'
    },
    {
      title: 'Delegate to Incompatible API',
      from: 'Adapter',
      to: 'Adaptee',
      action: 'Adapter calls adaptee.specificRequest(transformedArgs)',
      detail: 'The legacy vendor method executeCharge(5000, 840, token) is invoked. Adaptee has no awareness of the Client.'
    },
    {
      title: 'Raw Processing & Execution',
      from: 'Adaptee',
      to: 'Adapter',
      action: 'Adaptee returns vendor raw receipt',
      detail: 'Adaptee produces vendor-specific response structure: { charge_id: "ch_981", status: "succeeded", fee_cents: 145 }.'
    },
    {
      title: 'Response Normalization & Delivery',
      from: 'Adapter',
      to: 'Client',
      action: 'Adapter translates receipt into Target schema & returns to Client',
      detail: 'Adapter constructs uniform PaymentResult, normalizes status to boolean true, and hands clean result back to Client.'
    }
  ];

  const handleNextStep = () => {
    setCollabStep((prev) => (prev < COLLAB_STEPS.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setCollabStep((prev) => (prev > 0 ? prev - 1 : COLLAB_STEPS.length - 1));
  };

  const handleResetStep = () => {
    setIsPlaying(false);
    setCollabStep(0);
  };

  return (
    <div className="py-16 border-b border-slate-800 space-y-20">
      {/* 06. Participants */}
      <section id="participants" className="scroll-mt-32 max-w-7xl mx-auto px-6 space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">06</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Participants</h2>
          </div>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            The Adapter pattern establishes a clean quartet of architectural participants. Click on any participant to inspect their strict contract and implementation code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Participant Selector Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {PARTICIPANTS.map((part) => {
              const isSelected = selectedParticipant.id === part.id;
              return (
                <button
                  key={part.id}
                  onClick={() => setSelectedParticipant(part)}
                  className={`text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {part.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{part.name}</span>
                      <span className="text-[11px] font-mono text-cyan-400">({part.role})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{part.gofRole}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Participant Deep Dive Inspector */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {selectedParticipant.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedParticipant.name} Contract</h3>
                  <span className="text-xs text-cyan-400 font-mono">{selectedParticipant.role}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-mono">GoF Specification</span>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-1">
                  Gang of Four Formal Definition
                </span>
                <p className="text-sm text-slate-200 italic font-medium">
                  &ldquo;{selectedParticipant.gofRole}&rdquo;
                </p>
              </div>

              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-2">
                  Architectural Responsibilities
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {selectedParticipant.responsibilities.map((resp, idx) => (
                    <li key={idx} className="leading-relaxed">{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block mb-2">
                  Structural Code Shape
                </span>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto">
                  {selectedParticipant.interfaceSignature}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07. Collaborations */}
      <section id="collaborations" className="scroll-mt-32 max-w-7xl mx-auto px-6 space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">07</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Collaborations</h2>
          </div>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            The GoF defines the runtime collaboration: <strong className="text-white">Clients call operations on an Adapter instance. In turn, the adapter calls Adaptee operations that carry out the request.</strong>
          </p>
        </div>

        {/* Interactive Sequence Stepper */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                Collaboration Sequence Step {collabStep + 1} of {COLLAB_STEPS.length}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{COLLAB_STEPS[collabStep].title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevStep}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextStep}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors flex items-center gap-1"
              >
                <span>Next Step</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetStep}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                title="Reset steps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step Progress Visual Bar */}
          <div className="grid grid-cols-5 gap-2">
            {COLLAB_STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCollabStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === collabStep
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                    : idx < collabStep
                    ? 'bg-cyan-800'
                    : 'bg-slate-800'
                }`}
                title={`Jump to ${s.title}`}
              />
            ))}
          </div>

          {/* Dynamic Sequence Flow Canvas */}
          <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Caller:</span>
                <span className="text-blue-300 font-bold">{COLLAB_STEPS[collabStep].from}</span>
              </div>
              <span className="text-cyan-400 text-base">➔</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Receiver:</span>
                <span className="text-emerald-300 font-bold">{COLLAB_STEPS[collabStep].to}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
              {COLLAB_STEPS[collabStep].action}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {COLLAB_STEPS[collabStep].detail}
            </p>
          </div>
        </div>
      </section>

      {/* 08. Implementation */}
      <section id="implementation" className="scroll-mt-32 max-w-7xl mx-auto px-6 space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">08</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Implementation</h2>
          </div>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            The Gang of Four highlights three critical practical nuances and implementation challenges when constructing adapters in production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>1. Degree of Adapting</span>
            </div>
            <h3 className="text-base font-bold text-white">Narrow vs. Wide Translation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              How much work should the Adapter perform?
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li><strong className="text-slate-200">Narrow adaptation:</strong> Simply changes method names and reorders parameters (e.g. pay() ➔ executeCharge()).</li>
              <li><strong className="text-slate-200">Wide adaptation:</strong> Supports a completely disparate set of operations, converts coordinate systems, transforms XML trees to JSON objects, or translates synchronous calls into asynchronous promises.</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Shuffle className="w-4 h-4" />
              <span>2. Pluggable Adapters</span>
            </div>
            <h3 className="text-base font-bold text-white">Dynamic Adaptee Binding</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Classes are designed with interface adaptation built into them from the start:
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li><strong className="text-slate-200">Abstract Operations:</strong> Define abstract methods that subclasses override to invoke different adaptees.</li>
              <li><strong className="text-slate-200">Delegate Objects:</strong> The adapter forwards requests to a delegate block/lambda, enabling dynamic binding at runtime.</li>
              <li><strong className="text-slate-200">Parameterized Adapters:</strong> Pass method references or handler functions directly in the constructor.</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>3. Two-Way Adapters</span>
            </div>
            <h3 className="text-base font-bold text-white">Bidirectional Transparency</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When two different clients view an object from two distinct interfaces:
            </p>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>A <strong className="text-slate-200">Two-Way Adapter</strong> implements both interfaces simultaneously.</li>
              <li>System A can view it as a TargetA, while System B can view it as a TargetB.</li>
              <li>Useful when integrating two existing systems where neither system can be modified or subordinated to the other.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
