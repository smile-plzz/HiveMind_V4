import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Cpu, Play, Terminal, Key, Settings, Server, Plus, X, Users, Shield, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { ApiProvider } from '../types';

interface Props {
  onSubmit: (prompt: string, provider: ApiProvider, apiKey: string, availableModels: string[], assignedRoles: string[]) => void;
  isLoading: boolean;
  key?: React.Key;
}

const PROVIDERS: ApiProvider[] = ['OpenRouter'];
const DEFAULT_OPENROUTER_MODELS = 'google/gemini-2.5-flash, meta-llama/llama-3-8b-instruct, openai/gpt-4o-mini';

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

export function NewWorkflowForm({ onSubmit, isLoading }: Props) {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('OpenRouter');
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [modelsStr, setModelsStr] = useState(DEFAULT_OPENROUTER_MODELS);
  
  // Roles Configuration system state
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    'Architect',
    'Strategist',
    'Researcher',
    'Coder',
    'QA Engineer',
    'Security Specialist'
  ]);
  const [customRoleInput, setCustomRoleInput] = useState('');

  const handleProviderChange = (newProvider: ApiProvider) => {
    setProvider(newProvider);
  };

  const handleToggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleAddCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (trimmed && !selectedRoles.includes(trimmed)) {
      setSelectedRoles([...selectedRoles, trimmed]);
      setCustomRoleInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      const models = modelsStr.split(',').map(m => m.trim()).filter(Boolean);
      onSubmit(prompt, provider, apiKey, models, selectedRoles);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="cyber-panel-glow-amber p-8 rounded-2xl relative overflow-hidden">
        {/* Laser scanner animation effect */}
        <div className="scanning-line" />
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-yellow-950/80 flex items-center justify-center border border-yellow-500/40 shadow-lg shadow-yellow-500/10">
            <Cpu className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-widest uppercase flex items-center gap-2 font-mono drop-shadow-sm">
              Hivemind <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 font-bold tracking-widest normal-case">Orchestrator Core</span>
            </h2>
            <p className="text-xs text-slate-400 tracking-wide mt-1">Initialize a multi-agent robotic hivemind to execute complex technical objectives.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-slate-400 font-mono uppercase tracking-widest text-[10px] font-bold">
              Objective Definition
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Build a snake game in Python and write unit tests..."
              className="w-full h-36 bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500/50 resize-none font-mono text-sm transition-all shadow-inner"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="provider" className="block text-slate-400 font-mono uppercase tracking-widest text-[10px] font-bold">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  API Provider
                </div>
              </label>
              <select
                id="provider"
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value as ApiProvider)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 text-sm font-mono transition-all shadow-inner"
                disabled={isLoading}
              >
                {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-slate-400 font-mono uppercase tracking-widest text-[10px] font-bold">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-rose-400" />
                  OpenRouter API Key (Required)
                </div>
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                required
                disabled={isLoading}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/50 font-mono text-sm transition-all disabled:opacity-50 shadow-inner"
              />
            </div>
          </div>

          {/* Swarm Specializations Provisioning Matrix */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl space-y-5 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Users className="w-32 h-32 text-blue-500" />
            </div>
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-blue-950/80 flex items-center justify-center border border-blue-500/30">
                <Users className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">SWARM_SUB_AGENT_PROVISIONING_MATRIX</h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">Tether or untether specialized robotic modules</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 relative z-10">
              {PRESET_SPECIALIZATIONS.map((role) => {
                const isActive = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleToggleRole(role)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl border text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer relative overflow-hidden",
                      isActive
                        ? "bg-blue-500/10 border-blue-400/50 text-blue-400 shadow-md shadow-blue-500/10 hover:bg-blue-500/20"
                        : "bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400 hover:bg-slate-800/50"
                    )}
                    disabled={isLoading}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full shadow-sm", isActive ? "bg-blue-400 shadow-blue-400/50 animate-pulse" : "bg-slate-700")} />
                    {role}
                  </button>
                );
              })}
            </div>

            {/* Custom specialization input */}
            <div className="flex items-center gap-3 pt-2 relative z-10">
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
                className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleAddCustomRole}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-950/30 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all cursor-pointer"
                disabled={isLoading}
              >
                + Provision
              </button>
            </div>
            
            {/* Show currently provisioned non-preset custom roles */}
            {selectedRoles.filter(r => !PRESET_SPECIALIZATIONS.includes(r)).length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-800/80 relative z-10">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Custom Active Subnets:</span>
                <div className="flex flex-wrap gap-2.5">
                  {selectedRoles.filter(r => !PRESET_SPECIALIZATIONS.includes(r)).map(role => (
                    <div key={role} className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-mono shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shadow-sm shadow-rose-400/50" />
                      <span>{role}</span>
                      <button 
                        type="button" 
                        onClick={() => handleToggleRole(role)}
                        className="text-rose-400/60 hover:text-rose-300 ml-1.5 cursor-pointer bg-rose-950/50 hover:bg-rose-900 rounded-md p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 hover:text-yellow-400 transition-colors font-mono bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-xl hover:border-yellow-500/30"
            >
              <Settings className="w-3.5 h-3.5" />
              {showConfig ? 'Hide Advanced Configuration' : 'Advanced Model Configuration'}
            </button>
          </div>

          {showConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-inner"
            >
              <label htmlFor="models" className="block text-[10px] font-bold text-slate-400 mb-2 border-b border-slate-800 pb-2 font-mono uppercase tracking-widest">
                Available Models for Admin AI to Assign
              </label>
              <p className="text-[10px] text-slate-500 mb-3 font-mono tracking-wide">Comma separated list of models the Director AI can choose from.</p>
              <input
                id="models"
                type="text"
                value={modelsStr}
                onChange={(e) => setModelsStr(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 font-mono transition-all"
                disabled={isLoading}
              />
            </motion.div>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-800/60">
            <button
              type="submit"
              disabled={!prompt.trim() || !apiKey.trim() || isLoading}
              className={cn(
                "flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-xs transition-all relative overflow-hidden cursor-pointer font-mono group",
                "bg-yellow-400 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 hover:shadow-yellow-400/30 hover:-translate-y-0.5 active:translate-y-0"
              )}
            >
              {isLoading ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-yellow-900" />
                  ENGAGING SWARM...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-yellow-900 group-hover:scale-110 transition-transform" />
                  ENGAGE HIVEMIND
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
