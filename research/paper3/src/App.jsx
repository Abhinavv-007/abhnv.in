import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitPullRequest, AlertCircle, CheckCircle, Activity,
  Database, Cpu, Scissors, Shield, GitMerge,
  Terminal, Search, FileCode, Play, Pause, RotateCcw
} from 'lucide-react';

// --- Infographic Components ---

const HeroInfographic = () => {
  const [patched, setPatched] = useState(false);

  return (
    <div className="my-8 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm font-sans">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GitPullRequest size={16} className="text-gray-600" />
          <span className="text-sm font-mono text-gray-600">HBB-001: Sickle Cell Mutation</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-xs font-bold ${patched ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {patched ? 'MERGED' : 'OPEN INCIDENT'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Left: Symptoms */}
        <div className="p-4 space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Current State</h4>
          <div className="flex items-start gap-2">
             <AlertCircle size={16} className={patched ? "text-gray-300" : "text-red-500"} />
             <div className={patched ? "text-gray-400 line-through" : ""}>
               <span className="text-sm font-medium">Chronic Anemia</span>
               <span className="block text-[10px] text-gray-500">Severity: P0</span>
             </div>
          </div>
          <div className="flex items-start gap-2">
             <AlertCircle size={16} className={patched ? "text-gray-300" : "text-red-500"} />
             <div className={patched ? "text-gray-400 line-through" : ""}>
               <span className="text-sm font-medium">Pain Crises</span>
               <span className="block text-[10px] text-gray-500">Recurrence: High</span>
             </div>
          </div>
          <div className="flex items-start gap-2">
             <Activity size={16} className={patched ? "text-gray-300" : "text-orange-500"} />
             <div className={patched ? "text-gray-400 line-through" : ""}>
               <span className="text-sm font-medium">Organ Stress</span>
               <span className="block text-[10px] text-gray-500">Long-term debt</span>
             </div>
          </div>
        </div>

        {/* Center: Diff */}
        <div className="p-4 flex flex-col items-center justify-center bg-slate-50">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 w-full text-center">Source Diff</h4>
          <div className="font-mono text-sm bg-white p-4 rounded shadow-sm border border-gray-200 w-full">
            <div className="text-gray-400 text-xs mb-2">Location: HBB Gene (Codon 6)</div>
            {!patched ? (
              <>
                <div className="bg-red-50 text-red-700 px-2 py-1 rounded mb-1">- GAG (Glu)</div>
                <div className="bg-green-50 text-green-700 px-2 py-1 rounded">+ GTG (Val)</div>
              </>
            ) : (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-center">
                Patch Applied <CheckCircle size={12} className="inline ml-1"/>
              </div>
            )}
          </div>
          <button
            onClick={() => setPatched(!patched)}
            className={`mt-6 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              patched
              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              : 'bg-brand text-white hover:bg-brand-dark shadow-lg hover:shadow-xl'
            }`}
          >
            {patched ? 'Revert Patch' : 'Apply Patch (Conceptual)'}
          </button>
        </div>

        {/* Right: Status */}
        <div className="p-4 flex flex-col justify-center space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">System Build</h4>
            <div className={`text-2xl font-black ${patched ? 'text-green-600' : 'text-red-600'}`}>
              {patched ? 'PASS' : 'FAIL'}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Risk Meter</h4>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${patched ? 'bg-green-500' : 'bg-red-500'}`}
                initial={{ width: "90%" }}
                animate={{ width: patched ? "20%" : "90%" }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Stable</span>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PipelineInfographic = () => {
  return (
    <div className="my-8 p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">The Central Dogma (Build Pipeline)</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

        <div className="flex flex-col items-center text-center bg-white p-2 z-10">
          <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600 mb-2">
            <Database size={24} />
          </div>
          <div className="font-bold text-gray-800">DNA</div>
          <div className="text-xs text-gray-500 font-mono">Repo / Storage</div>
        </div>

        <div className="hidden md:flex text-gray-300">
          <Play size={20} fill="currentColor" />
        </div>

        <div className="flex flex-col items-center text-center bg-white p-2 z-10">
          <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center text-purple-600 mb-2">
            <FileCode size={24} />
          </div>
          <div className="font-bold text-gray-800">RNA</div>
          <div className="text-xs text-gray-500 font-mono">Build Artifact</div>
        </div>

        <div className="hidden md:flex text-gray-300">
          <Play size={20} fill="currentColor" />
        </div>

        <div className="flex flex-col items-center text-center bg-white p-2 z-10">
          <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center text-green-600 mb-2">
            <Cpu size={24} />
          </div>
          <div className="font-bold text-gray-800">Protein</div>
          <div className="text-xs text-gray-500 font-mono">Runtime App</div>
        </div>
      </div>
    </div>
  );
};

const MetaphorGrid = () => {
  const items = [
    { soft: "Deterministic", bio: "Probabilistic" },
    { soft: "Modular", bio: "Entangled (spaghetti code)" },
    { soft: "Rollback is easy", bio: "Rollback is nearly impossible" },
    { soft: "Tests isolate bugs", bio: "Side effects appear years later" },
    { soft: "Explicit permissions", bio: "Messy access control" },
    { soft: "Designed", bio: "Evolved (hacks on hacks)" },
  ];

  return (
    <div className="my-8 border border-gray-200 rounded-lg overflow-hidden font-sans text-sm">
      <div className="grid grid-cols-2 bg-gray-50 font-semibold border-b border-gray-200">
        <div className="p-3 text-center text-blue-600 border-r border-gray-200">Software</div>
        <div className="p-3 text-center text-green-600">Biology</div>
      </div>
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-2 border-b last:border-0 border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="p-3 text-gray-600 border-r border-gray-100">{item.soft}</div>
          <div className="p-3 text-gray-800 font-medium">{item.bio}</div>
        </div>
      ))}
    </div>
  );
};

const CostCurve = () => {
  return (
    <div className="my-8 p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Cost of Sequencing a Genome</h3>
      <div className="relative h-64 w-full border-l border-b border-gray-300">
        <div className="absolute -left-8 top-0 text-xs text-gray-400">$100M</div>
        <div className="absolute -left-6 bottom-0 text-xs text-gray-400">$100</div>

        {/* Moore's Law (Hypothetical) */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <path d="M0,10 Q150,50 300,100" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />
          <text x="310" y="100" className="text-[10px] fill-gray-400">Moore's Law</text>

          {/* Actual Cost */}
          <path d="M0,10 L50,15 L80,20 L100,150 L150,230 L300,240" fill="none" stroke="#059669" strokeWidth="3" />
          <text x="160" y="220" className="text-xs font-bold fill-brand">Next-Gen Sequencing Era</text>
        </svg>

        {/* Annotations */}
        <div className="absolute top-[140px] left-[100px] w-2 h-2 bg-brand rounded-full animate-ping"></div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-400 translate-y-4">Present</div>
        <div className="absolute bottom-0 left-0 text-xs text-gray-400 translate-y-4">2001</div>
      </div>
      <p className="text-xs text-gray-500 mt-6 text-center italic">The cliff that changed biology from lab work to data science.</p>
    </div>
  );
};

const DataVolume = () => {
  return (
    <div className="my-8 p-6 bg-gray-900 text-white rounded-lg flex flex-col md:flex-row items-center gap-8 justify-center">
      <div className="text-center">
        <div className="text-4xl font-serif mb-1">1 Human</div>
        <div className="text-sm text-gray-400">Genome</div>
      </div>
      <div className="text-2xl text-gray-600">≈</div>
      <div className="flex flex-col gap-1">
        {['Raw Reads (FASTQ)', 'Aligned (BAM)', 'Variants (VCF)', 'Annotations', 'Backups'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
             <div className="h-6 w-32 bg-blue-600 rounded opacity-80" style={{ width: `${100 - i * 15}px`, opacity: 1 - i * 0.15 }}></div>
             <span className="text-xs text-gray-300 font-mono">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CIPipeline = () => {
  const stages = ['FASTQ', 'QC', 'BAM', 'VCF', 'Report'];
  return (
    <div className="my-8 overflow-x-auto pb-4">
      <div className="flex items-center min-w-[600px] gap-2">
        {stages.map((stage, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 flex flex-col items-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold mb-2">
                {i + 1}
              </div>
              <div className="font-bold text-sm text-gray-800">{stage}</div>
              <div className="mt-2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
              </div>
            </div>
            {i < stages.length - 1 && <div className="w-8 h-0.5 bg-gray-300"></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center text-xs text-gray-500 mt-2 font-mono">From Chaos (Raw) to Signal (Diff)</div>
    </div>
  );
};

const CRISPRMechanism = () => {
  const [cut, setCut] = useState(false);

  return (
    <div className="my-8 p-8 bg-slate-900 rounded-lg text-white text-center">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">CRISPR-Cas9 Mechanism</h3>
      <div className="relative h-32 flex items-center justify-center">
        {/* DNA Strand */}
        <div className="absolute w-full h-4 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 rounded-full opacity-50"></div>

        {/* Cut Gap */}
        {cut && <div className="absolute w-4 h-6 bg-slate-900 z-10"></div>}

        {/* Cas9 Enzyme */}
        <motion.div
          className="absolute bg-brand w-24 h-24 rounded-full opacity-90 blur-xl z-0"
          animate={{ scale: cut ? [1, 1.2, 1] : 1 }}
        />
        <motion.div
          className="relative z-20 bg-white text-slate-900 px-4 py-2 rounded-lg font-bold shadow-xl border-2 border-brand"
          animate={{ y: cut ? -20 : 0 }}
        >
          Cas9 + Guide RNA
        </motion.div>

        {/* Target Site */}
        <div className="absolute mt-16 text-xs font-mono text-brand-light">Target Site</div>
      </div>

      <button
        onClick={() => setCut(true)}
        disabled={cut}
        className="mt-6 px-6 py-2 bg-brand hover:bg-brand-accent text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cut ? 'DNA Cut!' : 'Execute Cut'}
      </button>
      {cut && (
        <button onClick={() => setCut(false)} className="ml-4 text-xs text-gray-400 underline">
          Reset
        </button>
      )}
    </div>
  );
};

const RepairPathways = () => {
  const [mode, setMode] = useState('NHEJ');

  return (
    <div className="my-8 border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setMode('NHEJ')}
          className={`flex-1 p-3 text-sm font-bold ${mode === 'NHEJ' ? 'bg-red-50 text-red-700' : 'bg-white text-gray-500'}`}
        >
          NHEJ (Disruption)
        </button>
        <button
          onClick={() => setMode('HDR')}
          className={`flex-1 p-3 text-sm font-bold ${mode === 'HDR' ? 'bg-green-50 text-green-700' : 'bg-white text-gray-500'}`}
        >
          HDR (Patch)
        </button>
      </div>

      <div className="p-8 text-center bg-white min-h-[200px] flex flex-col items-center justify-center">
        {mode === 'NHEJ' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs">
            <div className="flex items-center justify-center gap-1 mb-4">
              <div className="w-12 h-4 bg-blue-300 rounded-l-full"></div>
              <div className="text-red-500 font-bold text-xl">X</div>
              <div className="w-12 h-4 bg-blue-300 rounded-r-full"></div>
            </div>
            <h4 className="font-bold text-gray-800">Non-Homologous End Joining</h4>
            <p className="text-sm text-gray-500 mt-2">Smashing the ends back together. Often loses a few letters. Great for <span className="text-red-500 font-bold">breaking</span> a gene.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs">
            <div className="flex items-center justify-center gap-1 mb-4 relative">
              <div className="w-12 h-4 bg-blue-300 rounded-l-full"></div>
              <div className="bg-green-100 border border-green-500 text-green-700 px-2 py-1 text-xs rounded">New Code</div>
              <div className="w-12 h-4 bg-blue-300 rounded-r-full"></div>
            </div>
            <h4 className="font-bold text-gray-800">Homology-Directed Repair</h4>
            <p className="text-sm text-gray-500 mt-2">Copy-pasting from a template. Precise editing. <span className="text-green-600 font-bold">Hard to pull off.</span></p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ExVivoTimeline = () => {
  const steps = [
    { icon: "💉", label: "Extract" },
    { icon: "🧬", label: "Edit" },
    { icon: "🔬", label: "QC" },
    { icon: "🏥", label: "Chemo" },
    { icon: "🩸", label: "Infuse" },
    { icon: "📈", label: "Monitor" },
  ];

  return (
    <div className="my-8 p-4 bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <div className="flex items-start min-w-[600px]">
        {steps.map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center text-center relative group">
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-xl mb-2 z-10 relative">
              {step.icon}
            </div>
            {i < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 -z-0"></div>
            )}
            <span className="text-xs font-bold text-gray-600">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrakeSwitch = () => {
  const [brakeOn, setBrakeOn] = useState(true);

  return (
    <div className="my-8 p-6 bg-slate-100 rounded-lg flex flex-col items-center">
      <div className="flex items-center gap-8 mb-6">
        <div className={`text-center transition-opacity ${brakeOn ? 'opacity-100' : 'opacity-30'}`}>
          <div className="w-16 h-16 bg-red-100 border-4 border-red-500 rounded-full flex items-center justify-center mb-2">
            <div className="font-bold text-red-700">BCL11A</div>
          </div>
          <span className="text-xs font-bold text-red-600 uppercase">Brake Active</span>
        </div>

        <div onClick={() => setBrakeOn(!brakeOn)} className="cursor-pointer">
           {brakeOn ? <Pause size={32} className="text-gray-400" /> : <Scissors size={32} className="text-brand" />}
        </div>

        <div className={`text-center transition-all ${!brakeOn ? 'scale-110' : 'scale-90 grayscale opacity-50'}`}>
          <div className={`w-16 h-16 ${!brakeOn ? 'bg-green-100 border-4 border-green-500' : 'bg-gray-200'} rounded-full flex items-center justify-center mb-2`}>
            <div className={`font-bold ${!brakeOn ? 'text-green-700' : 'text-gray-400'}`}>HbF</div>
          </div>
          <span className="text-xs font-bold text-green-600 uppercase">{!brakeOn ? 'Fetal Hgb ON' : 'Suppressed'}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center max-w-sm">
        Strategy: Don't fix the broken adult hemoglobin. <br/>Break the "brake" that suppresses the healthy fetal backup.
      </p>
    </div>
  );
};

const RiskTree = () => {
  return (
    <div className="my-8 p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-center font-bold text-gray-800 mb-6">Failure Modes</h3>
      <div className="flex flex-col gap-4">
        {[
          { label: "Off-Target Edit", desc: "Cut the wrong gene (Cancer risk)", risk: "High" },
          { label: "On-Target, Wrong Outcome", desc: "Repair creates new error", risk: "Medium" },
          { label: "Delivery Failure", desc: "Did not reach enough cells", risk: "Medium" },
          { label: "Immune Reaction", desc: "Body attacks the Cas9 protein", risk: "Var" }
        ].map((risk, i) => (
          <div key={i} className="flex items-center gap-4 border-l-4 border-red-400 bg-red-50 p-3 rounded-r">
             <AlertCircle size={20} className="text-red-500 shrink-0" />
             <div>
               <div className="font-bold text-sm text-gray-800">{risk.label}</div>
               <div className="text-xs text-gray-600">{risk.desc}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EthicsCards = () => {
  const [activeCard, setActiveCard] = useState(0);
  const scenarios = [
    { title: "Cure Fatal Disease", type: "Therapy", consensus: "Allowed" },
    { title: "Enhance Muscle Mass", type: "Enhancement", consensus: "Restricted" },
    { title: "Change Eye Color", type: "Cosmetic", consensus: "Controversial" },
    { title: "Germline (Embryo) Edit", type: "Heritable", consensus: "Banned (Mostly)" }
  ];

  return (
    <div className="my-8">
      <div className="flex gap-2 overflow-x-auto pb-4">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveCard(i)}
            className={`min-w-[140px] p-4 rounded-lg border text-left transition-all ${
              activeCard === i
              ? 'border-brand bg-brand-light shadow-md'
              : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-xs text-gray-500 mb-1">{s.type}</div>
            <div className="font-bold text-sm leading-tight">{s.title}</div>
          </button>
        ))}
      </div>
      <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
        <div className="text-xs font-mono uppercase text-gray-500 mb-2">Global Consensus</div>
        <div className="text-2xl font-serif font-bold text-slate-800">{scenarios[activeCard].consensus}</div>
        <div className="mt-4 flex gap-2">
          {['Safety', 'Consent', 'Equity'].map(tag => (
            <span key={tag} className="px-2 py-1 bg-white border border-gray-200 text-[10px] rounded text-gray-500">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccessMap = () => {
  return (
    <div className="my-8 p-6 bg-gray-900 text-white rounded-lg flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 text-center">
        <div className="text-4xl text-orange-500 font-bold mb-2">75%</div>
        <div className="text-sm text-gray-300">of Sickle Cell cases are in <br/>Sub-Saharan Africa</div>
      </div>
      <div className="w-px h-16 bg-gray-700 hidden md:block"></div>
      <div className="flex-1 text-center">
        <div className="text-4xl text-blue-500 font-bold mb-2">2%</div>
        <div className="text-sm text-gray-300">of Clinical Trials happen <br/>in that region</div>
      </div>
    </div>
  );
};

const LoopDiagram = () => {
  return (
    <div className="my-8 p-8 border border-gray-200 rounded-full aspect-square max-w-sm mx-auto flex items-center justify-center relative bg-white">
      <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white px-2 font-bold text-brand">1. Measure</div>
      <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 bg-white px-2 font-bold text-brand">2. Predict</div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-white px-2 font-bold text-brand">3. Intervene</div>
      <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 bg-white px-2 font-bold text-brand">4. Monitor</div>

      <div className="text-center">
        <RotateCcw size={48} className="text-gray-200 mx-auto mb-2" />
        <div className="font-serif font-bold text-gray-800">The Medicine Loop</div>
      </div>
    </div>
  );
};

// --- Main Article Component ---

function App() {
  return (
    <div className="min-h-screen bg-stone-50 text-gray-900 pb-20 selection:bg-brand-light selection:text-brand-dark">
      {/* Navigation Stub to match vibe */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 px-6 py-4 flex justify-between items-center">
        <div className="font-serif font-bold text-lg">Abhinav Raj</div>
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Research / Paper 03</div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-32">

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
            Life: When DNA Becomes Software
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            An Interactive Technical Review — From Reading Genomes to Writing Them.
          </p>
          <div className="mt-8 flex gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
            <span>July 2025</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span className="text-brand font-bold">Bio-Engineering</span>
          </div>
        </header>

        <hr className="border-gray-200 mb-12" />

        {/* Chapter 0 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 0 — Cold Open</h2>
          <h3 className="text-lg font-bold text-gray-700 mb-4">The Bug Report</h3>

          <div className="font-mono text-sm bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-2">
            <div><span className="text-gray-500">Incident ID:</span> HBB-001</div>
            <div><span className="text-gray-500">Environment:</span> Human (production)</div>
            <div><span className="text-gray-500">Severity:</span> <span className="text-red-600 font-bold">P0 (life-limiting)</span></div>
            <div><span className="text-gray-500">Status:</span> Unpatched (historically) → Patchable (now)</div>
          </div>

          <p className="mb-4">
            In the <strong>HBB gene</strong> (the blueprint for part of hemoglobin), one tiny substitution changes the protein’s behavior enough to turn red blood cells into fragile, sticky shapes. The body doesn’t crash instantly. It degrades. It throws incidents. It accumulates damage.
          </p>
          <p className="mb-6">
            If you’ve ever shipped software, you know this pattern: <strong>small diff → huge downstream effects</strong>, especially when the system is complex, stateful, and running 24/7.
          </p>

          <HeroInfographic />

          <p className="mb-4">
            This is the part where medicine historically says: <em>we can’t edit the code; we can only manage the outages.</em>
          </p>
          <p className="font-semibold">
            But that assumption is no longer stable.
          </p>
        </section>

        {/* Chapter 1 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 1 — DNA as Code</h2>
          <p className="mb-4">
            The DNA-as-code metaphor is useful because it compresses an overwhelming reality into something familiar: <strong>DNA stores instructions, cells read them, proteins do the work.</strong>
          </p>

          <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4">The “Compiler Pipeline” View</h3>
          <p className="mb-4">
            If you’re a developer, the cleanest mental model is:
          </p>

          <PipelineInfographic />

          <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4">Where the Metaphor Breaks</h3>
          <p className="mb-4">
            Software is designed. Biology is evolved. That means biology is full of redundancies, weird backward-compatible hacks, and side effects that are “features” until they aren’t.
          </p>

          <MetaphorGrid />

          <p className="italic text-gray-500 mt-4">
            So yes: DNA is “code.” But it’s code deployed in the most unforgiving production environment imaginable.
          </p>
        </section>

        {/* Chapter 2 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 2 — Sequencing</h2>
          <p className="mb-4">
            Reading DNA got cheap enough to mainstream. Interpretation became the bottleneck. Storage + compute became part of “biology”.
          </p>

          <CostCurve />
          <DataVolume />

          <p className="mb-4">
            The hard part isn’t <em>getting the data</em>. It’s <strong>turning it into meaning without hallucinating certainty.</strong>
          </p>
        </section>

        {/* Chapter 3 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 3 — The Pipeline</h2>
          <p className="mb-4">
            Sequencing gives you fragments. The pipeline turns them into <em>actionable differences.</em>
          </p>

          <CIPipeline />

          <div className="font-mono text-xs bg-slate-100 p-4 rounded mt-4">
            <p className="mb-2">// Step 1: FASTQ (Raw Logs)</p>
            <p className="mb-2">// Step 2: BAM (Aligned to Ref)</p>
            <p className="mb-2">// Step 3: VCF (The Diff)</p>
          </div>
        </section>

        {/* Chapter 4 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 4 — CRISPR Tools</h2>
          <p className="mb-4">
            Sequencing is read access. CRISPR is write access. You provide the guide. The tool finds the match. It cuts.
          </p>

          <CRISPRMechanism />

          <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4">Repair: The Commit Strategy</h3>
          <RepairPathways />
        </section>

        {/* Chapter 5 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 5 — Case Study: Sickle Cell</h2>
          <p className="mb-4">
            Modern therapies don’t always “fix the original mutation” directly. Some strategies re-route the system.
          </p>

          <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4">Ex Vivo Workflow</h3>
          <ExVivoTimeline />

          <h3 className="text-lg font-bold text-gray-700 mt-8 mb-4">The “Brake” Strategy</h3>
          <p className="mb-4">
            Instead of rewriting the broken function, we enable a stable legacy system (Fetal Hemoglobin) that still works.
          </p>
          <BrakeSwitch />
        </section>

        {/* Chapter 6 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 6 — Safety</h2>
          <p className="mb-4">
            If DNA is code, then CRISPR introduces the scariest sentence in engineering: <strong>“We can write to production.”</strong>
          </p>

          <RiskTree />

          <p className="mb-4 font-medium">
            The goal is not “no risk.” The goal is bounded risk with monitoring and fail-safes.
          </p>
        </section>

        {/* Chapter 7 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 7 — Ethics</h2>
          <p className="mb-4">
            Engineering gives capability faster than society decides how to use it. Once the tool exists, the ethical questions become UI decisions.
          </p>

          <EthicsCards />
        </section>

        {/* Chapter 8 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 8 — Equity</h2>
          <p className="mb-4">
            A cure that only exists for the rich is not a cure. It’s a product.
          </p>

          <AccessMap />

          <p className="mb-4 font-bold text-center">
            Are we building a global medical breakthrough, or a premium feature?
          </p>
        </section>

        {/* Chapter 9 */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter 9 — Future</h2>
          <p className="mb-4">
            The next era isn’t just “CRISPR everywhere.” It’s a feedback loop.
          </p>

          <LoopDiagram />

          <p className="mb-4">
            This is where AI slots in naturally — not as magic, but as an amplifier.
          </p>
        </section>

        {/* Closing */}
        <footer className="mt-20 pt-10 border-t border-gray-200 text-center">
          <h3 className="text-xl font-serif font-bold mb-6">Final Note</h3>
          <p className="mb-8 max-w-lg mx-auto text-gray-600">
            DNA isn’t literally software. It’s something older, stranger, and more consequential. But the moment we gained “write access,” the analogy stopped being poetic. It became an engineering responsibility.
          </p>
          <div className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-20">
            End of File
          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;
