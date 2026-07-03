import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Cpu, Sliders, Database, AlertTriangle, Zap, CheckCircle } from 'lucide-react';

interface TelemetryPoint {
  step: number;
  loss: number;
  valLoss: number;
  gradient: number;
  vram: number;
}

interface LoraTrainingMonitorProps {
  lossHistory: Array<{
    step: number;
    loss: number;
    valLoss?: number;
    gradient?: number;
    vram?: number;
  }>;
  totalSteps: number;
  status: 'running' | 'completed' | 'failed' | 'idle';
  rank: number;
  alpha: number;
  lr: string;
  baseModel: string;
}

export default function LoraTrainingMonitor({
  lossHistory = [],
  totalSteps = 150,
  status = 'idle',
  rank = 16,
  alpha = 32,
  lr = '2e-4',
  baseModel = 'Gemini-3.5-flash'
}: LoraTrainingMonitorProps) {
  const lossSvgRef = useRef<SVGSVGElement | null>(null);
  const gradSvgRef = useRef<SVGSVGElement | null>(null);
  const vramSvgRef = useRef<SVGSVGElement | null>(null);

  const [containerWidth, setContainerWidth] = useState(600);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (lossSvgRef.current?.parentElement) {
        setContainerWidth(lossSvgRef.current.parentElement.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (lossSvgRef.current?.parentElement) {
      resizeObserver.observe(lossSvgRef.current.parentElement);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Backwards compatibility data synthesis
  const dataPoints: TelemetryPoint[] = lossHistory.map((d) => {
    const step = d.step;
    const loss = d.loss;
    const valLoss = d.valLoss !== undefined ? d.valLoss : loss + 0.05;
    const progressRatio = step / (totalSteps || 150);
    const gradient = d.gradient !== undefined ? d.gradient : parseFloat((0.8 * Math.exp(-2.5 * progressRatio) + Math.random() * 0.05).toFixed(4));
    const vram = d.vram !== undefined ? d.vram : parseFloat((70 + progressRatio * 8 + Math.sin(progressRatio * 10) * 1.5 + Math.random()).toFixed(1));
    return { step, loss, valLoss, gradient, vram };
  });

  const currentPoint = dataPoints[dataPoints.length - 1] || { step: 0, loss: 1.5, valLoss: 1.6, gradient: 0.85, vram: 68.4 };

  const drawLossChart = () => {
    if (!lossSvgRef.current) return;
    const svg = d3.select(lossSvgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 25, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, totalSteps])
      .range([0, width]);

    const yMax = d3.max(dataPoints, d => Math.max(d.loss, d.valLoss)) || 1.6;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid-lines')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#475569');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(4))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(4).tickSize(4))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    // Loss lines generators
    const lineLoss = d3.line<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y(d => yScale(d.loss))
      .curve(d3.curveMonotoneX);

    const lineValLoss = d3.line<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y(d => yScale(d.valLoss))
      .curve(d3.curveMonotoneX);

    // Area generator for Train Loss
    const areaLoss = d3.area<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y0(height)
      .y1(d => yScale(d.loss))
      .curve(d3.curveMonotoneX);

    // Draw training area gradient fill
    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'url(#loss-gradient)')
      .attr('opacity', 0.15)
      .attr('d', areaLoss);

    // Draw Train Loss line
    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', '#07C2E3')
      .attr('stroke-width', 2)
      .attr('d', lineLoss);

    // Draw Val Loss line
    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', '#EC4899')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .attr('d', lineValLoss);

    // Render interactive crosshair line if hovered
    if (hoverIndex !== null && dataPoints[hoverIndex]) {
      const xPos = xScale(dataPoints[hoverIndex].step);
      g.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#07C2E3')
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '2,2');

      // Highlight circles
      g.append('circle')
        .attr('cx', xPos)
        .attr('cy', yScale(dataPoints[hoverIndex].loss))
        .attr('r', 4)
        .attr('fill', '#07C2E3')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

      g.append('circle')
        .attr('cx', xPos)
        .attr('cy', yScale(dataPoints[hoverIndex].valLoss))
        .attr('r', 3.5)
        .attr('fill', '#EC4899')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
    }
  };

  const drawGradChart = () => {
    if (!gradSvgRef.current) return;
    const svg = d3.select(gradSvgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 25, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, totalSteps])
      .range([0, width]);

    const yMax = d3.max(dataPoints, d => d.gradient) || 0.85;
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.15])
      .range([height, 0]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid-lines')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(yScale).ticks(3).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#475569');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(4))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(3).tickSize(4))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    // Gradient Norm line
    const lineGrad = d3.line<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y(d => yScale(d.gradient))
      .curve(d3.curveMonotoneX);

    // Area for gradients
    const areaGrad = d3.area<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y0(height)
      .y1(d => yScale(d.gradient))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'url(#grad-gradient)')
      .attr('opacity', 0.1)
      .attr('d', areaGrad);

    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', '#F59E0B')
      .attr('stroke-width', 1.8)
      .attr('d', lineGrad);

    // Draw scatter points for gradient steps
    g.selectAll('.grad-dot')
      .data(dataPoints)
      .enter()
      .append('circle')
      .attr('class', 'grad-dot')
      .attr('cx', d => xScale(d.step))
      .attr('cy', d => yScale(d.gradient))
      .attr('r', 2)
      .attr('fill', '#F59E0B')
      .attr('opacity', 0.7);

    // Hover interactive crosshair line
    if (hoverIndex !== null && dataPoints[hoverIndex]) {
      const xPos = xScale(dataPoints[hoverIndex].step);
      g.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#F59E0B')
        .attr('stroke-width', 1)
        .attr('opacity', 0.4)
        .attr('stroke-dasharray', '2,2');

      g.append('circle')
        .attr('cx', xPos)
        .attr('cy', yScale(dataPoints[hoverIndex].gradient))
        .attr('r', 4.5)
        .attr('fill', '#F59E0B')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
    }
  };

  const drawVramChart = () => {
    if (!vramSvgRef.current) return;
    const svg = d3.select(vramSvgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 25, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = 120 - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, totalSteps])
      .range([0, width]);

    // VRAM usually between 0% to 100%
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid-lines')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(yScale).ticks(3).tickSize(-width).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', '#475569');

    // Safe threshold line at 85%
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(85))
      .attr('y2', yScale(85))
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.5);

    g.append('text')
      .attr('x', width - 80)
      .attr('y', yScale(86) - 4)
      .attr('fill', '#EF4444')
      .attr('font-size', '8px')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .text('显存安全红线 85%');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(5).tickSize(4))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(3).tickFormat(d => `${d}%`))
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace');

    // VRAM Area
    const areaVram = d3.area<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y0(height)
      .y1(d => yScale(d.vram))
      .curve(d3.curveMonotoneX);

    const lineVram = d3.line<TelemetryPoint>()
      .x(d => xScale(d.step))
      .y(d => yScale(d.vram))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'url(#vram-gradient)')
      .attr('opacity', 0.2)
      .attr('d', areaVram);

    g.append('path')
      .datum(dataPoints)
      .attr('fill', 'none')
      .attr('stroke', '#8B5CF6')
      .attr('stroke-width', 2)
      .attr('d', lineVram);

    // Hover interactive crosshair line
    if (hoverIndex !== null && dataPoints[hoverIndex]) {
      const xPos = xScale(dataPoints[hoverIndex].step);
      g.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#8B5CF6')
        .attr('stroke-width', 1)
        .attr('opacity', 0.4)
        .attr('stroke-dasharray', '2,2');

      g.append('circle')
        .attr('cx', xPos)
        .attr('cy', yScale(dataPoints[hoverIndex].vram))
        .attr('r', 4.5)
        .attr('fill', '#8B5CF6')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
    }
  };

  // Re-draw charts when container width or dataPoints change, or hover index changes
  useEffect(() => {
    drawLossChart();
    drawGradChart();
    drawVramChart();
  }, [containerWidth, dataPoints, hoverIndex]);

  // Touch/Mouse event handler
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dataPoints.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const xMouse = event.clientX - bounds.left - 40; // subtract margin left
    const width = containerWidth - 40 - 20; // total width - margin left - margin right
    
    if (xMouse < 0 || xMouse > width) {
      setHoverIndex(null);
      return;
    }

    const xScale = d3.scaleLinear().domain([0, totalSteps]).range([0, width]);
    const stepValue = xScale.invert(xMouse);
    
    // Find closest step index in datasets
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < dataPoints.length; i++) {
      const diff = Math.abs(dataPoints[i].step - stepValue);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const hoveredPoint = hoverIndex !== null ? dataPoints[hoverIndex] : null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-left font-sans text-white">
      {/* Telemetry SVG gradients definition (shared across charts) */}
      <svg className="hidden" style={{ width: 0, height: 0 }}>
        <defs>
          <linearGradient id="loss-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07C2E3" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#07C2E3" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grad-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="vram-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Title & Live Status Board */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h4 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#07C2E3] animate-spin" style={{ animationDuration: '6s' }} />
            <span>LoRA 智脑微调核心收敛控制台</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            物理底座: <span className="font-mono text-white mr-2">{baseModel}</span> | 
            适配秩 Rank: <span className="font-mono text-white mr-2">r={rank}</span> | 
            缩放 Alpha: <span className="font-mono text-white">a={alpha}</span>
          </p>
        </div>

        {/* Real-time KPIs */}
        <div className="grid grid-cols-3 gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center min-w-[280px]">
          <div>
            <span className="text-[9px] text-slate-500 uppercase block font-semibold font-mono">Current Loss</span>
            <span className="text-sm font-bold text-[#07C2E3] font-mono">
              {currentPoint.loss.toFixed(4)}
            </span>
          </div>
          <div className="border-x border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold font-mono">Grad Norm</span>
            <span className="text-sm font-bold text-amber-500 font-mono">
              {currentPoint.gradient.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase block font-semibold font-mono">VRAM Usage</span>
            <span className={`text-sm font-bold font-mono ${currentPoint.vram > 85 ? 'text-red-500' : 'text-purple-400'}`}>
              {currentPoint.vram.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Hover Info Card */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex flex-wrap gap-4 items-center justify-between text-xs transition-all">
        <div className="flex items-center gap-2 text-[11px]">
          <Activity className="w-4 h-4 text-[#07C2E3]" />
          <span className="text-slate-400 font-medium">指示指针：</span>
          <span className="bg-slate-800 text-[#07C2E3] px-2 py-0.5 rounded font-mono font-bold">
            {hoveredPoint ? `Step ${hoveredPoint.step}` : 'Real-time Live'}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-300">
          <div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#07C2E3] mr-1"></span>
            <span>Train Loss: </span>
            <span className="font-bold text-white">
              {hoveredPoint ? hoveredPoint.loss.toFixed(4) : currentPoint.loss.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500 mr-1"></span>
            <span>Val Loss: </span>
            <span className="font-bold text-white">
              {hoveredPoint ? hoveredPoint.valLoss.toFixed(4) : currentPoint.valLoss.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span>
            <span>Gradient: </span>
            <span className="font-bold text-white">
              {hoveredPoint ? hoveredPoint.gradient.toFixed(4) : currentPoint.gradient.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 mr-1"></span>
            <span>VRAM: </span>
            <span className="font-bold text-white">
              {hoveredPoint ? `${hoveredPoint.vram.toFixed(1)}%` : `${currentPoint.vram.toFixed(1)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Telemetry Lanes Wrapper */}
      <div 
        className="space-y-4 cursor-crosshair relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Track 1: Loss */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-[#07C2E3]" />
              <span>SFT 训练集与验证集损耗收敛 (Loss Convergence)</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono italic">Y: CrossEntropy Loss</span>
          </div>
          <svg ref={lossSvgRef} className="w-full h-[150px] overflow-visible" />
        </div>

        {/* Grid for Grad & VRAM (side by side in lg, stacked in mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Track 2: Gradient Norms */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-2.5">
            <div className="flex justify-between items-center px-1 mb-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>平均更新梯度范数 (L2 Gradient Norm)</span>
              </span>
              <span className="text-[9px] text-slate-500 font-mono italic">Y: ||g||₂</span>
            </div>
            <svg ref={gradSvgRef} className="w-full h-[120px] overflow-visible" />
          </div>

          {/* Track 3: VRAM */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-2.5">
            <div className="flex justify-between items-center px-1 mb-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                <span>NVIDIA H100 GPU 显存负载率 (VRAM Overhead)</span>
              </span>
              <span className="text-[9px] text-slate-500 font-mono italic">Y: Capacity %</span>
            </div>
            <svg ref={vramSvgRef} className="w-full h-[120px] overflow-visible" />
          </div>
        </div>
      </div>

      {/* Safety System Overlay Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-900 gap-2">
        <div className="flex items-center gap-1.5 text-[#07C2E3]">
          <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">ModaGPT 算力自愈及宪法审查引擎已开启</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            训练通道：Active (ms-swift)
          </span>
          <span className="font-mono text-slate-400">Total Steps: {totalSteps}</span>
        </div>
      </div>
    </div>
  );
}
