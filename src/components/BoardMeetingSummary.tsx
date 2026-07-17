import React, { useState } from 'react';
import { Bot, Cpu, Zap, Award, CheckCircle, ShieldAlert, Sparkles, AlertCircle, BarChart3, Hammer, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkflowState } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  state: WorkflowState;
}

export function BoardMeetingSummary({ state }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeRoles = state.assignedRoles || ['Architect', 'Coder', 'Researcher', 'Strategist', 'QA Engineer', 'Security Specialist'];
  const models = state.availableModels && state.availableModels.length > 0 
    ? state.availableModels 
    : ['google/gemini-2.5-flash'];

  // Helper to match a role to its most effective model and stats based on task efficiency
  const getRoleAllocation = (role: string) => {
    // 1. Detect if we have higher-tier reasoning models in the available model list
    const hasGpt4 = models.some(m => m.toLowerCase().includes('gpt-4') || m.toLowerCase().includes('claude-3-5') || m.toLowerCase().includes('sonnet') || m.toLowerCase().includes('pro'));
    
    // Sort models by potential capability to prioritize assignments
    // Reasoning heavy: GPT-4, Claude 3.5 Sonnet, Gemini 1.5/2.5 Pro
    // Speed/Cost heavy: Gemini 2.5 Flash, GPT-4o-mini, Haiku
    const reasoningModels = models.filter(m => 
      m.toLowerCase().includes('gpt-4') || 
      m.toLowerCase().includes('claude-3.5') || 
      m.toLowerCase().includes('sonnet') || 
      m.toLowerCase().includes('pro') ||
      m.toLowerCase().includes('architect')
    );

    const utilityModels = models.filter(m => 
      !reasoningModels.includes(m)
    );

    let assignedModel = models[0]; // fallback
    let reason = "Selected for rapid transaction processing & sequential steps execution.";
    let reasoningScore = 75;
    let velocityScore = 95;
    let competence = "General tasks delivery";

    const rLower = role.toLowerCase();
    
    if (rLower.includes('architect') || rLower.includes('strategist')) {
      // Prioritize high-reasoning models for system planning
      assignedModel = reasoningModels[0] || models[0];
      reason = "Assigned for advanced multi-hop logical deduction and complex dependency mapping.";
      reasoningScore = reasoningModels.length > 0 ? 98 : 80;
      velocityScore = reasoningModels.length > 0 ? 78 : 95;
      competence = rLower.includes('architect') ? "System Blueprinting & Topology" : "Strategic Goal Optimization";
    } else if (rLower.includes('coder') || rLower.includes('developer')) {
      // Prioritize coding capabilities
      const bestCoder = reasoningModels.find(m => m.toLowerCase().includes('claude') || m.toLowerCase().includes('gpt')) || reasoningModels[0] || models[0];
      assignedModel = bestCoder;
      reason = "Allocated for high-precision syntax synthesis and context-aware algorithmic design.";
      reasoningScore = reasoningModels.length > 0 ? 95 : 75;
      velocityScore = reasoningModels.length > 0 ? 82 : 92;
      competence = "Algorithmic Code Generation";
    } else if (rLower.includes('security') || rLower.includes('database')) {
      assignedModel = reasoningModels[0] || utilityModels[0] || models[0];
      reason = "Enforced for robust edge-case validation and vulnerability verification.";
      reasoningScore = 88;
      velocityScore = 85;
      competence = "Vulnerability Defusal & Sanitization";
    } else if (rLower.includes('qa') || rLower.includes('test')) {
      // Fast utility or QA specific
      assignedModel = utilityModels.find(m => m.toLowerCase().includes('mini') || m.toLowerCase().includes('haiku') || m.toLowerCase().includes('flash')) || models[models.length - 1] || models[0];
      reason = "Leveraging high-concurrency capability for deep unit coverage and logic assertion.";
      reasoningScore = 72;
      velocityScore = 98;
      competence = "Test Case Synthesis & Assertion";
    } else {
      // Fallback
      assignedModel = utilityModels[0] || models[0];
      reason = "Optimal baseline model selected for rapid delivery and execution.";
      reasoningScore = 70;
      velocityScore = 90;
      competence = "Sub-task Compilation & Refinement";
    }

    // Override with actual tasks assignment if tasks exist
    const actualTask = state.tasks.find(t => t.role.toLowerCase() === rLower);
    if (actualTask) {
      assignedModel = actualTask.model;
      reason = `Actively bound to step: "${actualTask.title}"`;
    }

    return {
      model: assignedModel,
      reason,
      reasoningScore,
      velocityScore,
      competence
    };
  };

  return (
    <div className="cyber-panel p-5 rounded-2xl relative overflow-hidden bg-slate-950/60 border border-slate-800 transition-all duration-300">
      <div className="scanning-line opacity-10" />

      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-yellow-500/20 z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/30">
            <Award className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">SWARM_RECRUITMENT_BLUEPRINT</h3>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Steering Board Optimal Efficiency Allocations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            STATUS: EVALUATED
          </span>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-1 rounded hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors text-slate-400 hover:text-white"
            title={isCollapsed ? "Expand blueprint" : "Collapse blueprint"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden space-y-5"
          >
            <div className="pt-3" />
            {/* Core Grid Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 z-10 relative">
              {activeRoles.map((role) => {
                const allocation = getRoleAllocation(role);
                
                return (
                  <div 
                    key={role} 
                    className="group relative bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl transition-all hover:bg-slate-900 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-500/5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Role Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-yellow-400 transition-colors uppercase font-mono tracking-wider">
                            {role}
                          </span>
                          <span className="text-[9px] block text-slate-500 font-mono tracking-tight uppercase mt-0.5">
                            {allocation.competence}
                          </span>
                        </div>
                        <div className="p-1 rounded bg-slate-950 border border-slate-850 group-hover:border-yellow-500/30 transition-colors">
                          <Bot className="w-3.5 h-3.5 text-yellow-400 group-hover:text-yellow-300" />
                        </div>
                      </div>

                      {/* Assigned Model Badge */}
                      <div className="bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Cpu className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="text-[10px] font-mono text-slate-300 truncate font-bold">
                            {allocation.model}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-blue-400 font-semibold uppercase shrink-0">
                          BOUND_OK
                        </span>
                      </div>

                      {/* Matching Justification */}
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                        {allocation.reason}
                      </p>
                    </div>

                    {/* Stats Indicators / Sparklines */}
                    <div className="pt-3 mt-3 border-t border-slate-850 space-y-2">
                      {/* Reasoning Power */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-slate-500 uppercase">Reasoning Power</span>
                          <span className="text-slate-300 font-bold">{allocation.reasoningScore}%</span>
                        </div>
                        <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${allocation.reasoningScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Velocity / Tokens */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-slate-500 uppercase">Velocity Index</span>
                          <span className="text-slate-300 font-bold">{allocation.velocityScore}%</span>
                        </div>
                        <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${allocation.velocityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer System Advisory */}
            <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex items-center gap-2.5 text-[10px] font-mono text-slate-400 z-10 relative">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span>
                SYSTEM_ADVISORY: The model matrices are dynamically fine-tuned using custom semantic-fit weights based on available tokens, model tiers, and specialized tasks.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
