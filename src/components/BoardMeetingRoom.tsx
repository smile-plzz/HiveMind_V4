import React, { useState, useRef, useEffect } from 'react';
import { DiscussionMessage, WorkflowState } from '../types';
import { Briefcase, Send, CheckCircle, Bot, User, Cpu, Sparkles, MessageSquare, ShieldAlert, Plus, X, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardMeetingSummary } from './BoardMeetingSummary';
import ReactMarkdown from 'react-markdown';

const markdownComponents = {
  p: ({ children }: any) => <p className="mb-2 last:mb-0 text-sm leading-relaxed">{children}</p>,
  strong: ({ children }: any) => <strong className="text-yellow-400 font-extrabold tracking-wide">{children}</strong>,
  em: ({ children }: any) => <em className="text-blue-300 italic">{children}</em>,
  code: ({ children, ...props }: any) => {
    const isInline = typeof children === 'string' && !children.includes('\n');
    return isInline ? (
      <code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded text-yellow-300 border border-yellow-500/20 font-semibold">
        {children}
      </code>
    ) : (
      <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl my-2 overflow-x-auto max-w-full font-mono text-xs text-blue-200">
        <code {...props}>{children}</code>
      </div>
    );
  },
  ul: ({ children }: any) => <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>,
  li: ({ children }: any) => <li className="text-sm leading-relaxed">{children}</li>,
  h1: ({ children }: any) => <h1 className="text-base font-bold font-mono text-white mt-4 mb-2 uppercase tracking-wider border-b border-slate-800 pb-1">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-sm font-bold font-mono text-white mt-3 mb-1.5 uppercase tracking-wider">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-xs font-bold font-mono text-yellow-300 mt-2.5 mb-1 uppercase tracking-widest">{children}</h3>,
};

interface Props {
  state: WorkflowState;
  onApprove: () => Promise<void>;
  onSendMessage: (message: string) => Promise<void>;
}

