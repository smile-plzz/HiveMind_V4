import React, { useEffect, useRef, useState } from 'react';
import { WorkflowLog } from '../types';
import { format } from 'date-fns';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  logs: WorkflowLog[];
}

export function ExecutionLogs({ logs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (containerRef.current && !isCollapsed) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, isCollapsed]);

  return (
    <div className={`cyber-panel relative overflow-hidden rounded-2xl flex flex-col transition-all duration-300 ${isCollapsed ? 'h-[50px]' : 'h-[500px]'}`}>
      <div className="scanning-line opacity-20" />
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-yellow-400">hivemind // telemetry_logs</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Live Feed</span>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-0.5 rounded hover:bg-slate-950 border border-transparent hover:border-slate-800 transition-colors text-slate-400 hover:text-white"
            title={isCollapsed ? "Expand logs" : "Collapse logs"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-xs sm:text-sm scroll-smooth bg-slate-950/80 relative z-10 custom-scrollbar flex flex-col"
            ref={containerRef}
          >
        {logs.map((log, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={log.id} 
            className="flex gap-3 leading-relaxed border-l-2 border-transparent hover:border-yellow-500/20 hover:bg-yellow-500/5 px-2 py-1 rounded transition-colors"
          >
            <span className="text-slate-600 shrink-0 select-none font-medium">
               [{format(new Date(log.timestamp), 'HH:mm:ss')}]
            </span>
            {log.agent ? (
              <span className="text-yellow-400/90 shrink-0 font-bold uppercase tracking-wider text-[11px] bg-yellow-950/40 px-1.5 py-0.5 rounded border border-yellow-800/30">
                {log.agent}
              </span>
            ) : (
              <span className="text-blue-400/90 shrink-0 font-bold uppercase tracking-wider text-[11px] bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-800/30">
                SYSTEM
              </span>
            )}
            <span className="text-slate-300 break-words font-mono flex-1">
              {typeof log.message === 'object' ? JSON.stringify(log.message, null, 2) : String(log.message)}
            </span>
          </motion.div>
        ))}
        {logs.length === 0 ? (
          <div className="text-slate-500 italic font-mono flex items-center gap-2">
            <span>Waiting for connection payload...</span>
            <span className="w-2 h-4 bg-slate-600 animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-yellow-400/50 text-[10px] uppercase font-mono pt-2">
            <span>[SUBNETS STABLE] LINK_IDLE_AWAITING_SEQUENCE</span>
            <span className="w-1.5 h-3.5 bg-yellow-400 animate-pulse" />
          </div>
        )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
