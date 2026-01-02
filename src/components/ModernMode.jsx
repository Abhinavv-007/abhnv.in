import { motion } from 'framer-motion';
import { Sun, Moon, Github, BookOpen } from 'lucide-react';
import BentoCard from './BentoCard';
import { SOCIALS, NAV_LINKS, PROJECTS, CERTIFICATIONS } from '../data/constants';

// Updated LinkedIn icon (2024 rounded style)
const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const ModernMode = ({ setMode, toggleTheme, theme }) => {
    // Category color mapping - accent borders with hover glow
    const getCategoryColor = (category) => {
        switch (category) {
            case 'ai': return { border: 'rgba(168, 85, 247, 0.35)', borderHover: 'rgba(168, 85, 247, 0.6)', glow: 'rgba(168, 85, 247, 0.25)', text: 'text-purple-400' };
            case 'security': return { border: 'rgba(239, 68, 68, 0.35)', borderHover: 'rgba(239, 68, 68, 0.6)', glow: 'rgba(239, 68, 68, 0.25)', text: 'text-red-400' };
            case 'defi': return { border: 'rgba(34, 197, 94, 0.35)', borderHover: 'rgba(34, 197, 94, 0.6)', glow: 'rgba(34, 197, 94, 0.25)', text: 'text-green-400' };
            case 'crypto': return { border: 'rgba(59, 130, 246, 0.35)', borderHover: 'rgba(59, 130, 246, 0.6)', glow: 'rgba(59, 130, 246, 0.25)', text: 'text-blue-400' };
            case 'biz': return { border: 'rgba(245, 158, 11, 0.35)', borderHover: 'rgba(245, 158, 11, 0.6)', glow: 'rgba(245, 158, 11, 0.25)', text: 'text-amber-400' };
            default: return { border: 'rgba(255, 255, 255, 0.2)', borderHover: 'rgba(255, 255, 255, 0.4)', glow: 'rgba(255, 255, 255, 0.15)', text: 'text-white' };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="min-h-screen pb-12"
        >
            {/* Top Bar Navigation */}
            <div className="max-w-[1200px] mx-auto pt-8 px-6 flex justify-between items-center mb-8 relative z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>System Online</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full transition-colors hover:bg-white/10" style={{ color: 'var(--text-main)' }}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button
                        onClick={() => setMode('landing')}
                        className="mono text-xs text-red-400 hover:text-red-300 transition-colors border border-red-900/30 px-4 py-2 rounded bg-red-950/10 hover:bg-red-900/30 tracking-wider"
                    >
                        [ LOCK ]
                    </button>
                </div>
            </div>

            <div className="bento-container relative z-10">

                {/* ============================================ */}
                {/* PROFILE CARD - FULL WIDTH AT TOP */}
                {/* ============================================ */}
                <BentoCard className="span-full p-8 accent-neutral flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-gray-500 flex items-center justify-center text-black font-extrabold text-2xl shadow-xl">AR</div>
                                <div>
                                    <h1 className="text-4xl font-extrabold tracking-tighter" style={{ color: 'var(--text-main)' }}>Abhinav Raj</h1>
                                    <p className="mono text-sm text-blue-400 opacity-80 mt-1">Ambition backed by implementation.</p>
                                </div>
                            </div>

                            {/* Extended Bio */}
                            <div className="space-y-4 mb-6">
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    17-year-old developer focused on AI, Cybersecurity, and immersive augmented systems. I build tools that solve real-world problems and systems that push boundaries of how we interact with technology.
                                </p>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    Passionate about decentralized networks, privacy-preserving AI, and everything that helps humans evolve digitally. Currently exploring adaptive intelligence and hybrid cyber-physical interfaces.
                                </p>
                                <p className="mono text-xs text-blue-400/80 italic">Always learning. Always shipping.</p>
                            </div>

                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                I'm always looking to collaborate on interesting projects with great people. Need a supportive hand? I have two!
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {["Python", "JS/TS", "Next.js", "PyTorch", "Solidity", "UI/UX"].map(s => (
                                    <span key={s} className="skill-tag">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col justify-between items-end">
                            <div className="flex gap-4">
                                <a href={SOCIALS.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }} className="hover:text-white transition-colors">
                                    <Github size={20} />
                                </a>
                                <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }} className="hover:text-white transition-colors">
                                    <LinkedInIcon />
                                </a>
                                <a href={SOCIALS.x} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }} className="hover:text-white transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                    </svg>
                                </a>
                            </div>
                            <div className="text-right mt-8">
                                <p className="mono text-[10px] uppercase tracking-widest text-gray-500">Statement</p>
                                <p className="mono text-xs italic text-gray-400">"Curiosity &gt; Comfort"</p>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* ============================================ */}
                {/* PROJECTS SECTION HEADER */}
                {/* ============================================ */}
                <div className="span-full mt-8 mb-4 flex items-center gap-4">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <h2 className="text-xl font-bold tracking-wider text-white/80">PROJECTS</h2>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>

                {/* ============================================ */}
                {/* PROJECTS GRID (3x2) */}
                {/* ============================================ */}

                {PROJECTS.map(project => (
                    <BentoCard key={project.id} href={project.href} className={`p-6 ${project.accentClass}`}>
                        <div className={`mono text-[10px] ${project.colorClass} font-bold mb-2`}>{project.badge}</div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{project.title}</h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{project.subtitle}</p>
                        <ul className="mt-4 space-y-2">
                            {project.bullets.map((bullet, idx) => (
                                <li key={idx} className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                    <div className={`w-1 h-1 ${project.colorClass}`}></div> {bullet}
                                </li>
                            ))}
                        </ul>
                        <div className={`mt-4 text-xs font-bold ${project.ctaClass}`}>LAUNCH →</div>
                    </BentoCard>
                ))}

                {/* ============================================ */}
                {/* AR PROJECTS SECTION */}
                {/* ============================================ */}
                <div className="span-full mt-10 mb-4 flex items-center gap-4">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <h2 className="text-xl font-bold tracking-wider text-white/80">AR PROJECTS</h2>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>

                {/* Aether - Using neutral/transparent style */}
                <BentoCard href="https://www.abhnv.in/Aether" className="p-6 accent-cyan">
                    <div className="mono text-[10px] text-cyan-400 font-bold mb-2">AR // HOLOGRAPHIC</div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Aether</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Holographic Interaction</p>
                    <ul className="mt-4 space-y-2">
                        <li className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <div className="w-1 h-1 bg-cyan-400"></div> Air-gesture control
                        </li>
                        <li className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <div className="w-1 h-1 bg-cyan-400"></div> Spatial computing
                        </li>
                    </ul>
                    <div className="mt-4 text-xs font-bold text-cyan-400">LAUNCH →</div>
                </BentoCard>

                {/* Air Blocks - Using RED accent */}
                <BentoCard href="https://www.abhnv.in/Air-Blocks" className="p-6 accent-security">
                    <div className="mono text-[10px] text-red-400 font-bold mb-2">AR // CREATIVITY</div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Air Blocks</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Spatial Creativity Engine</p>
                    <ul className="mt-4 space-y-2">
                        <li className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <div className="w-1 h-1 bg-red-500"></div> Create voxels mid-air
                        </li>
                        <li className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                            <div className="w-1 h-1 bg-red-500"></div> Build with hands
                        </li>
                    </ul>
                    <div className="mt-4 text-xs font-bold text-red-400">LAUNCH →</div>
                </BentoCard>

                {/* ============================================ */}
                {/* RESEARCH SECTION */}
                {/* ============================================ */}
                <div className="span-full mt-10 mb-4 flex items-center gap-4">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <h2 className="text-xl font-bold tracking-wider text-white/80">RESEARCH</h2>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>

                {/* ResearchVerse - Wide card with embedded Data for Sale */}
                <BentoCard className="span-full p-8 accent-neutral relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        {/* Left: ResearchVerse Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 border border-white/20 flex items-center justify-center rounded-full" style={{ color: 'var(--text-main)' }}>
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-wider" style={{ color: 'var(--text-main)' }}>ResearchVerse</h2>
                                    <p className="text-sm mono" style={{ color: 'var(--text-muted)' }}>Knowledge Vault</p>
                                </div>
                            </div>
                            <p className="text-sm max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                Explaining AI privacy and decentralized systems. A collection of research papers, articles, and explorations into the future of technology.
                            </p>
                        </div>

                        {/* Right: Data for Sale Mini Block - Blue Accent with Glow */}
                        <a
                            href="https://www.abhnv.in/research/paper"
                            target="_blank"
                            rel="noreferrer"
                            className="cert-card group min-w-[200px]"
                            style={{
                                border: '2px solid rgba(59, 130, 246, 0.35)',
                                '--cert-glow': 'rgba(59, 130, 246, 0.3)',
                            }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                            }}
                        >
                            <div className="text-xs mono text-blue-400 relative z-10">PAPER 01</div>
                            <h3 className="text-lg font-bold mt-1 relative z-10" style={{ color: 'var(--text-main)' }}>Data for Sale</h3>
                            <p className="text-[10px] mt-1 relative z-10" style={{ color: 'var(--text-muted)' }}>Privacy in the digital economy</p>
                            <div className="mt-3 text-[10px] uppercase tracking-widest inline-flex items-center gap-1 transition-all text-blue-400 relative z-10">
                                Read <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </a>
                    </div>
                </BentoCard>

                {/* ============================================ */}
                {/* CERTIFICATIONS - GLASS CARDS VERTICAL LIST */}
                {/* ============================================ */}
                <div className="span-full mt-8">
                    <h3 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--text-main)' }}>Certifications & Expertise</h3>
                    <p className="mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Validated learning. Proven execution.</p>

                    <div className="space-y-4">
                        {CERTIFICATIONS.map((cert) => {
                            const colors = getCategoryColor(cert.category);
                            return (
                                <a
                                    key={cert.name}
                                    href={cert.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="cert-card group"
                                    style={{
                                        border: `2px solid ${colors.border}`,
                                        '--cert-glow': colors.glow,
                                    }}
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
                                        e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
                                    }}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <div className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{cert.name}</div>
                                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{cert.provider}</div>
                                        </div>
                                        <div
                                            className="mono text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full border transition-all duration-300 inline-flex items-center gap-1"
                                            style={{ borderColor: colors.border, background: 'transparent' }}
                                        >
                                            <span className={colors.text}>VERIFY</span>
                                            <span className={`${colors.text} group-hover:translate-x-1 transition-transform`}>→</span>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>

                    {/* Animated Footer Text */}
                    <motion.div
                        className="mt-10 pt-6 border-t border-white/5 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.p
                            className="text-lg italic font-light"
                            style={{
                                color: 'var(--text-muted)',
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.02em'
                            }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                        >
                            Stacked with skills, backed by certificates.
                        </motion.p>
                        <motion.p
                            className="text-lg italic font-light mt-1"
                            style={{
                                color: 'var(--text-muted)',
                                fontFamily: 'Georgia, serif',
                                letterSpacing: '0.02em'
                            }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.6 }}
                        >
                            Ready to crush the next challenge.
                        </motion.p>
                    </motion.div>
                </div>

                {/* ============================================ */}
                {/* CONTACT CTA */}
                {/* ============================================ */}
                <BentoCard className="span-full p-12 text-center accent-ai items-center justify-center mt-8">
                    <div className="w-full flex flex-col items-center justify-center relative z-20">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--accent-ai) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
                        <h2 className="text-4xl font-extrabold mb-4 relative z-10" style={{ color: 'var(--text-main)' }}>Let's build something <span className="text-purple-500">relevant</span></h2>
                        <p className="mb-8 max-w-xl relative z-10" style={{ color: 'var(--text-muted)' }}>
                            I'm always looking to collaborate on interesting projects with great people. Need a supportive hand? I have two!
                        </p>
                        <a href={NAV_LINKS.contact} target="_blank" rel="noreferrer" className="btn-connect relative z-10">Connect</a>
                    </div>
                </BentoCard>

            </div>
        </motion.div>
    );
};

export default ModernMode;
