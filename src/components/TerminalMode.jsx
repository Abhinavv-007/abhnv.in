import { useState, useEffect, useRef } from 'react';
import { SOCIALS, SKILLS, CERTS, PROJECTS, NAV_LINKS } from '../data/constants';

const TerminalMode = ({ setMode }) => {
    const [history, setHistory] = useState([
        { type: 'output', content: 'ABHNV TERMINAL v2.1 initialized.' },
        { type: 'output', content: 'Identity confirmed. Access granted.' },
        { type: 'output', content: "Type 'help' to see available commands." }
    ]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
    }, [history]);

    const baseCommands = ['help', 'about', 'skills', 'certs', 'projects', 'socials', 'clear', 'exit', 'contact', 'theme', 'modern'];
    const projectCommands = PROJECTS.map(p => `open ${p.id}`);
    const commandSuggestions = [...baseCommands, ...projectCommands];

    const handleCommand = (cmd) => {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;
        let response = null;

        const projectMatch = PROJECTS.find(p => cleanCmd === `open ${p.id}` || cleanCmd === p.id);

        switch (cleanCmd) {
            case 'help':
                response = (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-md">
                        <span className="text-cyan-400">about</span><span>Who Am I</span>
                        <span className="text-cyan-400">skills</span><span>Tech Stack</span>
                        <span className="text-cyan-400">certs</span><span>Certifications</span>
                        <span className="text-cyan-400">projects</span><span>View Work / open {'<slug>'}</span>
                        <span className="text-cyan-400">socials</span><span>Connect</span>
                        <span className="text-cyan-400">contact</span><span>Say hello</span>
                        <span className="text-cyan-400">modern</span><span>Return to UI grid</span>
                        <span className="text-cyan-400">clear</span><span>Clear Screen</span>
                        <span className="text-cyan-400">exit</span><span>Return to UI</span>
                    </div>
                );
                break;
            case 'about':
                response = (
                    <div className="space-y-2">
                        <p className="font-bold text-white">ABHINAV RAJ</p>
                        <p>Technologist focused on AI, Blockchain, and Cybersecurity.</p>
                        <p>Philosophy: Curiosity > Comfort.</p>
                    </div>
                );
                break;
            case 'skills':
                response = (
                    <div>
                        <p className="text-purple-400 font-bold mb-1">CORE STACK:</p>
                        <p>{SKILLS.primary.join(', ')}</p>
                        <p className="text-purple-400 font-bold mt-2 mb-1">DOMAINS:</p>
                        <p>{SKILLS.domains.join(', ')}</p>
                    </div>
                );
                break;
            case 'certs':
                response = (
                    <ul className="list-disc pl-5">
                        {CERTS.map(c => <li key={c}>{c}</li>)}
                    </ul>
                );
                break;
            case 'projects':
                response = (
                    <div className="grid gap-2">
                        {PROJECTS.map(project => (
                            <div key={project.id} className="flex flex-col">
                                <span className="text-green-400 font-bold">{project.title}</span>
                                <span className="text-xs opacity-70">{project.subtitle}</span>
                                <span className="text-[10px] opacity-60">open {project.id}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'contact':
                response = (
                    <div className="flex flex-col gap-1">
                        <a href={NAV_LINKS.contact} target="_blank" className="hover:underline text-blue-400">Contact form</a>
                        <a href={SOCIALS.email} className="hover:underline text-blue-400">Email</a>
                    </div>
                );
                break;
            case 'modern':
                setMode('modern');
                return;
            case 'theme':
                response = 'Use the sun/moon toggle in Modern mode to switch themes.';
                break;
            case 'socials':
                response = (
                    <div className="flex flex-col gap-1">
                        <a href={SOCIALS.github} target="_blank" className="hover:underline text-blue-400">Github</a>
                        <a href={SOCIALS.x} target="_blank" className="hover:underline text-blue-400">X (Twitter)</a>
                        <a href={SOCIALS.linkedin} target="_blank" className="hover:underline text-blue-400">LinkedIn</a>
                        <a href={SOCIALS.email} className="hover:underline text-blue-400">Email</a>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                setMode('landing');
                return;
            default:
                if (projectMatch) {
                    window.open(projectMatch.href, '_blank', 'noopener,noreferrer');
                    response = (
                        <div>
                            <div className="text-green-400">Launching {projectMatch.title}...</div>
                            <div className="text-xs opacity-70">{projectMatch.href}</div>
                        </div>
                    );
                    break;
                }
                response = `Command not found: ${cleanCmd}. Type 'help' for options.`;
        }

        setHistory(prev => [
            ...prev,
            { type: 'input', content: cleanCmd },
            { type: 'output', content: response }
        ]);

        if (cleanCmd) {
            setCommandHistory(prev => [...prev, cleanCmd]);
            setHistoryIndex(-1);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHistoryIndex(prev => {
                const nextIndex = Math.min(prev + 1, commandHistory.length - 1);
                const command = commandHistory[commandHistory.length - 1 - nextIndex];
                if (command) setInput(command);
                return nextIndex;
            });
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHistoryIndex(prev => {
                const nextIndex = Math.max(prev - 1, -1);
                const command = nextIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - nextIndex];
                setInput(command ?? '');
                return nextIndex;
            });
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const match = commandSuggestions.find(cmd => cmd.startsWith(input));
            if (match) setInput(match);
        }
    };

    return (
        <div
            className="min-h-screen bg-[#0a0a0a] text-green-500 font-mono p-4 md:p-8 overflow-hidden relative selection:bg-green-900 selection:text-white"
            onClick={() => inputRef.current?.focus()}
        >
            {/* CRT Effects */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
            <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_800px_at_center,transparent_70%,#000_100%)]"></div>

            <div className="max-w-3xl mx-auto relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="border-b border-green-800 pb-4 mb-4 flex justify-between items-end opacity-80">
                    <div>
                        <h1 className="text-xl font-bold">ABHNV_TERMINAL</h1>
                        <span className="text-xs">SECURE CONNECTION ESTABLISHED</span>
                    </div>
                    <button
                        onClick={() => setMode('landing')}
                        className="text-xs border border-green-800 px-2 py-1 hover:bg-green-900 transition-colors"
                    >
                        [ DISCONNECT ]
                    </button>
                </div>

                {/* Output Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-12">
                    {history.map((entry, idx) => (
                        <div key={idx} className="mb-2 break-words">
                            {entry.type === 'input' ? (
                                <div className="flex gap-2 text-slate-400">
                                    <span>root@abhnv:~$</span>
                                    <span>{entry.content}</span>
                                </div>
                            ) : (
                                <div className="pl-0 md:pl-4 opacity-90 leading-relaxed">
                                    {entry.content}
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2 items-center mt-2 border-t border-green-900 pt-4">
                    <span className="text-green-600">root@abhnv:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value.toLowerCase())}
                        onKeyDown={onKeyDown}
                        className="bg-transparent outline-none flex-1 text-green-400 caret-green-500"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
};

export default TerminalMode;
