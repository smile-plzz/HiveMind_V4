import React from 'react';
import { motion } from 'motion/react';
import { SubTask } from '../types';
import { CheckCircle2, Circle, Loader2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

const markdownComponents = {
  p: ({ children }: any) => <p className="mb-2 last:mb-0 text-slate-300 text-sm leading-relaxed">{children}</p>,
  strong: ({ children }: any) => <strong className="text-cyan-400 font-extrabold tracking-wide">{children}</strong>,
  em: ({ children }: any) => <em className="text-indigo-300 italic">{children}</em>,
  code: ({ children, ...props }: any) => {
    const isInline = typeof children === 'string' && !children.includes('\n');
    return isInline ? (
      <code className="font-mono text-xs bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/20 font-semibold">
        {children}
      </code>
    ) : (
      <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl my-2 overflow-x-auto max-w-full font-mono text-xs text-indigo-200">
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

interface Props {
  task: SubTask;
  index: number;
  key?: React.Key;
}

const statusConfig = {
  pending: { icon: Circle, color: 'text-slate-500', bg: 'bg-slate-900/40', border: 'border-slate-800/60' },
  running: { icon: Loader2, color: 'text-yellow-400', bg: 'bg-yellow-950/20', border: 'border-yellow-500/30 shadow-lg shadow-yellow-500/5' },
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/10', border: 'border-emerald-500/30 shadow-md shadow-emerald-500/5' },
  failed: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-950/10', border: 'border-rose-500/30 shadow-md shadow-rose-500/5' }
};

export function TaskNode({ task, index }: Props) {
  const config = statusConfig[task.status];
  const Icon = config.icon;
  const [expanded, setExpanded] = React.useState(task.status === 'completed' || task.status === 'failed');

  // Auto-expand when finished
  React.useEffect(() => {
    if (task.status === 'completed' || task.status === 'failed') {
      setExpanded(true);
    }
  }, [task.status]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-5"
    >
      <div className="flex flex-col items-center">
        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm", config.bg, config.border)}>
          <Icon className={cn("w-4.5 h-4.5", config.color, task.status === 'running' && "animate-spin")} />
        </div>
        <div className="w-px h-full bg-slate-800/80 my-2" />
      </div>

      <div className={cn("flex-1 mb-8 rounded-2xl border p-6 transition-colors shadow-sm", config.bg, config.border)}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800/80 text-slate-400 shadow-sm">
                {task.model}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded shadow-sm">
                Node: {task.role}
              </span>
            </div>
            <h3 className="font-bold tracking-tight text-white text-lg leading-snug drop-shadow-sm">{task.title}</h3>
          </div>
          
          {(task.status === 'completed' || task.status === 'failed' || task.result) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 hover:bg-slate-800/80 rounded-lg transition-colors shrink-0 text-slate-400 border border-transparent hover:border-slate-700"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        <p className="text-sm text-slate-400 mb-2 leading-relaxed">{task.description}</p>
        
        {expanded && task.result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 space-y-6 pt-5 border-t border-slate-800/60"
          >
            <div>
              <div className="text-[10px] font-mono font-bold text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                Output Summary
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-6 overflow-x-auto markdown-body shadow-inner">
                <ReactMarkdown components={markdownComponents}>
                  {typeof task.result === 'object' ? JSON.stringify(task.result, null, 2) : String(task.result)}
                </ReactMarkdown>
              </div>
            </div>
            
            {task.deliverables && task.deliverables.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Deliverables ({task.deliverables.length} files)
                  </div>
                  <button
                    onClick={() => {
                      import('jszip').then(({ default: JSZip }) => {
                        const zip = new JSZip();
                        task.deliverables!.forEach(d => {
                          const fileContent = typeof d.content === 'object' ? JSON.stringify(d.content, null, 2) : String(d.content);
                          zip.file(d.filename, fileContent);
                        });
                        zip.generateAsync({ type: 'blob' }).then(content => {
                          const url = URL.createObjectURL(content);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `deliverables-${task.id}.zip`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        });
                      });
                    }}
                    className="text-[10px] font-bold tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/20"
                  >
                    Download ZIP
                  </button>
                </div>
                {task.deliverables.map((d, i) => (
                  <div key={i} className="mb-5 last:mb-0">
                    <div className="text-[10px] font-bold font-mono text-slate-400 mb-2 pl-1 tracking-wider">{d.filename}</div>
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 overflow-x-auto max-h-72 overflow-y-auto custom-scrollbar shadow-inner">
                      <pre className="text-xs font-mono text-cyan-300/90 whitespace-pre-wrap leading-relaxed">
                        {typeof d.content === 'object' ? JSON.stringify(d.content, null, 2) : String(d.content)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
