import React, { useState } from 'react';
import { WorkflowState, SelfHealingAttempt, QualityGateAudit } from '../types';
import { 
  FileCode, Terminal, Shield, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, ShieldCheck, Zap, Activity, Users, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ComponentProps {
  state: WorkflowState;
}

export function OrchestrationPhases({ state }: ComponentProps) {
  const { status, synthesisReport, synthesizedDeliverables, selfHealingReport, qualityGateReport } = state;

  if (
    status !== 'integrating' && 
    status !== 'testing' && 
    status !== 'reviewing' && 
    status !== 'completed' &&
    !synthesisReport && 
    !selfHealingReport && 
    !qualityGateReport
  ) {
    return null;
  }

  return (
    <div className="space-y-8 w-full">
      {/* 1. Synthesis & Path Aligner Panel */}
      <AnimatePresence mode="wait">
        {(status === 'integrating' || synthesisReport) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="cyber-panel-glow-cyan p-7 rounded-2xl relative overflow-hidden shadow-lg shadow-blue-500/5"
          >
            <div className="scanning-line opacity-20" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/60 mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 flex items-center justify-center border border-blue-500/30 shadow-inner">
                  <Layers className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono drop-shadow-sm">
                    PHASE 04 // INTEGRATED_ASSEMBLY_AND_REFACTORING
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Synthesis & Integration Agent // relative path & import alignment</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-widest uppercase shadow-sm ${
                  status === 'integrating' 
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {status === 'integrating' ? 'ACTIVE_SCANNING' : 'SYNTHESIS_COMPLETE'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Report Summary */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>SYNTHESIS_ENGINE_LOGS:</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl text-xs sm:text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line max-h-[180px] overflow-y-auto custom-scrollbar shadow-inner">
                  {synthesisReport || 'SYSTEM: Release engineer is assembling components, resolving path mismatches, and parsing entry point coordinates...'}
                </div>
              </div>

              {/* Synthesized Deliverables File Tree */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>ASSEMBLY_PAYLOAD:</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-900 border border-slate-800 px-1.5 rounded">
                    {synthesizedDeliverables?.length || 0} files
                  </span>
                </div>
                <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl h-[180px] overflow-y-auto custom-scrollbar font-mono text-xs text-slate-400 space-y-2.5 shadow-inner">
                  {synthesizedDeliverables && synthesizedDeliverables.length > 0 ? (
                    synthesizedDeliverables.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-850/60 hover:border-blue-500/30 transition-all hover:bg-slate-800/50 cursor-default">
                        <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate text-slate-300 flex-1">{f.filename}</span>
                        <span className="text-[9px] text-slate-500 shrink-0 uppercase tracking-widest">
                          {f.content ? `${Math.round(f.content.length / 100) / 10}KB` : 'Empty'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-[10px] text-slate-600 gap-2">
                      <Activity className="w-4 h-4 animate-spin text-blue-500/50" />
                      Awaiting synthesis outputs...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Self-Healing Test & Compilation Loop */}
      <AnimatePresence mode="wait">
        {(status === 'testing' || selfHealingReport) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="cyber-panel p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="scanning-line opacity-10" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
                  <Terminal className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono">
                    PHASE 05 // SELF-HEALING_COMPILATION_LOOP
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Sandboxed syntax validation & automatic consensus-guided patch application</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
                  selfHealingReport?.success 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : status === 'testing'
                      ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 animate-pulse'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {selfHealingReport?.success ? 'COMPILATION_STABLE' : status === 'testing' ? 'VALIDATION_TESTING' : 'COMPILATION_WARNINGS'}
                </span>
              </div>
            </div>

            <SelfHealingAttemptsView report={selfHealingReport} status={status} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Deliverable Quality Gates Panel */}
      <AnimatePresence mode="wait">
        {(status === 'reviewing' || qualityGateReport) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="cyber-panel-glow-red p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="scanning-line opacity-10" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60 mb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/80 flex items-center justify-center border border-rose-500/30">
                  <Shield className="w-5 h-5 text-rose-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono">
                    PHASE 06 // PRE-RELEASE_QUALITY_GATE_AUDIT
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Automated Pre-Release Review Board // security, modularity, and error audits</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase ${
                  qualityGateReport?.overallPassed 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : status === 'reviewing'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {qualityGateReport?.overallPassed ? 'RELEASE_APPROVED' : status === 'reviewing' ? 'AUDITING_DELIVERABLES' : 'RELEASE_REJECTED'}
                </span>
              </div>
            </div>

            {/* Structured Audits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {qualityGateReport?.audits.map((audit, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-4 transition-all hover:bg-slate-900/40 ${
                    audit.status === 'PASSED'
                      ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/20'
                      : 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-400" />
                        {audit.auditor}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-black ${
                        audit.status === 'PASSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {audit.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                      {audit.criterion}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2 border-t border-slate-800/60">
                    {audit.feedback}
                  </p>
                </div>
              ))}

              {!qualityGateReport && (
                <div className="col-span-3 p-8 bg-slate-950/40 border border-slate-850 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
                    <Activity className="w-4 h-4 text-rose-500 animate-spin" />
                    <span>BOARD_CONVENING: Swarm Review Board is registering final package payloads...</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AttemptsViewProps {
  report?: {
    success: boolean;
    attempts: SelfHealingAttempt[];
  };
  status: string;
}

function SelfHealingAttemptsView({ report, status }: AttemptsViewProps) {
  const [activeAttemptIndex, setActiveAttemptIndex] = useState(0);

  if (!report || report.attempts.length === 0) {
    return (
      <div className="p-8 bg-slate-950/40 border border-slate-850 rounded-xl text-center relative z-10">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500">
          <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
          <span>VALIDATING: Initializing static syntax & path dependency tests...</span>
        </div>
      </div>
    );
  }

  const activeAttempt = report.attempts[activeAttemptIndex] || report.attempts[report.attempts.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
      {/* Sidebar Attempt Selectors */}
      <div className="space-y-2 md:col-span-1">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 block mb-2">
          COMPILATION_HISTORY:
        </span>
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {report.attempts.map((att, idx) => {
            const isActive = idx === activeAttemptIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveAttemptIndex(idx)}
                className={`w-full px-3 py-2.5 rounded-xl border text-left font-mono transition-all flex items-center justify-between gap-2 shrink-0 md:shrink cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-yellow-500/40 text-yellow-400 shadow shadow-yellow-500/5'
                    : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:border-slate-800 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Terminal className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-yellow-400' : 'text-slate-500'}`} />
                  <span className="text-[11px] font-bold truncate">RUN #0{att.attempt}</span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  att.success ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal View */}
      <div className="md:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
              TERMINAL_STDOUT_RUN_0{activeAttempt.attempt}:
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            {activeAttempt.success ? (
              <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>SUCCESS_STABLE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>COMPILER_FAIL</span>
              </div>
            )}
          </div>
        </div>

        {/* Console logs */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-inner">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>bash - ./validate_deliverables.sh</span>
            <span>UTF-8</span>
          </div>
          <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[220px] custom-scrollbar space-y-1.5 leading-relaxed bg-slate-950/80">
            {activeAttempt.success ? (
              <div className="text-emerald-400/90 font-mono space-y-1">
                <div>[SYSTEM] Initiating dry-run compilation system checks...</div>
                <div>[SYSTEM] Scanning {activeAttempt.healedFiles.length} file streams...</div>
                <div>[SYSTEM] Resolving relative path hierarchy connections...</div>
                <div>[SYSTEM] Parsing ECMA ES6/ESNext syntax configurations...</div>
                <div className="font-bold pt-2">✓ COMPILATION SUCCESSFUL. Zero warnings, zero path mismatch exceptions.</div>
              </div>
            ) : (
              <div className="text-rose-400/90 font-mono space-y-1">
                <div>[SYSTEM] Initiating dry-run compilation system checks...</div>
                <div>[SYSTEM] Scanning {activeAttempt.healedFiles.length} file streams...</div>
                <div>[SYSTEM] Parsing dependency coordinates...</div>
                <div className="font-bold text-rose-500 pt-2 border-t border-rose-950/20 mt-1">
                  ✗ COMPILER EXCEPTION: Linter errors and path mismatches caught:
                </div>
                {activeAttempt.errors.split('\n').map((err, i) => (
                  <div key={i} className="pl-4 text-[11px] text-slate-300 font-semibold border-l border-rose-500/40">
                    {err}
                  </div>
                ))}
              </div>
            )}
          </pre>
        </div>

        {/* Healer action card */}
        {!activeAttempt.success && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-3"
          >
            <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-[11px] font-bold text-yellow-400 font-mono uppercase tracking-wide">
                Consensus Room Repair Applied
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                The **Self-Healing Refactoring Agent** scanned the linter logs above, refactored curly-brace structures, and aligned the relative import paths for the next run. Click the run tabs in the sidebar to review the outcomes.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
