import React, { useState } from 'react';
import { Plane, Bus, Ship, Waves } from 'lucide-react';

interface ModalTransportSplitProps {
  onSelectModality?: (mode: string) => void;
  activeModality?: string;
}

export const ModalTransportSplit: React.FC<ModalTransportSplitProps> = ({
  onSelectModality,
  activeModality = 'ALL'
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const modes = [
    { name: 'Air (Aéreo)', modeKey: 'Air', share: 64.8, count: '38.0M passengers', color: '#0EA5E9', icon: Plane },
    { name: 'Land (Terrestre)', modeKey: 'Land', share: 32.1, count: '18.8M cross-border', color: '#10B981', icon: Bus },
    { name: 'Sea (Marítimo)', modeKey: 'Sea', share: 2.2, count: '1.3M cruise liners', color: '#F59E0B', icon: Ship },
    { name: 'River (Fluvial)', modeKey: 'River', share: 0.9, count: '0.5M Amazonian ports', color: '#A855F7', icon: Waves }
  ];

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#1E2D56] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2D56]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Chart 2: Modal Transport Split
            </h3>
          </div>
          <span className="text-[10px] bg-[#0B132B] px-2 py-0.5 rounded text-[#94A3B8] border border-[#1E2D56]">
            Mode of Entry
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] mt-2 mb-3">
          Distribution of incoming visitors by transportation category.
        </p>

        {/* Donut Chart */}
        <div className="relative h-[190px] flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#0B132B"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {modes.map((item, idx) => {
              const strokeDasharray = `${(item.share / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.share;
              const isHovered = hoveredIdx === idx;
              const isSelected = activeModality === item.modeKey;

              return (
                <circle
                  key={item.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={isHovered || isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => onSelectModality && onSelectModality(item.modeKey)}
                />
              );
            })}
          </svg>

          {/* Donut Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredIdx !== null ? (
              <>
                <span className="text-xl font-black text-white font-sans">
                  {modes[hoveredIdx].share}%
                </span>
                <span className="text-[10px] text-gray-300 font-medium">
                  {modes[hoveredIdx].modeKey}
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-black text-white font-sans">58.7M</span>
                <span className="text-[10px] text-[#94A3B8]">Total Recorded</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4 Cards Footer */}
      <div className="mt-4 pt-3 border-t border-[#1E2D56]/60 grid grid-cols-2 gap-2 text-xs">
        {modes.map((m, idx) => {
          const Icon = m.icon;
          const isSelected = activeModality === m.modeKey;
          return (
            <div
              key={m.name}
              onClick={() => onSelectModality && onSelectModality(m.modeKey)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                isSelected
                  ? 'bg-[#1E2D56] border-[#0EA5E9] shadow-sm'
                  : 'bg-[#0B132B]/60 border-[#1E2D56] hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                  {m.name.split(' ')[0]}
                </span>
                <span className="font-bold text-white">{m.share}%</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{m.count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
