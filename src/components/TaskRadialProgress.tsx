import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SubTask } from '../types';
import { Cpu, Layers, Disc, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  tasks: SubTask[];
  status: string;
}

export function TaskRadialProgress({ tasks, status }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate overall task completion percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 105) / 1.05 : 0; // scale nicely up to 100

  // Calculate workload distribution among active agent roles
  const roleDistribution = React.useMemo(() => {
    if (totalTasks === 0) return [];
    const counts: { [key: string]: { count: number; model: string; completed: number } } = {};
    tasks.forEach((t) => {
      if (!counts[t.role]) {
        counts[t.role] = { count: 0, model: t.model, completed: 0 };
      }
      counts[t.role].count += 1;
      if (t.status === 'completed') {
        counts[t.role].completed += 1;
      }
    });
    return Object.entries(counts).map(([role, data]) => ({
      role,
      count: data.count,
      model: data.model,
      percentage: Math.round((data.count / totalTasks) * 100),
      completed: data.completed,
    }));
  }, [tasks, totalTasks]);

  useEffect(() => {
    if (!svgRef.current || totalTasks === 0) return;

    // Clear previous elements
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 240;
    const height = 240;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Define glowing neon filters
    const defs = svg.append('defs');
    const glowFilter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    glowFilter
      .append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    
    glowFilter
      .append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // 1. OUTER RING: Overall Completion Progress Bar (D3 Arc)
    const outerArcBackground = d3
      .arc()
      .innerRadius(radius - 12)
      .outerRadius(radius - 4)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    svg
      .append('path')
      .attr('d', outerArcBackground as any)
      .attr('fill', '#1e293b') // slate-800
      .attr('opacity', 0.5);

    const outerArcForeground = d3
      .arc()
      .innerRadius(radius - 12)
      .outerRadius(radius - 4)
      .cornerRadius(4)
      .startAngle(0);

    const progressAngle = (progressPercent / 100) * 2 * Math.PI;

    // Outer progress path with cyan glow
    svg
      .append('path')
      .datum({ endAngle: progressAngle })
      .attr('d', outerArcForeground as any)
      .attr('fill', '#eab308') // yellow-500
      .attr('filter', 'url(#glow)')
      .attr('opacity', progressPercent > 0 ? 0.95 : 0);

    // 2. INNER DONUT CHART: Agent Workload Distribution
    const innerRadiusStart = radius - 38;
    const innerRadiusEnd = radius - 18;

    const pie = d3
      .pie<typeof roleDistribution[0]>()
      .value((d) => d.count)
      .sort(null);

    const arcGenerator = d3
      .arc<d3.PieArcDatum<typeof roleDistribution[0]>>()
      .innerRadius(innerRadiusStart)
      .outerRadius(innerRadiusEnd)
      .padAngle(0.04)
      .cornerRadius(3);

    // Color palette for agents (Yellow, Blue, Red variants)
    const colors = ['#eab308', '#2563eb', '#ef4444', '#f59e0b', '#3b82f6', '#dc2626'];

    const pathData = pie(roleDistribution);

    // Render slices
    const gSlices = svg
      .selectAll('.slice')
      .data(pathData)
      .enter()
      .append('g')
      .attr('class', 'slice');

    gSlices
      .append('path')
      .attr('d', arcGenerator as any)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1)
          .attr('transform', 'scale(1.03)');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.8)
          .attr('transform', 'scale(1)');
      });

    // 3. INNERMOST DECORATIVE TICK MARKS
    const tickCount = 24;
    const tickLength = 4;
    const tickInnerRadius = innerRadiusStart - 8;

    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * 2 * Math.PI;
      const x1 = Math.cos(angle) * tickInnerRadius;
      const y1 = Math.sin(angle) * tickInnerRadius;
      const x2 = Math.cos(angle) * (tickInnerRadius - tickLength);
      const y2 = Math.sin(angle) * (tickInnerRadius - tickLength);

      svg
        .append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', i % 6 === 0 ? '#eab308' : '#1e293b')
        .attr('stroke-width', i % 6 === 0 ? 1.5 : 1)
        .attr('opacity', 0.6);
    }

  }, [roleDistribution, progressPercent, totalTasks]);

  return (
    <div className="cyber-panel p-5 rounded-2xl relative overflow-hidden bg-slate-950/40 border border-slate-800 transition-all duration-300">
      <div className="scanning-line opacity-10" />
      
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 z-10 relative select-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-yellow-400 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">SWARM_WORKLOAD_MATRIX</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">D3 Real-time allocation analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
            D3_V7
          </span>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-0.5 rounded hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors text-slate-400 hover:text-white"
            title={isCollapsed ? "Expand chart" : "Collapse chart"}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10 relative">
              {totalTasks === 0 ? (
                /* Empty / Discussion phase state */
                <div className="col-span-12 py-10 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Concentric high-tech rotating vectors */}
                    <div className="absolute inset-0 border border-dashed border-yellow-500/20 rounded-full animate-[spin_12s_linear_infinite]" />
                    <div className="absolute inset-2 border border-slate-800 rounded-full" />
                    <div className="absolute inset-4 border border-yellow-500/10 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
                    <Disc className="w-8 h-8 text-yellow-500/40 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest animate-pulse">Awaiting Core Decomposition...</p>
                    <p className="text-[10px] font-mono text-slate-500 max-w-xs">
                      Matrix allocations will compute dynamically when the board approves the task list.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Left: SVG D3 Chart Canvas */}
                  <div className="col-span-12 md:col-span-5 flex justify-center relative">
                    <svg ref={svgRef} className="mx-auto select-none overflow-visible" />
                    {/* Center Readout Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">COMPLETE</span>
                      <span className="text-2xl font-mono font-black text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                        {progressPercent}%
                      </span>
                      <span className="text-[8px] font-mono text-slate-600 tracking-tight uppercase">
                        {completedTasks}/{totalTasks} SECS
                      </span>
                    </div>
                  </div>

                  {/* Right: Data Legend */}
                  <div className="col-span-12 md:col-span-7 space-y-3">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-850">
                      Agent Work Distribution
                    </div>
                    <div className="space-y-2.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      {roleDistribution.map((item, index) => {
                        const colors = ['#eab308', '#2563eb', '#ef4444', '#f59e0b', '#3b82f6', '#dc2626'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div key={item.role} className="flex items-center justify-between text-xs font-mono group p-1 hover:bg-slate-900/40 rounded transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded" style={{ backgroundColor: color }} />
                              <div className="truncate max-w-[120px] sm:max-w-[150px]">
                                <p className="font-bold text-slate-300 group-hover:text-yellow-400 transition-colors">{item.role}</p>
                                <p className="text-[9px] text-slate-600 truncate">{item.model}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-300 font-bold">{item.percentage}%</span>
                              <span className="text-slate-500 text-[10px] block font-medium">
                                ({item.completed}/{item.count} Done)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
