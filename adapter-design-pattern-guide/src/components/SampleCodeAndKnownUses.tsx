import React, { useState } from 'react';
import { Play, Copy, Check, Terminal, Code2, Globe, Cpu, Database, Compass } from 'lucide-react';
import { CODE_SAMPLES } from '../data/adapterData';

interface LogEntry {
  id: string;
  time: string;
  stage: 'CLIENT' | 'ADAPTER' | 'ADAPTEE' | 'SUCCESS';
  message: string;
  payload?: any;
}

export const SampleCodeAndKnownUses: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('typescript');
  const [copied, setCopied] = useState<boolean>(false);

  // Interactive Sandbox state
  const [gatewayVendor, setGatewayVendor] = useState<'stripe' | 'paypal'>('stripe');
  const [amount, setAmount] = useState<number>(79.50);
  const [currency, setCurrency] = useState<string>('USD');
  const [customerEmail, setCustomerEmail] = useState<string>('alex.dev@corp.io');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      time: '00:00:00',
      stage: 'CLIENT',
      message: 'Client ready. Injecting adapter instance conforming to ModernPaymentProcessor interface.'
    }
  ]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SAMPLES[selectedLang].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    const newLogs: LogEntry[] = [];
    const timestamp = () => new Date().toISOString().substring(11, 19);

    newLogs.push({
      id: Math.random().toString(),
      time: timestamp(),
      stage: 'CLIENT',
      message: `Client invoked: processPayment($${amount.toFixed(2)}, "${currency}", "${customerEmail}")`
    });

    setTimeout(() => {
      if (gatewayVendor === 'stripe') {
        const cents = Math.round(amount * 100);
        newLogs.push({
          id: Math.random().toString(),
          time: timestamp(),
          stage: 'ADAPTER',
          message: `StripeAdapter: Converted $${amount} to ${cents} integer cents. Synthesized user token.`
        });
      } else {
        const cents = Math.round(amount * 100);
        newLogs.push({
          id: Math.random().toString(),
          time: timestamp(),
          stage: 'ADAPTER',
          message: `PayPalAdapter: Reformatted parameters into PayPal NVP legacy format with merchant ID.`
        });
      }
      setLogs([...newLogs]);

      setTimeout(() => {
        if (gatewayVendor === 'stripe') {
          const cents = Math.round(amount * 100);
          newLogs.push({
            id: Math.random().toString(),
            time: timestamp(),
            stage: 'ADAPTEE',
            message: `LegacyStripeGateway.executeCharge(${cents}, "${currency}", "sk_live_...", "tok_942") executed. Raw response: { charge_id: "ch_83fa1", status: "succeeded" }`
          });
        } else {
          newLogs.push({
            id: Math.random().toString(),
            time: timestamp(),
            stage: 'ADAPTEE',
            message: `LegacyPayPalService.send_payment() executed. Raw response: { ACK: "Success", PAYMENTINFO_0_TRANSACTIONID: "PP-77291A" }`
          });
        }
        setLogs([...newLogs]);

        setTimeout(() => {
          newLogs.push({
            id: Math.random().toString(),
            time: timestamp(),
            stage: 'SUCCESS',
            message: `Adapter normalized vendor output into PaymentResult { success: true, settledAmount: "$${amount.toFixed(2)} ${currency}" }. Returned to Client.`
          });
          setLogs([...newLogs]);
          setIsRunning(false);
        }, 600);
      }, 600);
    }, 500);
  };

  return (
    <div className="py-16 border-b border-slate-800 space-y-20">
      {/* 09. Sample Code */}
      <section id="sample-code" className="scroll-mt-32 max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold text-cyan-400">09</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Sample Code</h2>
            </div>
            <p className="text-slate-300 max-w-3xl leading-relaxed">
              Explore concrete implementations of the Adapter pattern across five mainstream programming languages, accompanied by an interactive live execution sandbox.
            </p>
          </div>

          {/* Language selector buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
            {Object.keys(CODE_SAMPLES).map((key) => {
              const lang = CODE_SAMPLES[key];
              const isSelected = selectedLang === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedLang(key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer Panel */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>payment_adapter{CODE_SAMPLES[selectedLang].extension}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">GoF Object Adapter</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-6 overflow-x-auto bg-slate-950/60 font-mono text-xs leading-relaxed text-slate-200">
            <pre className="whitespace-pre">
              {CODE_SAMPLES[selectedLang].code}
            </pre>
          </div>
        </div>

        {/* Interactive Live Simulation Sandbox */}
        <div className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Live Execution Sandbox</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Trigger a live client transaction through an adapter and observe the parameter translation pipeline in real time.
              </p>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:pointer-events-none rounded-md transition-colors shrink-0 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Adapting & Executing...' : 'Execute Adapter Transaction'}</span>
            </button>
          </div>

          {/* Sandbox controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Underlying Legacy Adaptee</label>
              <select
                value={gatewayVendor}
                onChange={(e) => setGatewayVendor(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
              >
                <option value="stripe">Legacy Stripe (Requires Cents & Token)</option>
                <option value="paypal">Legacy PayPal (NVP Name-Value Pair API)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Domain Amount (Dollars)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-medium">Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Execution Log Output */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
            <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-800/80 flex items-center justify-between">
              <span>Terminal Output / Call Trace</span>
              <span className="text-cyan-400">Status: {isRunning ? 'Translating...' : 'Idle'}</span>
            </div>

            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-1">
                <span className="text-slate-600 text-[10px] shrink-0">{log.time}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    log.stage === 'CLIENT'
                      ? 'bg-blue-950 text-blue-300'
                      : log.stage === 'ADAPTER'
                      ? 'bg-cyan-950 text-cyan-300'
                      : log.stage === 'ADAPTEE'
                      ? 'bg-amber-950 text-amber-300'
                      : 'bg-emerald-950 text-emerald-300'
                  }`}
                >
                  [{log.stage}]
                </span>
                <span className="text-slate-300 break-words leading-relaxed">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Known Uses */}
      <section id="known-uses" className="scroll-mt-32 max-w-7xl mx-auto px-6 space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-cyan-400">10</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Known Uses</h2>
          </div>
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            The Adapter pattern is ubiquitous across industry standard libraries, web frameworks, and operating system kernels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Java JDK Standard Library</span>
            </div>
            <h3 className="text-base font-bold text-white">Arrays.asList & Streams</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <code className="text-cyan-300">java.util.Arrays#asList()</code> adapts a raw fixed-size array to the standard <code className="text-cyan-300">List&lt;T&gt;</code> interface.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Similarly, <code className="text-cyan-300">InputStreamReader(InputStream)</code> wraps a byte-stream adaptee to conform to the character-based <code className="text-cyan-300">Reader</code> target interface.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Globe className="w-4 h-4" />
              <span>Python WSGI & ASGI</span>
            </div>
            <h3 className="text-base font-bold text-white">Web Server Gateway Interface</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              WSGI (PEP 3333) and ASGI servers (Uvicorn, Gunicorn) use adapters to bridge raw TCP network sockets and HTTP protocol frames into standard Python dictionary <code className="text-cyan-300">environ</code> and callable <code className="text-cyan-300">start_response</code> objects.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Compass className="w-4 h-4" />
              <span>Spring Framework MVC</span>
            </div>
            <h3 className="text-base font-bold text-white">HandlerAdapter Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Spring’s core <code className="text-cyan-300">DispatcherServlet</code> uses <code className="text-cyan-300">HandlerAdapter</code> to invoke any arbitrary controller class—whether configured via annotations (<code className="text-cyan-300">@Controller</code>), HttpRequestHandler, or legacy SimpleControllerHandlerAdapter.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              <span>Cloud Storage SDKs</span>
            </div>
            <h3 className="text-base font-bold text-white">Multi-Cloud Storage Repositories</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modern enterprise backends declare an <code className="text-cyan-300">IBlobStorage</code> target. Adapters encapsulate Amazon S3 SDK (<code className="text-cyan-300">PutObjectCommand</code>), Google Cloud Storage (<code className="text-cyan-300">bucket.upload</code>), and Azure Blob Storage without coupling the core application to any single vendor SDK.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Front-End Browser Engines</span>
            </div>
            <h3 className="text-base font-bold text-white">DOM Event Normalization</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Before W3C standardization across browsers, libraries like jQuery and React SyntheticEvent acted as adapters over divergent DOM implementations (e.g. bridging <code className="text-cyan-300">attachEvent</code> in Internet Explorer to W3C <code className="text-cyan-300">addEventListener</code>).
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>Testing & Mocking</span>
            </div>
            <h3 className="text-base font-bold text-white">Test-Double In-Memory Adapters</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hexagonal / Ports and Adapters architecture creates In-Memory Adapters (<code className="text-cyan-300">InMemoryUserRepository</code>) matching real database interfaces to allow sub-millisecond unit test execution without spinning up real PostgreSQL servers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
