import React, { useState, useEffect } from 'react';
import { WorkflowState } from '../types';
import { TaskNode } from './TaskNode';
import { ExecutionLogs } from './ExecutionLogs';
import { AgentDiscussion } from './AgentDiscussion';
import { BoardMeetingRoom } from './BoardMeetingRoom';
import { TaskRadialProgress } from './TaskRadialProgress';
import { OrchestrationPhases } from './OrchestrationPhases';
import { Activity, LayoutGrid, Download, Briefcase, Bot, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  state: WorkflowState;
  key?: React.Key;
}

export function WorkflowDashboard({ state }: Props) {
  const [activeTab, setActiveTab] = useState<'board' | 'agents'>(() => {
    return state.status === 'board_meeting' ? 'board' : 'agents';
  });

  const hasDeliverables = state.tasks.some(t => t.deliverables && t.deliverables.length > 0);

  // Auto-switch to agents tab when the workflow starts execution
  useEffect(() => {
    if (state.status !== 'board_meeting' && state.status !== 'idle') {
      setActiveTab('agents');
    }
  }, [state.status]);

  const handleDownload = () => {
    window.open(`/api/workflows/${state.workflowId}/download`, '_blank');
  };

  const handleApprove = async () => {
    try {
      await fetch(`/api/workflows/${state.workflowId}/board/approve`, {
        method: 'POST',
      });
    } catch (err) {
      console.error("Failed to approve board plan", err);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      await fetch(`/api/workflows/${state.workflowId}/board/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error("Failed to send message to board", err);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto" id="workflow-dashboard-root">
      {/* Tab Switcher Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl cyber-panel">
        <div className="flex items-center gap-2 p-1.5 bg-slate-950/80 rounded-xl w-fit border border-slate-800/80 z-10 shadow-inner">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all font-mono cursor-pointer ${
              activeTab === 'board'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Board Room
            {state.status === 'board_meeting' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-sm shadow-amber-500/50" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all font-mono cursor-pointer ${
              activeTab === 'agents'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/5'
                : 'text-slate-500 hover:text-slate-300 border border-transparent hover:bg-slate-900/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            Swarm Workspace
            {state.status !== 'board_meeting' && state.status !== 'completed' && state.status !== 'failed' && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="text-right hidden md:block">
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold mb-0.5">Current Status</p>
            <div className="flex items-center gap-2 justify-end">
                {state.status !== 'idle' && state.status !== 'completed' && state.status !== 'failed' && (
                    <Activity className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
                )}
                <p className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
                  {state.status.replace('_', ' ')}
                </p>
            </div>
          </div>
          
          {(state.status === 'completed' || state.status === 'failed') && hasDeliverables && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2.5 px-5 py-3 text-xs font-bold bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-xl transition-all border border-yellow-500/30 shadow-lg shadow-yellow-500/10 cursor-pointer font-mono group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              DOWNLOAD_PAYLOAD.ZIP
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'board' ? (
          <motion.div
            key="board-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <BoardMeetingRoom
              state={state}
              onApprove={handleApprove}
              onSendMessage={handleSendMessage}
            />
          </motion.div>
        ) : (
          <motion.div
            key="agents-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"
          >
            {/* Left Column: Discussion & Subtasks */}
            <div className="space-y-8">
              {state.discussion && state.discussion.length > 0 && (
                <AgentDiscussion discussion={state.discussion} />
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <LayoutGrid className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <h2 className="text-sm font-bold text-white tracking-widest uppercase font-mono">Task Decomposition Matrix</h2>
                  </div>
                </div>

                {state.tasks.length === 0 ? (
                  <div className="cyber-panel p-8 text-center rounded-2xl relative overflow-hidden">
                    <div className="scanning-line opacity-20" />
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mx-auto mb-4 border border-slate-850">
                      <Activity className="w-6 h-6 text-yellow-500 animate-pulse" />
                    </div>
                    <p className="text-slate-300 text-xs font-mono tracking-wide leading-relaxed">
                      {state.status === 'discussing'
                        ? 'SYSTEM: Collective agents actively formulating architectural boundaries in consensus memory sub-blocks...'
                        : 'SYSTEM: Orchestrator core decomposing mission payload into micro-sequences...'}
                    </p>
                  </div>
                ) : (
                  <div className="pl-2 space-y-4">
                    {state.tasks.map((task, index) => (
                      <TaskNode key={task.id} task={task} index={index} />
                    ))}
                  </div>
                )}
              </div>

              {/* Orchestration synthesis, testing, and review phases */}
              <OrchestrationPhases state={state} />
            </div>

            {/* Right Column: Sticky Live execution logs & D3 Progress */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-rose-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white tracking-widest uppercase font-mono">Swarm Telemetry Center</h2>
              </div>
              <TaskRadialProgress tasks={state.tasks} status={state.status} />
              <ExecutionLogs logs={state.logs} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