export function BoardMeetingRoom({ state, onApprove, onSendMessage }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isUpdatingRoles, setIsUpdatingRoles] = useState(false);
  const [showRolesConfig, setShowRolesConfig] = useState(false);

  const activeRoles = state.assignedRoles || ['Architect', 'Coder', 'Researcher', 'Strategist', 'QA Engineer', 'Security Specialist'];

  const PRESET_SPECIALIZATIONS = [
    'Architect',
    'Strategist',
    'Researcher',
    'Coder',
    'QA Engineer',
    'Security Specialist',
    'UX Specialist',
    'Database Admin'
  ];

  const handleToggleRole = async (role: string) => {
    if (isUpdatingRoles) return;
    setIsUpdatingRoles(true);
    let newRoles: string[];
    if (activeRoles.includes(role)) {
      if (activeRoles.length <= 1) {
        setIsUpdatingRoles(false);
        return;
      }
      newRoles = activeRoles.filter(r => r !== role);
    } else {
      newRoles = [...activeRoles, role];
    }

    try {
      await fetch(`/api/workflows/${state.workflowId}/roles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingRoles(false);
    }
  };

  const handleAddCustomRole = async () => {
    const trimmed = customRoleInput.trim();
    if (!trimmed || isUpdatingRoles || activeRoles.includes(trimmed)) return;
    setIsUpdatingRoles(true);
    const newRoles = [...activeRoles, trimmed];

    try {
      await fetch(`/api/workflows/${state.workflowId}/roles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: newRoles }),
      });
      setCustomRoleInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingRoles(false);
    }
  };

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.boardDiscussion?.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsSending(true);
    try {
      await onSendMessage(message);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleApproveClick = async () => {
    if (isApproving) return;
    setIsApproving(true);
    try {
      await onApprove();
    } catch (err) {
      console.error(err);
    } finally {
      setIsApproving(false);
    }
  };

  const getRoleStyle = (role: string) => {
    if (role.toLowerCase().includes('ceo')) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
        avatar: <Briefcase className="w-5 h-5 text-amber-400" />
      };
    }
    if (role.toLowerCase().includes('cto') || role.toLowerCase().includes('tech')) {
      return {
        bg: 'bg-violet-500/10 border-violet-500/30',
        text: 'text-violet-400',
        badge: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
        avatar: <Cpu className="w-5 h-5 text-violet-400" />
      };
    }
    if (role.toLowerCase().includes('product') || role.toLowerCase().includes('pm')) {
      return {
        bg: 'bg-teal-500/10 border-teal-500/30',
        text: 'text-teal-400',
        badge: 'bg-teal-500/10 text-teal-300 border border-teal-500/20',
        avatar: <Sparkles className="w-5 h-5 text-teal-400" />
      };
    }
    return {
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
      avatar: <Bot className="w-5 h-5 text-cyan-400" />
    };
  };

  const boardDiscussion = state.boardDiscussion || [];

  return (
    <div className="cyber-panel-glow-amber relative flex flex-col h-full rounded-2xl overflow-hidden" id="board-meeting-room-container">
      <div className="scanning-line opacity-10" />
      {/* Header Info */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/5">
            <Briefcase className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              Steering Command Center <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded">COGNITIVE LEVEL 4</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight">high-level strategic consensus & override parameters</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Custom monospace readouts for immersive cyber environment */}
          <div className="hidden md:flex items-center gap-4 font-mono text-[10px] text-slate-500 mr-2 border-r border-slate-800 pr-4">
            <div>BOARD_UPLINK: <span className="text-emerald-400 font-bold">ONLINE</span></div>
            <div>HEURISTICS: <span className="text-amber-400 font-bold">STABLE</span></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${state.status === 'board_meeting' ? 'bg-amber-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              {state.status === 'board_meeting' ? 'Override Mode Active' : 'Adjourned'}
            </span>
          </div>
          {state.status === 'board_meeting' && (
            <button
              onClick={() => setShowRolesConfig(!showRolesConfig)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold cursor-pointer ${
                showRolesConfig 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Roles ({activeRoles.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Agent live specializations config panel */}
      <AnimatePresence>
        {showRolesConfig && state.status === 'board_meeting' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-amber-500/20 bg-slate-900/90 backdrop-blur-sm p-5 relative z-20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Live Swarm Specialization Override</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Toggle specialized sub-agents to change task decomposition scope</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRolesConfig(false)}
                className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_SPECIALIZATIONS.map((role) => {
                const isActive = activeRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleToggleRole(role)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-amber-500/10 border-amber-400/40 text-amber-400 shadow-sm"
                        : "bg-slate-950/60 border-slate-800/60 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                    }`}
                    disabled={isUpdatingRoles}
                  >
                    <span className={`w-1 h-1 rounded-full ${isActive ? "bg-amber-400 animate-pulse" : "bg-slate-700"}`} />
                    {role}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 max-w-md pt-1">
              <input
                type="text"
                placeholder="PROVISION_CUSTOM_ROLE_IDENTIFIER"
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomRole();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                disabled={isUpdatingRoles}
              />
              <button
                type="button"
                onClick={handleAddCustomRole}
                className="px-3 py-1.5 bg-amber-950/40 border border-amber-800/30 text-amber-400 hover:bg-amber-950/80 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                disabled={isUpdatingRoles}
              >
                + Add Role
              </button>
            </div>
            
            {/* Show any currently custom added roles */}
            {activeRoles.filter(r => !PRESET_SPECIALIZATIONS.includes(r)).length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Custom Active Specializations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRoles.filter(r => !PRESET_SPECIALIZATIONS.includes(r)).map(role => (
                    <div key={role} className="flex items-center gap-1 bg-amber-500/5 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg text-xs font-mono">
                      <span>{role}</span>
                      <button 
                        type="button" 
                        onClick={() => handleToggleRole(role)}
                        className="text-amber-400/60 hover:text-amber-300 ml-1 cursor-pointer"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Swarm Model Recruitment Blueprint */}
      <div className="p-6 pb-2 border-b border-slate-800/40 bg-slate-900/10">
        <BoardMeetingSummary state={state} />
      </div>

      {/* Cyber Telemetry Status Console */}
      <div className="mx-6 mt-4 p-3 bg-slate-900/30 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] text-slate-500 shadow-inner z-10 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>SWARM_UPLINK: <span className="text-rose-400 font-bold">STABLE</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span>CONVERGENCE_FACTOR: <span className="text-yellow-400 font-bold">98.4%</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-800 pl-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>ALLOCATED_VRAM: <span className="text-blue-400 font-bold">12.4 GB</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span>COGNITIVE_THREADS: <span className="text-yellow-400 font-bold">{activeRoles.length + 3} ACTIVE</span></span>
          <span className="text-slate-700">|</span>
          <span>SYSTEM_MODE: <span className="text-white font-bold">{state.status.toUpperCase()}</span></span>
        </div>
      </div>

      {/* Discussion Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px] min-h-[350px] custom-scrollbar bg-slate-950/40 relative z-10">
        {boardDiscussion.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-slate-400 text-xs font-mono max-w-md tracking-wide">
              SYSTEM_AWAITING_CONVENING: Steering Board agents are assembling. Standing by for CEO, CTO, and PM sub-modules to register...
            </p>
          </div>
        ) : (
          boardDiscussion.map((msg, idx) => {
            const isUser = msg.role === 'User' || msg.role === 'Master';
            const style = getRoleStyle(msg.role);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0 shadow-sm transition-all hover:scale-105">
                    {style.avatar}
                  </div>
                )}
                
                <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-xs font-bold tracking-wide ${isUser ? 'text-cyan-400' : style.text}`}>
                      {isUser ? 'Master' : msg.role}
                    </span>
                    {!isUser && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-850 font-mono">
                        {msg.model}
                      </span>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl border text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                    isUser
                      ? 'bg-cyan-500/5 border-cyan-500/30 text-cyan-50 rounded-tr-none hover:border-cyan-400/50'
                      : `${style.bg} ${style.bg.replace('/10', '/5')} text-slate-200 rounded-tl-none hover:border-slate-700/50`
                  }`}>
                    <div className="markdown-body">
                      <ReactMarkdown components={markdownComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                {isUser && (
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-cyan-500/30 shrink-0 shadow-sm order-3 transition-all hover:scale-105 hover:border-cyan-400">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Action / Banner Bar */}
      {state.status === 'board_meeting' && (
        <div className="mx-6 mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-400">Steering Mandate Pending</h4>
              <p className="text-xs text-slate-300">
                Discuss options, adjust guidelines with the board above, or approve their formulated plan to convene agents.
              </p>
            </div>
          </div>
          <button
            onClick={handleApproveClick}
            disabled={isApproving}
            className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 shrink-0"
          >
            <CheckCircle className="w-4 h-4" />
            {isApproving ? 'Convening Team...' : 'Convene Agent Team'}
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              state.status === 'board_meeting'
                ? "Type to instruct the board or answer their clarification requests..."
                : "Steering board is adjourned. View decisions in Agent Team room."
            }
            disabled={state.status !== 'board_meeting' || isSending}
            className="flex-1 px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={state.status !== 'board_meeting' || !inputValue.trim() || isSending}
            className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white disabled:text-slate-600 font-medium rounded-xl transition-all flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10 active:scale-95 disabled:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
