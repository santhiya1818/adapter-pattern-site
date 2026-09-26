import React, { useState } from 'react';
import { Terminal, Undo, Play, RotateCcw, Check, Sparkles, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { RELATED_PATTERNS, PATTERN_QUIZ_SCENARIOS } from '../data/adapterData';

// Simulated Legacy Drone API (The Adaptee)
class LegacyDroneHardware {
  public azimuth: number = 0;
  public altitudeMeters: number = 0;
  public cameraShutterTriggered: boolean = false;

  public rotateServoRaw(angleDeg: number): string {
    this.azimuth = (this.azimuth + angleDeg) % 360;
    return `[Hardware] Servo rotated by ${angleDeg}°. Current Azimuth: ${this.azimuth}°`;
  }

  public spinLiftRotors(rpmDelta: number, targetAltitude: number): string {
    this.altitudeMeters = targetAltitude;
    return `[Hardware] Rotors spin delta ${rpmDelta} RPM. Altitude reached: ${this.altitudeMeters}m`;
  }

  public pulseOptocouplerShutter(): string {
    this.cameraShutterTriggered = true;
    return `[Hardware] Shutter optocoupler pulsed. Frame captured.`;
  }
}

interface CommandItem {
  id: string;
  name: string;
  description: string;
  execute: () => string;
  undo: () => string;
}

export const CommandPatternDeepDive: React.FC = () => {
  // Related patterns tab
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(0);
  const selectedPattern = RELATED_PATTERNS[selectedPatternIndex];

  // Command + Adapter Queue State
  const [hardware] = useState(() => new LegacyDroneHardware());
  const [commandQueue, setCommandQueue] = useState<CommandItem[]>([]);
  const [historyStack, setHistoryStack] = useState<CommandItem[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'Drone Command Center Online. Hardware drivers initialized.'
  ]);

  // Quiz State
  const [activeQuizIndex, setActiveQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  // Add commands to queue via Command-Adapters
  const addRotateCommand = (degrees: number) => {
    const cmd: CommandItem = {
      id: Math.random().toString(),
      name: `RotateAzimuth(${degrees}°)`,
      description: `Adapts legacy rotateServoRaw(${degrees}) into Command`,
      execute: () => hardware.rotateServoRaw(degrees),
      undo: () => hardware.rotateServoRaw(-degrees)
    };
    setCommandQueue((prev) => [...prev, cmd]);
  };

  const addClimbCommand = (altitude: number) => {
    const previousAlt = hardware.altitudeMeters;
    const cmd: CommandItem = {
      id: Math.random().toString(),
      name: `ClimbAltitude(${altitude}m)`,
      description: `Adapts legacy spinLiftRotors() into Command`,
      execute: () => hardware.spinLiftRotors(1200, altitude),
      undo: () => hardware.spinLiftRotors(-1200, previousAlt)
    };
    setCommandQueue((prev) => [...prev, cmd]);
  };

  const addSnapshotCommand = () => {
    const cmd: CommandItem = {
      id: Math.random().toString(),
      name: 'TriggerCameraSnapshot()',
      description: 'Adapts legacy pulseOptocouplerShutter() into Command',
      execute: () => hardware.pulseOptocouplerShutter(),
      undo: () => '[Camera] Undo not applicable (photo already stored on SD card)'
    };
    setCommandQueue((prev) => [...prev, cmd]);
  };

  const executeNextCommand = () => {
    if (commandQueue.length === 0) return;
    const nextCmd = commandQueue[0];
    const logResult = nextCmd.execute();

    setTelemetryLogs((prev) => [
      `EXECUTED [${nextCmd.name}]: ${logResult}`,
      ...prev.slice(0, 8)
    ]);
    setHistoryStack((prev) => [nextCmd, ...prev]);
    setCommandQueue((prev) => prev.slice(1));
  };

  const undoLastCommand = () => {
    if (historyStack.length === 0) return;
    const lastCmd = historyStack[0];
    const undoResult = lastCmd.undo();

    setTelemetryLogs((prev) => [
      `UNDO [${lastCmd.name}]: ${undoResult}`,
      ...prev.slice(0, 8)
    ]);
    setHistoryStack((prev) => prev.slice(1));
    setCommandQueue((prev) => [lastCmd, ...prev]);
  };

  const resetDrone = () => {
    hardware.azimuth = 0;
    hardware.altitudeMeters = 0;
    hardware.cameraShutterTriggered = false;
    setCommandQueue([]);
    setHistoryStack([]);
    setTelemetryLogs(['Telemetry reset. Drone returned to home coordinates (0°, 0m).']);
  };

  return (
    <div className="py-16 border-b border-slate-800 space-y-20">
      {/* 11. Related Patterns Header & Focus on Command Pattern */}
      <section id="related-patterns" className="scroll-mt-32 max-w-7xl mx-auto px-6 space-y-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">11</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Related Patterns & The Command Pattern
            </h2>
          </div>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            Understanding how Adapter compares with, complements, and integrates into other Gang of Four design patterns—with special architectural focus on the <strong className="text-cyan-400">Command Pattern</strong>.
          </p>
        </div>

        {/* Deep Dive Spotlight: Adapter + Command Pattern Synergy */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Architectural Synergy</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                How Adapter Empowers the Command Pattern
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Structural Adapter ➔ Behavioral Command Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
              <p>
                The <strong className="text-white">Command Pattern</strong> requires all actionable requests to implement a uniform interface with an <code className="text-cyan-300 font-mono">execute()</code> and optional <code className="text-cyan-300 font-mono">undo()</code> method.
              </p>
              <p>
                However, in real systems, the underlying hardware, database, or third-party SDKs do <strong className="text-amber-300">not</strong> have an <code className="text-cyan-300 font-mono">execute()</code> method—they have disparate legacy signatures like <code className="text-slate-200 font-mono">rotateServoRaw(angle)</code> or <code className="text-slate-200 font-mono">spinLiftRotors(rpm)</code>.
              </p>
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <strong className="text-cyan-400 block font-mono">The Command-Adapter Solution:</strong>
                <p>
                  We create <strong className="text-white">Command Adapters</strong>! Each command object implements the standard <code className="text-cyan-300 font-mono">ICommand</code> interface, while internally adapting and delegating calls to the legacy receiver.
                </p>
              </div>
            </div>

            {/* Interactive Drone Command Queue Demo */}
            <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Command-Adapter Queue</span>
                </span>
                <button
                  onClick={resetDrone}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
                  title="Reset Drone State"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Drone</span>
                </button>
              </div>

              {/* Action buttons to enqueue adapted commands */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => addRotateCommand(90)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 transition-colors"
                >
                  + Enqueue Rotate(90°)
                </button>
                <button
                  onClick={() => addClimbCommand(hardware.altitudeMeters + 15)}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 transition-colors"
                >
                  + Enqueue Climb(+15m)
                </button>
                <button
                  onClick={addSnapshotCommand}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 transition-colors"
                >
                  + Enqueue Snapshot()
                </button>
              </div>

              {/* Queue Controls & Status */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-mono">
                    Queue: <strong className="text-cyan-300 font-bold">{commandQueue.length}</strong> commands | History: <strong className="text-emerald-300 font-bold">{historyStack.length}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={executeNextCommand}
                      disabled={commandQueue.length === 0}
                      className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded text-xs disabled:opacity-40 transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Execute Next</span>
                    </button>
                    <button
                      onClick={undoLastCommand}
                      disabled={historyStack.length === 0}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-xs disabled:opacity-40 transition-colors flex items-center gap-1"
                    >
                      <Undo className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  </div>
                </div>

                {/* Drone Telemetry Gauges */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CURRENT AZIMUTH</span>
                    <span className="text-cyan-400 font-bold text-sm">{hardware.azimuth}°</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CURRENT ALTITUDE</span>
                    <span className="text-emerald-400 font-bold text-sm">{hardware.altitudeMeters} meters</span>
                  </div>
                </div>
              </div>

              {/* Console log of drone flight adapter operations */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1 max-h-28 overflow-y-auto">
                {telemetryLogs.map((log, i) => (
                  <div key={i} className="truncate">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GoF Pattern Comparison Matrix */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Structural & Behavioral Relatives Comparison</h3>
          
          {/* Pattern tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
            {RELATED_PATTERNS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => setSelectedPatternIndex(idx)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedPatternIndex === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] ml-1.5 text-slate-500">({p.category})</span>
              </button>
            ))}
          </div>

          {/* Active Pattern Card */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <h4 className="text-lg font-bold text-white">{selectedPattern.name}</h4>
              <span className="text-xs font-mono text-cyan-400">{selectedPattern.category} Pattern</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] font-semibold block">
                  Official GoF Intent
                </span>
                <p className="leading-relaxed">{selectedPattern.intentSummary}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] font-semibold block">
                  Key Contrast vs. Adapter
                </span>
                <p className="leading-relaxed text-amber-200/90">{selectedPattern.keyDifferenceFromAdapter}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] font-semibold block">
                  Architectural Synergy
                </span>
                <p className="leading-relaxed text-emerald-200/90">{selectedPattern.synergyWithAdapter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Scenario Quiz: Which Pattern Do You Need? */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Pattern Decision Quiz: Choose the Right Architecture</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Scenario {activeQuizIndex + 1} of {PATTERN_QUIZ_SCENARIOS.length}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-white">
                {PATTERN_QUIZ_SCENARIOS[activeQuizIndex].question}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {PATTERN_QUIZ_SCENARIOS[activeQuizIndex].context}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {PATTERN_QUIZ_SCENARIOS[activeQuizIndex].options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === oIdx;
                let cardStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300';
                if (revealed) {
                  if (opt.isCorrect) {
                    cardStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                  } else if (isSelected) {
                    cardStyle = 'bg-red-950/40 border-red-500/60 text-red-200';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      if (!revealed) {
                        setSelectedAnswer(oIdx);
                        setRevealed(true);
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all text-xs font-medium flex items-center justify-between ${cardStyle}`}
                  >
                    <span>{opt.label}</span>
                    {revealed && opt.isCorrect && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                        <Check className="w-3.5 h-3.5" /> Correct
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after user answers */}
            {revealed && selectedAnswer !== null && (
              <div className="p-4 rounded-lg bg-slate-950/90 border border-slate-800 text-xs space-y-2">
                <span className="font-mono text-cyan-400 font-bold block">Design Analysis:</span>
                <p className="text-slate-300 leading-relaxed">
                  {PATTERN_QUIZ_SCENARIOS[activeQuizIndex].options[selectedAnswer].explanation}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedAnswer(null);
                      setRevealed(false);
                      setActiveQuizIndex((prev) => (prev + 1) % PATTERN_QUIZ_SCENARIOS.length);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
                  >
                    <span>Next Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
