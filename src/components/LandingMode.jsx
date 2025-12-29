import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Terminal } from 'lucide-react';
import { BOOT_SEQUENCE, PUNCHLINES, FLICKER_TEXTS } from '../data/constants';

const LandingMode = ({ setMode }) => {
    const [bootStep, setBootStep] = useState(0);
    const [isBootComplete, setIsBootComplete] = useState(false);
    const [punchlineIndex, setPunchlineIndex] = useState(0);
    const [flickerIndex, setFlickerIndex] = useState(0);
    const [bgClickCount, setBgClickCount] = useState(0);
    const [showEasterEgg, setShowEasterEgg] = useState(false);

    useEffect(() => {
        if (bootStep < BOOT_SEQUENCE.length) {
            const timeout = setTimeout(() => {
                setBootStep(prev => prev + 1);
            }, 700);
            return () => clearTimeout(timeout);
        } else {
            setTimeout(() => setIsBootComplete(true), 500);
        }
    }, [bootStep]);

    useEffect(() => {
        if (!isBootComplete) return;
        const interval = setInterval(() => {
            setPunchlineIndex(prev => (prev + 1) % PUNCHLINES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isBootComplete]);

    useEffect(() => {
        if (!isBootComplete) return;
        const interval = setInterval(() => {
            setFlickerIndex(prev => (prev + 1) % FLICKER_TEXTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isBootComplete]);

    const handleBgClick = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        setBgClickCount(prev => {
            const newCount = prev + 1;
            if (newCount === 3) {
                setShowEasterEgg(true);
                setTimeout(() => setMode('terminal'), 2000);
            }
            return newCount;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
            onClick={handleBgClick}
        >
            {/* Background Micro Interaction (Flicker Text) */}
            <div className="absolute top-8 left-8 text-[10px] font-mono tracking-widest opacity-20 uppercase pointer-events-none select-none z-10">
                <AnimatePresence mode="wait">
                    {isBootComplete && (
                        <motion.span
                            key={flickerIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5, 1] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, times: [0, 0.2, 0.4, 1] }}
                        >
                            {FLICKER_TEXTS[flickerIndex]}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showEasterEgg && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="absolute top-10 bg-red-900/80 border border-red-500/50 text-red-200 px-6 py-2 rounded font-mono text-xs z-50 backdrop-blur-md"
                    >
                        Root access not authorized yet. Redirecting to Terminal...
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="z-10 flex flex-col items-center justify-center text-center p-4 w-full max-w-4xl relative min-h-[400px]">

                {/* Boot Text / Title */}
                <div className="mb-12 min-h-[120px] flex flex-col items-center justify-center">
                    {!isBootComplete ? (
                        <motion.div
                            key={bootStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="font-mono text-cyan-500/70 text-sm tracking-widest uppercase"
                        >
                            {BOOT_SEQUENCE[Math.min(bootStep, BOOT_SEQUENCE.length - 1)]}
                            <span className="animate-pulse inline-block ml-1">_</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text-main)' }}>
                                Engineering systems that outgrow yesterday.
                            </h1>
                            <p className="text-lg md:text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                                Built with precision. Shipped with curiosity.
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Buttons (Show only after boot) */}
                {isBootComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row gap-6 w-full md:w-auto"
                    >
                        {/* Primary Button: Enter Interface */}
                        <motion.button
                            onClick={() => setMode('modern')}
                            className="relative group px-10 py-5 bg-white text-black font-bold text-sm tracking-widest rounded-full animate-pulse-ring overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                ENTER INTERFACE <ChevronRight size={16} />
                            </span>
                            <div className="absolute inset-0 bg-cyan-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        </motion.button>

                        {/* Secondary Button: Access Terminal */}
                        <motion.button
                            onClick={() => setMode('terminal')}
                            className="relative group px-10 py-5 bg-transparent border border-white/10 font-mono text-xs tracking-widest rounded-full overflow-hidden"
                            style={{ color: 'var(--text-muted)' }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="relative z-10 group-hover:text-green-400 transition-colors flex items-center gap-2">
                                <Terminal size={14} /> ACCESS TERMINAL
                            </span>
                            <motion.div className="absolute inset-0 bg-white/5 skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></motion.div>
                        </motion.button>
                    </motion.div>
                )}

                {/* Personality Punchlines */}
                {isBootComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-0 w-full text-center"
                    >
                        <div className="h-6 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={punchlineIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="font-mono text-xs md:text-sm"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    ✓ {PUNCHLINES[punchlineIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="absolute bottom-8 opacity-40 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                SYSTEM READY // V2.5.0
            </div>
        </motion.div>
    );
};

export default LandingMode;
