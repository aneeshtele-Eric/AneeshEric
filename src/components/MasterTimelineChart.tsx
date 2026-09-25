import React, { useState, useRef } from 'react';
import { MonthlyPoint } from '../data/tourismData';

interface MasterTimelineChartProps {
  data: MonthlyPoint[];
  activePeriod: 'ALL' | 'PRE_COVID' | 'PANDEMIC' | 'RECOVERY';
  onPeriodSelect: (period: 'ALL' | 'PRE_COVID' | 'PANDEMIC' | 'RECOVERY') => void;
  onPointSelect?: (point: MonthlyPoint) => void;
  selectedPointId?: string | null;
}

export const MasterTimelineChart: React.FC<MasterTimelineChartProps> = ({
  data,
  activePeriod,
  onPeriodSelect,
  onPointSelect,
  selectedPointId
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG dimensions
  const width = 1100;
  const height = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxY = 950000;
  const minY = 0;

  // Calculate coordinates for all data points
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.arrivals - minY) / (maxY - minY)) * chartHeight;
    return { x, y, data: d, index: i };
  });

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      // Catmull-Rom to Cubic Bezier control points
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return d;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Y-axis ticks (0k, 100k, 200k, ..., 900k)
  const yTicks = [0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000];

  // X-axis label points (sample 12 key labels)
  const xTickIndices = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 119];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    // Find nearest point
    let nearestIdx = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = idx;
      }
    });

    setHoveredIndex(nearestIdx);
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <section className="glass-card rounded-2xl p-5 border border-[#1E2D56] relative">
      
      {/* Header & Brush Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-[#1E2D56] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-sm shadow-[#0EA5E9]"></span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Chart 1: Master Timeline Trend & Cross-Filtering Brush (2015 – 2024)
            </h2>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Monthly international inbound arrivals. Click quick era presets or points to cross-filter Seasonality and State maps.
          </p>
        </div>

        {/* Timeline Segment Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs bg-[#0B132B] p-1 rounded-xl border border-[#1E2D56]">
          <span className="text-[11px] font-semibold text-[#94A3B8] px-2">Timeline Brush:</span>
          
          <button
            onClick={() => onPeriodSelect('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activePeriod === 'ALL'
                ? 'bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#1E2D56]'
            }`}
          >
            10-Yr Full
          </button>
          
          <button
            onClick={() => onPeriodSelect('PRE_COVID')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activePeriod === 'PRE_COVID'
                ? 'bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#1E2D56]'
            }`}
          >
            2015–2019 (Pre-Covid)
          </button>
          
          <button
            onClick={() => onPeriodSelect('PANDEMIC')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activePeriod === 'PANDEMIC'
                ? 'bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#1E2D56]'
            }`}
          >
            2020–2021 (Restrictions)
          </button>
          
          <button
            onClick={() => onPeriodSelect('RECOVERY')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              activePeriod === 'RECOVERY'
                ? 'bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-white font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#1E2D56]'
            }`}
          >
            2022–2024 (Boom Period)
          </button>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full mt-4 h-[280px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair select-none"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            if (activePoint && onPointSelect) {
              onPointSelect(activePoint.data);
            }
          }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines and Y axis ticks */}
          {yTicks.map((val) => {
            const y = paddingTop + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '2, 4'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {val === 0 ? '0k' : `${(val / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          {areaPath && (
            <path d={areaPath} fill="url(#areaGradient)" />
          )}

          {/* Trend line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* X Axis labels */}
          {xTickIndices.map((idx) => {
            const pt = points[idx];
            if (!pt) return null;
            return (
              <text
                key={idx}
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {pt.data.label}
              </text>
            );
          })}

          {/* Selected point indicator if any */}
          {selectedPointId && (
            (() => {
              const selPt = points.find(p => p.data.id === selectedPointId);
              if (!selPt) return null;
              return (
                <g>
                  <circle cx={selPt.x} cy={selPt.y} r="8" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.8" />
                  <circle cx={selPt.x} cy={selPt.y} r="4" fill="#10B981" />
                </g>
              );
            })()
          )}

          {/* Hover crosshair and active tooltip node */}
          {activePoint && (
            <g pointerEvents="none">
              {/* Vertical guideline */}
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={paddingTop + chartHeight}
                stroke="#10B981"
                strokeWidth="1.2"
                strokeDasharray="3, 3"
                opacity="0.85"
              />

              {/* Glowing point */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="7"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="url(#glow)"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-[#131D38]/95 backdrop-blur-md border border-[#0EA5E9]/50 rounded-xl px-3 py-2 shadow-2xl text-xs text-white"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${Math.max(30, (activePoint.y / height) * 100 - 8)}%`
            }}
          >
            <div className="font-bold text-[#0EA5E9] text-[11px] mb-0.5 flex items-center justify-between gap-3">
              <span>{activePoint.data.month} {activePoint.data.year}</span>
              <span className="text-[10px] text-gray-400 font-normal">Click to cross-filter</span>
            </div>
            <div className="text-sm font-extrabold text-white">
              {activePoint.data.arrivals.toLocaleString()} <span className="text-[10px] font-normal text-emerald-400">visitors</span>
            </div>
            {activePoint.data.notes && (
              <div className="text-[10px] text-[#F59E0B] font-medium mt-1 pt-1 border-t border-[#1E2D56]">
                ★ {activePoint.data.notes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Annotations Footer */}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-[#94A3B8] pt-3 border-t border-[#1E2D56]/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          <span><strong>2016:</strong> Rio Olympic Games spike (840k / Aug)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>
          <span><strong>2019:</strong> Visa Exemption (USA/CAN/AUS/JPN)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span>
          <span><strong>2020–2021:</strong> Global Border Halts (-78% dip)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span><strong>2023–2024:</strong> Post-Pandemic Record (6.8M/yr)</span>
        </div>
      </div>

    </section>
  );
};
