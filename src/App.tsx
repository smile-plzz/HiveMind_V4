import React, { useState, useEffect } from 'react';
import { NewWorkflowForm } from './components/NewWorkflowForm';
import { WorkflowDashboard } from './components/WorkflowDashboard';
import { WorkflowState } from './types';
import { Cpu, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(() => {
    return new URLSearchParams(window.location.search).get('id') || localStorage.getItem('activeWorkflowId');
  });
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (activeWorkflowId) {
      localStorage.setItem('activeWorkflowId', activeWorkflowId);
      window.history.replaceState(null, '', `?id=${activeWorkflowId}`);
    } else {
      localStorage.removeItem('activeWorkflowId');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [activeWorkflowId]);

  const handleStartWorkflow = async (prompt: string, provider: string, apiKey: string, availableModels: string[], assignedRoles: string[]) => {
    setIsInitializing(true);
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, provider, apiKey, availableModels, assignedRoles }),
      });
      const data = await res.json();
      if (data.workflowId) {
        setActiveWorkflowId(data.workflowId);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize workflow. Check console for details.');
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (!activeWorkflowId) return;

    const eventSource = new EventSource(`/api/workflows/${activeWorkflowId}/stream`);

    eventSource.onmessage = (event) => {
      const data: WorkflowState = JSON.parse(event.data);
      setWorkflowState(data);
    };

    eventSource.onerror = (err) => {
      console.warn('SSE stream encountered a transient error. Native EventSource is automatically attempting to reconnect:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [activeWorkflowId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-yellow-500/30">
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-blue-500 to-rose-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 border border-yellow-400/30">
              <Cpu className="w-4 h-4 text-slate-950 animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-widest text-white uppercase flex items-center gap-2 font-mono drop-shadow-sm">
              Hivemind <span className="text-[10px] tracking-widest normal-case font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full font-bold">superintelligence</span>
            </span>
          </div>

          {activeWorkflowId && (
            <button
              onClick={() => {
                setActiveWorkflowId(null);
                setWorkflowState(null);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all border border-slate-700 hover:border-slate-600 shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!activeWorkflowId ? (
            <NewWorkflowForm key="form" onSubmit={handleStartWorkflow} isLoading={isInitializing} />
          ) : (
            workflowState && <WorkflowDashboard key="dashboard" state={workflowState} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

