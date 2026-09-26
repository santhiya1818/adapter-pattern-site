import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, BookOpen, Plug, ShieldAlert } from 'lucide-react';
import heroImg from '../assets/images/hero_adapter_pattern_1790404452403.jpg';
import socketImg from '../assets/images/metaphor_socket_adapter_1790404471259.jpg';

interface HeroAndIntentProps {
  onExploreStructure: () => void;
  onExploreCode: () => void;
}

export const HeroAndIntent: React.FC<HeroAndIntentProps> = ({ onExploreStructure, onExploreCode }) => {
  const [activeMetaphorTab, setActiveMetaphorTab] = useState<'physical' | 'software'>('physical');
  const [showWithAdapter, setShowWithAdapter] = useState<boolean>(true);

  return (
    <section className="relative pt-8 pb-16 border-b border-slate-800">
      {/* Editorial Hero Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-wide">
              <span>Gang of Four (GoF)</span>
              <span aria-hidden="true">·</span>
              <span>Structural Design Pattern</span>
              <span aria-hidden="true">·</span>
              <span>Interface Compatibility</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
              The Adapter Pattern
            </h1>

            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed text-pretty">
              Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn’t otherwise because of incompatible interfaces.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreStructure}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
              >
                <span>Explore Interactive UML</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreCode}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Multi-Language Code Lab</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src={heroImg}
                alt="Architectural visualization of the Adapter Pattern bridging incompatible sockets"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 text-xs text-slate-300 font-mono flex items-center justify-between">
                <span>Figure 1: Modular Interface Bridge</span>
                <span className="text-cyan-400">Structural Contract</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* 01. Intent */}
        <div id="intent" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">01</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Intent</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <p className="text-base text-slate-200 leading-relaxed italic border-l-2 border-cyan-400 pl-4">
                &ldquo;Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn’t otherwise because of incompatible interfaces.&rdquo;
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                In object-oriented architectures, software components and libraries frequently declare mismatched APIs. Rather than editing existing classes—which violates the <strong className="text-slate-200 font-semibold">Open/Closed Principle</strong> and is often impossible for third-party or compiled vendor binaries—the Adapter acts as an intermediary translator that captures the client’s request, reformats or translates parameters, and invokes the legacy or foreign class.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-semibold block mb-1">Primary Problem Solved</span>
                  Incompatible method names, mismatched argument types, divergent data schemas, or coordinate systems.
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-cyan-400 font-semibold block mb-1">Architectural Guarantee</span>
                  Leaves both Client and Adaptee unmodified while enabling zero-friction interoperability.
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">Key Principle</span>
                <h3 className="text-base font-bold text-white mb-2">Target vs. Adaptee Mismatch</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  The client expects a contract specified by the Target interface. The existing component (Adaptee) provides functionality with a non-matching signature.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300">
                <span className="font-semibold block mb-0.5">Core Rule:</span>
                Never mutate the caller or the callee; create a mediator that adheres to Target and encapsulates Adaptee.
              </div>
            </div>
          </div>
        </div>

        {/* 02. Also Known As */}
        <div id="also-known-as" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">02</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Also Known As</h2>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xl md:text-2xl font-bold text-cyan-300 font-mono tracking-tight">Wrapper</span>
                <span className="text-xs text-slate-400 ml-3">Historical alias established in GoF 1994</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Structural Category</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed">
              <p>
                The Adapter pattern is famously known as the <strong className="text-white">Wrapper</strong> because it wraps an existing object with a new interface. Just as a physical wrapper encloses an item to alter its exterior while preserving its contents, a software Wrapper encloses an incompatible object to present a familiar API to callers.
              </p>
              <div className="p-4 rounded-lg bg-slate-950/50 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Disambiguation: Adapter vs. Decorator</span>
                </div>
                <p className="text-slate-400 leading-normal">
                  Both patterns are colloquially referred to as &ldquo;wrappers.&rdquo; However:
                </p>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  <li><strong className="text-cyan-400">Adapter:</strong> Changes the interface to enable interoperability.</li>
                  <li><strong className="text-amber-300">Decorator:</strong> Keeps the interface unchanged and adds behavior dynamically.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 03. Motivation */}
        <div id="motivation" className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">03</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Motivation</h2>
          </div>

          <div className="space-y-8">
            <p className="text-sm md:text-base text-slate-300 max-w-4xl leading-relaxed">
              Consider a software drawing editor or e-commerce platform that must integrate an off-the-shelf component. The component provides all necessary capabilities, but its method names, expected data types, or calling sequences do not conform to your application’s uniform interfaces.
            </p>

            {/* Metaphor switcher tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-lg w-fit border border-slate-800">
              <button
                onClick={() => setActiveMetaphorTab('physical')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeMetaphorTab === 'physical'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Physical Metaphor: Travel Power Adapter</span>
              </button>
              <button
                onClick={() => setActiveMetaphorTab('software')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeMetaphorTab === 'software'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Software Scenario: Payment Gateway</span>
              </button>
            </div>

            {activeMetaphorTab === 'physical' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="lg:col-span-5">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={socketImg}
                      alt="Travel socket adapter plugging into an international wall outlet"
                      referrerPolicy="no-referrer"
                      className="w-full h-64 object-cover object-center"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-300 font-mono">
                      UK 3-Pin Plug ➔ Universal Socket Adapter ➔ EU Wall Outlet
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl font-bold text-white">The International Travel Plug Analogy</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    When traveling from the United Kingdom to Continental Europe, your laptop charger has a 3-pin rectangular UK plug, while the hotel wall socket accepts two round pins.
                  </p>
                  <div className="space-y-2 text-xs text-slate-300 font-mono">
                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Client / Consumer:</span>
                      <span className="text-cyan-300">Your Laptop Power Brick (Requires UK 230V socket)</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Target Interface:</span>
                      <span className="text-cyan-300">UK Standard 3-Pin Socket Type G</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Adaptee (Existing Environment):</span>
                      <span className="text-cyan-300">European Wall Socket Type C / Schuko</span>
                    </div>
                    <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-cyan-200">
                      <span className="font-semibold">Adapter:</span>
                      <span>The physical plastic travel block converting Type C prongs to Type G female holes</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Neither the laptop charger nor the hotel wall wiring is re-engineered or torn apart. The adapter seamlessly bridges physical geometries.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Software Scenario: Integrating a Legacy Billing System</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Toggle below to see the compilation failure without an adapter vs. clean execution with an adapter.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                    <button
                      onClick={() => setShowWithAdapter(false)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        !showWithAdapter ? 'bg-red-950 text-red-300 border border-red-800/60' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Without Adapter (Broken)
                    </button>
                    <button
                      onClick={() => setShowWithAdapter(true)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        showWithAdapter ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      With Adapter (Compatible)
                    </button>
                  </div>
                </div>

                {!showWithAdapter ? (
                  <div className="p-5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <XCircle className="w-4 h-4" />
                      <span>Type Incompatibility Error: Cannot invoke incompatible API directly</span>
                    </div>
                    <pre className="text-red-200/90 overflow-x-auto p-3 bg-red-950/40 rounded border border-red-900/30">
{`// Client expects:
function checkout(processor: PaymentGateway) {
  processor.pay(49.99, "USD"); // <-- Target Method
}

// Third-Party Legacy Jar only has:
legacyStripe.chargeCents(4999, 840, "auth_token_99"); // <-- Incompatible signature!

// COMPILER ERROR:
// Argument of type 'LegacyStripe' is not assignable to parameter of type 'PaymentGateway'.
// Property 'pay' is missing in type 'LegacyStripe'.`}
                    </pre>
                    <p className="text-slate-400 font-sans text-xs">
                      The client code cannot compile because the vendor library uses cents instead of dollars, numeric currency codes instead of ISO codes, and a different method name.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-lg bg-cyan-950/20 border border-cyan-900/40 space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolved with Adapter: Clean Polymorphic Dispatch</span>
                    </div>
                    <pre className="text-cyan-200/90 overflow-x-auto p-3 bg-cyan-950/40 rounded border border-cyan-900/30">
{`class StripeAdapter implements PaymentGateway {
  constructor(private legacyStripe: LegacyStripe, private token: string) {}

  pay(amountDollars: number, currency: string): boolean {
    const cents = Math.round(amountDollars * 100);
    const isoNumeric = currency === "USD" ? 840 : 978;
    return this.legacyStripe.chargeCents(cents, isoNumeric, this.token);
  }
}

// Client stays clean and decoupled:
const adapter = new StripeAdapter(new LegacyStripe(), "secret_token");
checkout(adapter); // Success! Matches PaymentGateway contract.`}
                    </pre>
                    <p className="text-slate-400 font-sans text-xs">
                      The adapter encapsulates data unit conversion ($ to cents), argument synthesis, and method name bridging without modifying a single line of client business logic.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
