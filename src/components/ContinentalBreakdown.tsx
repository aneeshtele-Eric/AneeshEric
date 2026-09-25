import React, { useState } from 'react';

interface ContinentalBreakdownProps {
  onSelectContinent?: (continent: string) => void;
  activeContinent?: string;
}

export const ContinentalBreakdown: React.FC<ContinentalBreakdownProps> = ({
  onSelectContinent,
  activeContinent = 'ALL'
}) => {
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  const continents = [
    { name: 'South America', volume: 31.8, share: 54, count: '31.8 Million', color: '#10B981' },
    { name: 'Europe', volume: 15.3, share: 26, count: '15.3 Million', color: '#0EA5E9' },
    { name: 'North America', volume: 8.2, share: 14, count: '8.2 Million', color: '#F59E0B' },
    { name: 'Asia', volume: 2.1, share: 3.6, count: '2.1 Million', color: '#8B5CF6' },
    { name: 'Africa', volume: 0.8, share: 1.4, count: '0.8 Million', color: '#EC4899' },
    { name: 'Oceania', volume: 0.5, share: 0.9, count: '0.5 Million', color: '#64748B' }
  ];

  const maxVolume = 35; // Million scale

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#1E2D56] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2D56]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-sm shadow-[#0EA5E9]"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Chart 6: Continental Origin Breakdown
            </h3>
          </div>
          <span className="text-[10px] bg-[#0B132B] px-2 py-0.5 rounded text-[#94A3B8] border border-[#1E2D56]">
            Ranking
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] mt-2 mb-2">
          Volume contribution of international arrivals partitioned by continent.
        </p>

        {/* Horizontal Bars */}
        <div className="space-y-2.5 mt-3">
          {continents.map((item) => {
            const isSelected = activeContinent === item.name;
            const isHovered = hoveredContinent === item.name;
            const barWidthPercent = (item.volume / maxVolume) * 100;

            return (
              <div
                key={item.name}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredContinent(item.name)}
                onMouseLeave={() => setHoveredContinent(null)}
                onClick={() => onSelectContinent && onSelectContinent(item.name)}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span
                    className={`font-medium transition ${
                      isSelected
                        ? 'text-white font-bold'
                        : isHovered
                        ? 'text-white'
                        : 'text-gray-300'
                    }`}
                  >
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] font-mono text-[11px]">{item.volume}M</span>
                    <span className="text-white font-bold font-mono text-xs">{item.share}%</span>
                  </div>
                </div>

                {/* Progress Track */}
                <div className="h-4 w-full bg-[#0B132B] rounded-full overflow-hidden p-0.5 border border-[#1E2D56]/70">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidthPercent}%`,
                      backgroundColor: item.color,
                      opacity: isSelected || isHovered ? 1 : 0.85,
                      boxShadow: isSelected ? `0 0 10px ${item.color}` : undefined
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Axis & Footer Summary */}
      <div className="mt-3 pt-3 border-t border-[#1E2D56]/60 flex items-center justify-between text-xs text-[#94A3B8]">
        <span>Top Inbound: <strong className="text-emerald-400">South America (54%)</strong></span>
        <span>Europe: <strong className="text-[#0EA5E9]">26%</strong></span>
        <span>North America: <strong className="text-[#F59E0B]">14%</strong></span>
      </div>
    </div>
  );
};
