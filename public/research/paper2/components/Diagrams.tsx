/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, BrainCircuit, User, Smartphone, Eye, Zap, Flame, Server, BatteryCharging, Leaf, Info, Car, FileText, ArrowRight, TrendingUp, Globe, DollarSign, Coins, Factory, Wind, Thermometer, Cpu, Search, MousePointer2 } from 'lucide-react';

// Fix for framer-motion type mismatches
const MotionDiv = motion.div as any;
const MotionPath = motion.path as any;
const MotionSvg = motion.svg as any;
const MotionLine = motion.line as any;

const Tooltip: React.FC<{ children: React.ReactNode; content: React.ReactNode }> = ({ children, content }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center justify-center cursor-help z-50" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
            <MotionDiv 
            initial={{ opacity: 0, y: 5, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 px-3 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
            >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-100"></div>
            </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- VISUAL 1: ICEBERG DIAGRAM (Abstract) ---
export const IcebergDiagram: React.FC = () => {
    return (
        <div className="flex flex-col items-center p-8 bg-gradient-to-b from-sky-50 to-blue-100 dark:from-stone-900 dark:to-stone-950 rounded-xl shadow-lg border border-blue-100 dark:border-stone-800 my-8 overflow-hidden relative select-none">
             <div className="absolute top-0 left-0 w-full h-[35%] bg-sky-200/20 dark:bg-sky-900/10 z-0"></div>
             <div className="absolute top-[35%] left-0 w-full h-1 bg-blue-300 dark:bg-blue-800 z-10"></div> {/* Water Line */}
             
             <div className="relative z-20 flex flex-col items-center w-full max-w-xs">
                 {/* Tip of Iceberg */}
                 <Tooltip content="Training: One-time energy cost (Fixed)">
                    <div className="bg-white dark:bg-stone-200 text-stone-800 p-4 rounded-t-xl text-center shadow-lg border-b-4 border-blue-300 dark:border-blue-700 w-32 mx-auto mb-1 transform hover:scale-105 transition-transform">
                        <div className="font-bold text-xs uppercase tracking-wider">Training</div>
                        <div className="text-[10px] opacity-70">The Visible Cost</div>
                    </div>
                 </Tooltip>

                 {/* Submerged Part */}
                 <Tooltip content="Inference: Continuous energy drain (Variable)">
                    <div className="bg-blue-600 dark:bg-blue-900 text-white p-8 rounded-b-3xl text-center shadow-inner w-64 mx-auto relative overflow-hidden transform hover:scale-105 transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-black/30"></div>
                        <div className="relative z-10">
                            <div className="font-bold text-lg uppercase tracking-wider mb-2">Inference</div>
                            <div className="text-xs opacity-80">The Hidden Cost</div>
                            <div className="mt-4 flex justify-center gap-2">
                                <Zap size={16} className="animate-pulse text-yellow-300" />
                                <Zap size={16} className="animate-pulse text-yellow-300 delay-100" />
                                <Zap size={16} className="animate-pulse text-yellow-300 delay-200" />
                            </div>
                        </div>
                    </div>
                 </Tooltip>
             </div>
             <p className="mt-8 text-xs text-stone-500 dark:text-stone-400 text-center relative z-20">
                 Like an iceberg, the vast majority of AI's energy cost lies beneath the surface of daily usage.
             </p>
        </div>
    )
}

// --- VISUAL 2: FEEDBACK LOOP (Intro) ---
export const FeedbackLoopDiagram: React.FC = () => {
    return (
        <div className="flex flex-col items-center p-8 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 my-8">
            <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-6">The Energy Cycle</h3>
            
            <div className="relative w-64 h-64">
                {/* Rotating Circle */}
                <MotionSvg className="absolute inset-0 w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5 5" className="dark:stroke-stone-700" />
                    {/* Active Segment */}
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="80 220" strokeLinecap="round" />
                </MotionSvg>

                {/* Nodes */}
                {[
                    { label: "User Scroll", icon: <User size={16} />, x: "50%", y: "5%" },
                    { label: "Data Extraction", icon: <Database size={16} />, x: "90%", y: "50%" },
                    { label: "Inference", icon: <Flame size={16} color="#ef4444" />, x: "50%", y: "95%" }, // Heat!
                    { label: "Content Served", icon: <Smartphone size={16} />, x: "10%", y: "50%" },
                ].map((node, i) => (
                    <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-stone-800 p-2 rounded-full shadow border border-stone-200 dark:border-stone-700 flex flex-col items-center gap-1 w-20" style={{ left: node.x, top: node.y }}>
                        {node.icon}
                        <span className="text-[8px] font-bold text-center leading-tight dark:text-stone-300">{node.label}</span>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center text-xs text-red-500 font-bold flex items-center gap-2">
                <Flame size={14} /> Inference generates heat at the data center
            </div>
        </div>
    )
}

// --- VISUAL 3: LITERATURE VENN DIAGRAM ---
export const LiteratureVennDiagram: React.FC = () => {
    return (
        <div className="flex flex-col items-center p-8 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 my-8">
            <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-6">The Research Gap</h3>
            
            <div className="relative w-64 h-64 flex justify-center items-center mt-2">
                 {/* Circle 1 */}
                 <MotionDiv 
                    initial={{ opacity: 0, x: -20, y: -20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    className="absolute top-0 left-4 w-36 h-36 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border-2 border-blue-400 flex items-start justify-start p-6"
                 >
                     <span className="text-[10px] text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider">Ethical AI</span>
                 </MotionDiv>

                 {/* Circle 2 */}
                 <MotionDiv 
                    initial={{ opacity: 0, x: 20, y: -20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    className="absolute top-0 right-4 w-36 h-36 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border-2 border-emerald-400 flex items-start justify-end p-6"
                 >
                     <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">Green AI</span>
                 </MotionDiv>

                 {/* Circle 3 (Intersection Focus) */}
                 <MotionDiv 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 w-36 h-36 rounded-full bg-amber-100/80 dark:bg-amber-900/50 border-2 border-amber-500 z-10 backdrop-blur-sm flex items-end justify-center p-6"
                 >
                     <span className="text-xs text-amber-800 dark:text-amber-300 font-bold text-center uppercase tracking-wider">This Paper</span>
                 </MotionDiv>
            </div>
            <p className="mt-8 text-xs text-stone-500 dark:text-stone-400 italic text-center">
                Where Behavioral Design meets Energy Consumption.
            </p>
        </div>
    )
}

// --- VISUAL: ENGAGEMENT BAR CHART (Legacy placeholder) ---
export const EngagementBarChart: React.FC = () => null;

// --- NEW VISUAL: INFINITE SCROLL IMPACT ---
export const InfiniteScrollImpact: React.FC = () => {
    const [mode, setMode] = useState<'paged' | 'infinite'>('paged');
    const [energy, setEnergy] = useState(0);
    const [requests, setRequests] = useState(0);
    const [history, setHistory] = useState<{paged: number, infinite: number}[]>([]);

    // Simulates usage over time
    useEffect(() => {
        const interval = setInterval(() => {
            let reqInc = 0;
            let engInc = 0;
            
            // "Infinite" mode runs 5x faster/heavier
            if (mode === 'paged') {
                reqInc = 0.2;
                engInc = 0.5;
            } else {
                reqInc = 1.0; // 5x request rate
                engInc = 2.5; // 5x energy
            }

            setRequests(r => r + reqInc);
            setEnergy(e => e + engInc);
            
            setHistory(h => {
                const newH = [...h, { paged: mode === 'paged' ? engInc : 0.5, infinite: mode === 'infinite' ? engInc : 0.5 }];
                return newH.slice(-20); // Keep last 20 points
            });
        }, 100);
        return () => clearInterval(interval);
    }, [mode]);

    // Reset when switching modes for better comparison feel
    const handleModeChange = (newMode: 'paged' | 'infinite') => {
        setMode(newMode);
        setRequests(0);
        setEnergy(0);
        setHistory([]);
    };

    return (
        <div className="flex flex-col items-center p-8 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 my-8 w-full">
            <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-6">Impact Calculator: The 400% Spike</h3>

            <div className="flex gap-4 mb-8">
                <button 
                    onClick={() => handleModeChange('paged')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'paged' ? 'bg-blue-500 text-white shadow-lg' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'}`}
                >
                    Paged Interface
                </button>
                <button 
                    onClick={() => handleModeChange('infinite')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === 'infinite' ? 'bg-red-500 text-white shadow-lg' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'}`}
                >
                    Infinite Scroll
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mb-8">
                {/* Visual Simulation of Feed */}
                <div className="bg-white dark:bg-black border-2 border-stone-200 dark:border-stone-700 rounded-2xl h-64 relative overflow-hidden flex flex-col items-center p-2">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-stone-100 dark:bg-stone-800 z-10 flex items-center justify-center border-b border-stone-200 dark:border-stone-700">
                        <span className="text-[10px] text-stone-400 font-mono">MyFeed.app</span>
                    </div>
                    
                    <div className="mt-8 w-full space-y-3 overflow-hidden">
                        {/* Animated Feed Items */}
                        <AnimatePresence>
                            {[...Array(5)].map((_, i) => (
                                <MotionDiv
                                    key={i}
                                    initial={{ opacity: 0.5, y: 0 }}
                                    animate={{ 
                                        opacity: [0.5, 1, 0.5],
                                        y: mode === 'infinite' ? [0, -100] : [0]
                                    }}
                                    transition={{ 
                                        y: {
                                            repeat: mode === 'infinite' ? Infinity : 0, 
                                            duration: mode === 'infinite' ? 0.8 : 0, // Faster scroll in infinite mode
                                            ease: "linear"
                                        },
                                        opacity: {
                                            repeat: Infinity,
                                            duration: 2
                                        }
                                    }}
                                    className="w-full h-16 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center gap-3 px-3"
                                >
                                    <div className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-700"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="w-3/4 h-2 bg-stone-300 dark:bg-stone-700 rounded"></div>
                                        <div className="w-1/2 h-2 bg-stone-300 dark:bg-stone-700 rounded"></div>
                                    </div>
                                </MotionDiv>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Scroll Hand Hint */}
                    <MotionDiv 
                        className="absolute bottom-4 right-4 text-stone-400 pointer-events-none"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: mode === 'infinite' ? 0.3 : 2 }}
                    >
                        <MousePointer2 size={24} />
                    </MotionDiv>
                </div>

                {/* Metrics & Graph */}
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                         <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-stone-500 uppercase tracking-wider">Cumulative Energy (Joules)</span>
                            <span className={`text-2xl font-mono font-bold ${mode === 'infinite' ? 'text-red-500' : 'text-emerald-500'}`}>
                                {Math.floor(energy).toString()}
                            </span>
                         </div>
                         
                         {/* Mini Graph */}
                         <div className="h-24 bg-stone-100 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700 flex items-end overflow-hidden relative">
                             {/* Background grid */}
                             <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                                 {[...Array(24)].map((_,i) => <div key={i} className="border-t border-r border-stone-400"></div>)}
                             </div>
                             
                             {/* Bars */}
                             <div className="flex items-end h-full w-full px-1 gap-1">
                                 {history.map((val, i) => (
                                     <MotionDiv 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(100, val.infinite * 15)}%` }} // Scaling factor
                                        className={`w-full rounded-t-sm ${mode === 'infinite' ? 'bg-red-400/80' : 'bg-emerald-400/80'}`}
                                     />
                                 ))}
                             </div>
                         </div>
                    </div>

                    <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Inference Requests</div>
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-mono font-bold text-stone-800 dark:text-stone-200">
                                {Math.floor(requests).toString().padStart(3, '0')}
                            </div>
                            <div className="flex-1 h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                                <MotionDiv 
                                    className="h-full bg-blue-500"
                                    style={{ width: `${Math.min(100, requests)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {mode === 'infinite' && (
                        <div className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded border border-red-200 dark:border-red-800 text-xs font-bold text-center animate-pulse flex items-center justify-center gap-2">
                            <TrendingUp size={14} /> 400% CONSUMPTION RATE
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- NEW VISUAL: AUCTION AVALANCHE (Interactive) ---
export const AuctionAvalancheDiagram: React.FC = () => {
    const [bidders, setBidders] = useState(10);
    
    // Calculate visualization metrics
    const energyCost = (bidders * 0.0005).toFixed(4);
    
    return (
        <div className="flex flex-col items-center p-6 bg-stone-900 dark:bg-black rounded-xl border border-stone-800 my-4 text-white w-full shadow-2xl">
            <h3 className="font-serif text-lg mb-2 text-amber-500">Interactive: The Auction Avalanche</h3>
            <p className="text-xs text-stone-400 mb-6">Drag slider to see Fan-Out Effect</p>

            <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
                {/* Central User Node */}
                <div className="absolute z-20 w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <User size={32} className="text-white" />
                </div>

                {/* Bidder Nodes */}
                <MotionSvg className="absolute inset-0 w-full h-full overflow-visible">
                    {[...Array(bidders)].map((_, i) => {
                        const angle = (i / bidders) * Math.PI * 2;
                        const r = 120; // Radius
                        const x = Math.cos(angle) * r + 128;
                        const y = Math.sin(angle) * r + 128;
                        return (
                            <g key={i}>
                                <MotionLine 
                                    x1="128" y1="128" 
                                    x2={x} y2={y} 
                                    stroke={i > 20 ? "#ef4444" : "#10b981"} 
                                    strokeWidth={i > 20 ? 0.5 : 1}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.01 }}
                                />
                                <MotionDiv
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.01 }}
                                >
                                    <circle cx={x} cy={y} r={bidders > 50 ? 2 : 4} fill={i > 20 ? "#ef4444" : "#10b981"} />
                                </MotionDiv>
                            </g>
                        )
                    })}
                </MotionSvg>
            </div>

            {/* Controls */}
            <div className="w-full max-w-xs space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-500">
                    <span>10 Bidders</span>
                    <span>100 Bidders</span>
                </div>
                <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={bidders} 
                    onChange={(e) => setBidders(parseInt(e.target.value))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-xs">
                <div className="bg-stone-800 p-3 rounded-lg text-center border border-stone-700">
                    <div className="text-[10px] text-stone-400 uppercase">Energy / Slot</div>
                    <div className={`font-mono font-bold text-lg ${bidders > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {energyCost} J
                    </div>
                </div>
                <div className="bg-stone-800 p-3 rounded-lg text-center border border-stone-700">
                    <div className="text-[10px] text-stone-400 uppercase">System Load</div>
                    <div className={`font-mono font-bold text-lg ${bidders > 50 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {bidders > 50 ? 'CRITICAL' : 'NOMINAL'}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- NEW VISUAL: THERMAL RUNAWAY (Viral Spike) ---
export const ThermalRunawayChart: React.FC = () => {
    const [traffic, setTraffic] = useState(1); // 1 to 10 scale

    return (
        <div className="flex flex-col items-center p-6 bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 my-4 w-full">
            <h3 className="font-serif text-lg text-stone-800 dark:text-stone-100 mb-2">Interactive: Thermal Runaway</h3>
            <p className="text-xs text-stone-500 mb-6 text-center">Increase traffic to see non-linear cooling costs</p>

            <div className="w-full max-w-xs mb-6">
                <label className="text-xs font-bold uppercase text-stone-500 mb-2 block">User Traffic Level (Viral Factor)</label>
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.1"
                    value={traffic} 
                    onChange={(e) => setTraffic(parseFloat(e.target.value))}
                    className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
            </div>

            <div className="relative w-full h-64 border-l-2 border-b-2 border-stone-300 dark:border-stone-700 max-w-md bg-stone-50 dark:bg-stone-950/50 rounded-tr-xl">
                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                    {[...Array(16)].map((_, i) => <div key={i} className="border-t border-r border-stone-200 dark:border-stone-800 opacity-20"></div>)}
                </div>

                {/* Linear Line (Ideal) */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full overflow-visible">
                        {/* Static Reference Line */}
                        <line x1="0" y1="100%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
                        <text x="95%" y="48%" fill="#3b82f6" fontSize="10" textAnchor="end">Linear (Ideal)</text>
                    </svg>
                </div>

                {/* Dynamic Curve */}
                <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full overflow-visible">
                         <path 
                            d={`M 0 256 Q 128 ${256 - (traffic * 20)} 256 0`} 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="4"
                            className="drop-shadow-lg"
                         />
                         {/* Current Point */}
                         <circle 
                            cx={(traffic / 10) * 100 + "%"} 
                            cy={(100 - (traffic * 10)) + "%"} // Simplified y-calc for viz
                            r="6" 
                            fill="white" 
                            stroke="#ef4444" 
                            strokeWidth="3" 
                         />
                    </svg>
                </div>

                {/* Waste Zone Indicator */}
                {traffic > 5 && (
                    <MotionDiv 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-1/4 left-1/4 bg-red-500/20 backdrop-blur-sm p-2 rounded text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/50"
                    >
                        Thermal Overhead: +{Math.round(traffic * 12)}%
                    </MotionDiv>
                )}
            </div>
        </div>
    )
}

// --- NEW VISUAL: CARBON MAP (Geographic) ---
export const CarbonMapVisual: React.FC = () => {
    const [region, setRegion] = useState<'europe' | 'asia'>('europe');

    return (
        <div className={`flex flex-col items-center p-6 rounded-xl border my-4 text-white w-full transition-all duration-700 ${region === 'asia' ? 'bg-red-950/40 border-red-800 shadow-[0_0_30px_rgba(153,27,27,0.2)]' : 'bg-emerald-950/40 border-emerald-800 shadow-[0_0_30px_rgba(6,78,59,0.2)]'}`}>
            <div className="flex justify-between w-full items-center mb-6">
                <h3 className={`font-serif text-lg transition-colors duration-500 ${region === 'asia' ? 'text-red-400' : 'text-emerald-400'}`}>Global Carbon Impact</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setRegion('europe')}
                        className={`px-3 py-1 rounded text-xs border transition-colors ${region === 'europe' ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-stone-800 border-stone-600 text-stone-400'}`}
                    >
                        Clean Grid (EU)
                    </button>
                    <button 
                        onClick={() => setRegion('asia')}
                        className={`px-3 py-1 rounded text-xs border transition-colors ${region === 'asia' ? 'bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-stone-800 border-stone-600 text-stone-400'}`}
                    >
                        Dirty Grid (Asia)
                    </button>
                </div>
            </div>

            <div className={`relative w-full max-w-md h-64 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center border transition-colors duration-700 ${region === 'asia' ? 'border-red-900/30' : 'border-emerald-900/30'}`}>
                <Globe size={180} className={`absolute transition-all duration-700 ${region === 'asia' ? 'text-red-900/20 rotate-12 scale-110' : 'text-emerald-900/20 rotate-0 scale-100'}`} strokeWidth={0.5} />
                
                {/* Data Center Nodes */}
                {/* Europe Node */}
                <div className={`absolute top-[30%] left-[45%] flex flex-col items-center transition-all duration-700 ${region === 'europe' ? 'scale-125 z-10 opacity-100' : 'scale-90 opacity-30 blur-[1px]'}`}>
                    <div className="relative">
                        <div className={`w-3 h-3 rounded-full bg-emerald-400 transition-shadow duration-700 ${region === 'europe' ? 'shadow-[0_0_15px_rgba(52,211,153,0.8)]' : ''}`}></div>
                        {region === 'europe' && <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500 opacity-20"></div>}
                    </div>
                    {region === 'europe' && <div className="mt-2 text-[10px] bg-black/80 px-2 py-1 rounded text-emerald-300 border border-emerald-900/50 backdrop-blur-sm shadow-lg">Norway (Hydro)</div>}
                </div>

                {/* Asia Node */}
                <div className={`absolute top-[50%] left-[70%] flex flex-col items-center transition-all duration-700 ${region === 'asia' ? 'scale-150 z-10 opacity-100' : 'scale-90 opacity-30 blur-[1px]'}`}>
                    <div className="relative">
                        {/* High intensity glow for high carbon */}
                        <div className={`w-4 h-4 rounded-full bg-red-500 transition-shadow duration-300 ${region === 'asia' ? 'shadow-[0_0_50px_rgba(239,68,68,1)]' : ''}`}></div>
                        {region === 'asia' && (
                            <>
                                <div className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-60 duration-700"></div>
                                <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
                            </>
                        )}
                    </div>
                    {region === 'asia' && <div className="mt-2 text-[10px] bg-black/80 px-2 py-1 rounded text-red-300 border border-red-900/50 backdrop-blur-sm shadow-lg">Singapore (Gas)</div>}
                </div>
                
                {/* Overlay Effect for Dirty Grid */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${region === 'asia' ? 'opacity-100 bg-red-500/5' : 'opacity-0'}`}></div>
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${region === 'europe' ? 'opacity-100 bg-emerald-500/5' : 'opacity-0'}`}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-sm">
                <div className={`text-center p-3 rounded-lg transition-colors duration-500 ${region === 'asia' ? 'bg-red-950/20' : 'bg-emerald-950/20'}`}>
                    <div className="text-xs text-stone-400 uppercase">Grid Intensity</div>
                    <div className={`text-2xl font-bold font-mono transition-colors duration-300 ${region === 'asia' ? 'text-red-500' : 'text-emerald-400'}`}>
                        {region === 'asia' ? '490' : '005'} <span className="text-xs text-stone-500">g/kWh</span>
                    </div>
                </div>
                 <div className={`text-center p-3 rounded-lg transition-colors duration-500 ${region === 'asia' ? 'bg-red-950/20' : 'bg-emerald-950/20'}`}>
                    <div className="text-xs text-stone-400 uppercase">Environmental Cost</div>
                    <div className={`text-xl font-bold transition-colors duration-300 ${region === 'asia' ? 'text-red-500' : 'text-emerald-400'}`}>
                        {region === 'asia' ? 'CRITICAL' : 'NEGLIGIBLE'}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- NEW VISUAL: ECONOMIC INVISIBLE COST ---
export const EconomicInvisibleCost: React.FC = () => {
    const [magnify, setMagnify] = useState(false);

    return (
        <div className="flex flex-col items-center p-8 bg-white dark:bg-stone-900 rounded-xl shadow-sm border border-stone-200 dark:border-stone-800 my-8 w-full relative overflow-hidden transition-all duration-500">
            <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-8">The Invisible Cost</h3>
            
            <div className="relative w-full h-72 flex items-end justify-center gap-20 pb-8">
                {/* Revenue Stack */}
                <div className="flex flex-col items-center w-32 relative z-10 group">
                    <motion.div 
                        className="w-full bg-emerald-600 rounded-t-lg shadow-2xl relative overflow-hidden flex items-center justify-center border-t border-l border-r border-emerald-400"
                        initial={{ height: 0 }}
                        whileInView={{ height: '180px' }}
                        transition={{ duration: 1 }}
                    >
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                         <span className="text-white font-bold text-2xl drop-shadow-md z-10">$5.00</span>
                    </motion.div>
                    <div className="mt-4 text-center font-bold text-stone-600 dark:text-stone-400">Revenue<br/><span className="text-xs font-normal opacity-70">(per 1k imp)</span></div>
                </div>

                {/* Energy Stack */}
                <div className="flex flex-col items-center w-32 relative z-10">
                    <motion.div 
                        className={`w-full bg-red-500 shadow-xl transition-all duration-500 ease-in-out ${magnify ? 'rounded-t-lg border-2 border-red-400' : ''}`}
                        style={{ 
                            height: magnify ? '160px' : '2px', // Magnified view
                            marginBottom: magnify ? '0' : '0'
                        }}
                    >
                        {magnify && (
                             <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                             >
                                 $0.004
                             </motion.div>
                        )}
                    </motion.div>
                    
                    {/* Magnifier Glass Effect */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
                         <div className={`transition-all duration-500 ${magnify ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
                            <Search className="text-stone-400" size={32} />
                         </div>
                    </div>

                    <div className="mt-4 text-center font-bold text-stone-600 dark:text-stone-400">Energy Cost<br/><span className="text-xs font-normal opacity-70">(Invisible)</span></div>
                </div>
            </div>

            {/* Toggle Button */}
            <button 
                onClick={() => setMagnify(!magnify)}
                className="mt-4 px-6 py-2 bg-stone-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform z-20"
            >
                {magnify ? "Reset View" : "Magnify Energy Cost"}
            </button>
            
            <p className="mt-6 text-xs text-stone-500 text-center max-w-xs italic z-20">
                Energy cost is less than 0.1% of Ad Revenue. Market forces cannot "see" this cost.
            </p>

            {/* Background Hint */}
            <div className="absolute top-1/2 left-0 w-full text-center text-[10rem] font-bold text-stone-100 dark:text-stone-800/30 select-none z-0">
                0.1%
            </div>
        </div>
    )
}

// --- VISUAL 8: CAR COMPARISON ---
export const CarComparisonVisual: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 my-8">
            <div className="flex flex-col items-center">
                <div className="p-6 bg-stone-100 dark:bg-stone-800 rounded-full mb-4">
                    <Smartphone size={48} className="text-stone-800 dark:text-stone-200" />
                </div>
                <div className="font-bold text-sm text-stone-600 dark:text-stone-300">1 Infinite Scroll Feature</div>
            </div>

            <div className="text-2xl font-serif font-bold text-stone-400">=</div>

            <div className="flex flex-col items-center">
                 <div className="grid grid-cols-5 gap-2 mb-4">
                     {[...Array(10)].map((_, i) => (
                         <Car key={i} size={20} className="text-red-500" />
                     ))}
                 </div>
                 <div className="font-bold text-sm text-red-500">10 Million Miles Driven</div>
                 <div className="text-[10px] text-stone-400">(Annual CO2 Equivalent)</div>
            </div>
        </div>
    )
}

// --- VISUAL 10: GREEN LABEL ---
export const GreenLabelVisual: React.FC = () => {
    return (
        <div className="flex justify-center my-8">
            <div className="bg-white text-black p-4 border-2 border-black w-64 font-sans shadow-xl rotate-1 hover:rotate-0 transition-transform cursor-default">
                <div className="border-b-4 border-black pb-1 mb-2">
                    <h3 className="text-2xl font-black">Energy Facts</h3>
                    <div className="text-sm">per 1 hour session</div>
                </div>
                
                <div className="flex justify-between font-bold border-b border-black py-1">
                    <span>Compute Intensity</span>
                    <span className="text-red-600">High</span>
                </div>
                
                <div className="flex justify-between py-1 border-b border-black text-sm">
                    <span>Inference Calls</span>
                    <span className="font-bold">2,400</span>
                </div>

                <div className="flex justify-between py-1 border-b-4 border-black text-sm">
                    <span>Data Transfer</span>
                    <span className="font-bold">450 MB</span>
                </div>

                <div className="py-2 text-xs leading-tight">
                    <span className="font-bold">Carbon Footprint:</span> 15g CO2e. Equivalent to charging a smartphone 2 times.
                </div>

                <div className="mt-2 text-[10px] text-stone-500">
                    *Based on 2026 Grid Intensity Averages
                </div>
            </div>
        </div>
    )
}

// Legacy exports to prevent breakages if referenced elsewhere
export const SystemArchitectureDiagram = ({}) => null;
export const SimulationFlowDiagram = ({}) => null;
export const CrossoverGraph = ({}) => null;