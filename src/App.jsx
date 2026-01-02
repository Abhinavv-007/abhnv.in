import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import MatrixRain from './components/MatrixRain';
import LandingMode from './components/LandingMode';
import ModernMode from './components/ModernMode';
import TerminalMode from './components/TerminalMode';

function App() {
  const [mode, setMode] = useState('landing');
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('abhnv-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('abhnv-theme', next);
      return next;
    });
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('abhnv-theme', theme);
  }, [theme]);

  return (
    <>
      {/* Force container to take up space and have background */}
      <div
        className="relative min-h-screen w-full font-sans selection:bg-cyan-500/30"
        style={{
          backgroundColor: theme === 'dark' ? '#020202' : '#f0f2f5',
          color: theme === 'dark' ? '#fff' : '#000'
        }}
      >
        {/* Persistent Background */}
        <MatrixRain theme={theme} mode={mode} />

        <AnimatePresence mode="wait">
          {mode === 'landing' && (
            <LandingMode key="landing" setMode={setMode} />
          )}
          {mode === 'modern' && (
            <ModernMode key="modern" setMode={setMode} toggleTheme={toggleTheme} theme={theme} />
          )}
          {mode === 'terminal' && (
            <TerminalMode key="terminal" setMode={setMode} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
