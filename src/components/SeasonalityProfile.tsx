import React, { useState } from 'react';
import { MONTH_NAMES } from '../data/tourismData';

interface SeasonalityProfileProps {
  monthlyData: number[]; // 12 values
  activeMonthIndex?: number | null;
  onSelectMonth?: (index: number) => void;
  isCrossLinked?: boolean;
}

export const SeasonalityProfile: React.FC<SeasonalityProfileProps> = ({
  monthlyData,
  activeMonthIndex,
  onSelectMonth,
  isCrossLinked = true
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const maxVal = Math.max(...monthlyData, 1000000);
  const chartHeight = 160;

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#1E2D56] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2D56]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm shadow-[#F59E0B]"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Chart 3: Seasonality Profile (Jan-Dec)
            </h3>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded border ${
              isCrossLinked
                ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 animate-pulse-subtle'
                : 'bg-[#0B132B] text-[#94A3B8] border-[#1E2D56]'
            }`}
          >
            Cross-Linked
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] mt-2 mb-2">
          Aggregated monthly seasonality showing Carnival/Summer peak vs off-peak winter.
        </p>

        {/* 12-Month Bar Chart */}
        <div className="relative h-[210px] pt-4 flex items-end justify-between gap-1.5 sm:gap-2">
          {monthlyData.map((val, idx) => {
            const isPeak = idx === 0 || idx === 1 || idx === 11;
            const isSelected = activeMonthIndex === idx;
            const isHovered = hoveredMonth === idx;
            const barHeight = Math.max(12, (val / maxVal) * chartHeight);

            // Color selection
            let barColor = isPeak ? '#F59E0B' : '#0EA5E9';
            if (activeMonthIndex !== null && activeMonthIndex !== undefined) {
              barColor = isSelected ? '#10B981' : 'rgba(14, 165, 233, 0.35)';
            } else if (isHovered) {
              barColor = '#38BDF8';
            }

            return (
              <div
                key={MONTH_NAMES[idx]}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredMonth(idx)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => onSelectMonth && onSelectMonth(idx)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 bg-[#131D38] border border-[#F59E0B]/50 px-2 py-1 rounded text-[10px] text-white shadow-xl whitespace-nowrap pointer-events-none">
                    <span className="font-bold text-[#F59E0B]">{MONTH_NAMES[idx]}:</span> {val.toLocaleString()}
                  </div>
                )}

                {/* Animated Bar */}
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: barColor,
                    boxShadow: isPeak ? '0 0 12px rgba(245, 158, 11, 0.25)' : undefined
                  }}
                />

                {/* Month Label */}
                <span
                  className={`text-[10px] mt-1.5 font-mono ${
                    isSelected ? 'text-[#10B981] font-bold' : isPeak ? 'text-[#F59E0B] font-semibold' : 'text-[#94A3B8]'
                  }`}
                >
                  {MONTH_NAMES[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-3 pt-3 border-t border-[#1E2D56]/60 flex items-center justify-between text-xs text-[#94A3B8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#F59E0B]"></span>
          <span>Peak Months: <strong className="text-gray-200">Jan • Feb • Dec</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#0EA5E9]"></span>
          <span>Low Trough: <strong className="text-gray-200">May • Jun</strong></span>
        </div>
      </div>
    </div>
  );
};
