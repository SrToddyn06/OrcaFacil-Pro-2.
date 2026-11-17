import React, { useState } from 'react';
import MainApp from './components/MainApp';
import LandingHero from './components/LandingHero';

export default function App() {
  const [presentationMode, setPresentationMode] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleAddLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 40));
  };

  if (presentationMode) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 overflow-y-auto relative">
        <button
          type="button"
          onClick={() => setPresentationMode(false)}
          className="fixed bottom-4 right-4 z-[999] bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-4 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-2xl border-2 border-amber-300 cursor-pointer active:scale-95 transition-all"
        >
          ← Voltar ao App Direto
        </button>
        <LandingHero logs={logs} onClearLogs={() => setLogs([])}>
          <div className="w-full max-w-[390px] h-[740px] rounded-3xl overflow-hidden border-4 border-neutral-800 shadow-2xl bg-neutral-900">
            <MainApp
              onAddLog={handleAddLog}
              onOpenPresentation={() => setPresentationMode(false)}
              isPresentationMode
            />
          </div>
        </LandingHero>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-neutral-900 overflow-hidden">
      <MainApp
        onAddLog={handleAddLog}
        onOpenPresentation={() => setPresentationMode(true)}
      />
    </div>
  );
}

