import React from 'react';
import { DiscussionMessage } from '../types';
import { Cpu, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Props {
  discussion: DiscussionMessage[];
}

const markdownComponents = {
  p: ({ children }: any) => <p className="mb-2 last:mb-0 text-slate-300 text-sm leading-relaxed">{children}</p>,
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
  ul: ({ children }: any) => <ul className="list-disc pl-5 mb-2.5 space-y-1 text-slate-300">{children}</ul>,
  ol: ({ children }: any) => <ol className="list-decimal pl-5 mb-2.5 space-y-1 text-slate-300">{children}</ol>,
  li: ({ children }: any) => <li className="text-sm leading-relaxed">{children}</li>,
  h1: ({ children }: any) => <h1 className="text-base font-bold font-mono text-white mt-4 mb-2 uppercase tracking-wider border-b border-slate-800 pb-1">{children}</h1>,
  h2: ({ children }: any) => <h2 className="text-sm font-bold font-mono text-white mt-3 mb-1.5 uppercase tracking-wider">{children}</h2>,
  h3: ({ children }: any) => <h3 className="text-xs font-bold font-mono text-yellow-300 mt-2.5 mb-1 uppercase tracking-widest">{children}</h3>,
};

export function AgentDiscussion({ discussion }: Props) {
  if (!discussion || discussion.length === 0) return null;

  const getAgentStyle = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('architect')) {
      return {
        border: 'border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40',
        text: 'text-yellow-400',
        badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
      };
    }
    if (lowerRole.includes('developer') || lowerRole.includes('coder') || lowerRole.includes('engineer')) {
      return {
        border: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
        text: 'text-blue-400',
        badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
      };
    }
    if (lowerRole.includes('qa') || lowerRole.includes('test')) {
      return {
        border: 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40',
        text: 'text-rose-400',
        badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
      };
    }
    return {
      border: 'border-slate-800 bg-slate-900/60 hover:border-slate-700 shadow-sm',
      text: 'text-slate-300',
      badge: 'bg-slate-800 text-slate-400 border-slate-700/50'
    };
  };

  return (
    <div className="mb-8" id="agent-discussion-swarm">
      <div className="flex items-center gap-2.5 mb-5 pl-1">
        <Cpu className="w-5 h-5 text-yellow-400 animate-pulse" />
        <h2 className="text-sm font-bold text-white tracking-widest uppercase font-mono drop-shadow-sm">Swarm Consensus Room</h2>
      </div>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
        {discussion.map((msg, idx) => {
          const style = getAgentStyle(msg.role);
          const rawContent = typeof msg.content === 'object' ? JSON.stringify(msg.content, null, 2) : String(msg.content);
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.4) }}
              className={`relative overflow-hidden flex gap-5 p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 shadow-md ${style.border}`}
            >
              <div className="scanning-line opacity-5" />
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0 shadow-inner z-10">
                <Bot className={`w-5 h-5 ${style.text}`} />
              </div>
              <div className="flex-1 z-10 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-sm font-extrabold tracking-wide drop-shadow-sm ${style.text}`}>{msg.role}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shadow-sm ${style.badge}`}>
                    {msg.model}
                  </span>
                </div>
                <div className="markdown-body opacity-90 text-sm leading-relaxed">
                  <ReactMarkdown components={markdownComponents}>
                    {rawContent}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
