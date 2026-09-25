import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, TrendingUp, Compass } from 'lucide-react';
import { WORLD_HUBS, OriginHub } from '../data/tourismData';

interface WorldOriginMapProps {
  onSelectCountry?: (country: string) => void;
  selectedCountry?: string;
}

export const WorldOriginMap: React.FC<WorldOriginMapProps> = ({
  onSelectCountry,
  selectedCountry = 'ALL'
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredHub, setHoveredHub] = useState<OriginHub | null>(null);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.8, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, +(z - 0.2).toFixed(1)));
  const handleResetZoom = () => setZoomLevel(1);

  // Brazil destination hub coordinates on the world map SVG
  const brazilHub = { x: 330, y: 350 };

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#1E2D56] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#1E2D56] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-sm shadow-[#0EA5E9]"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Chart 5: Global Origin World Map & Inbound Hubs
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Origin of inbound international tourists sending travelers to Brazil.
            </p>
          </div>
          <span className="text-xs text-[#94A3B8] flex items-center gap-1 font-medium">
            <Compass className="w-3.5 h-3.5 text-[#0EA5E9]" /> 186 Nations
          </span>
        </div>

        {/* Map Container */}
        <div className="mt-4 relative rounded-xl overflow-hidden border border-[#1E2D56] h-[360px] w-full bg-[#0a1226]">
          
          {/* Zoom Controls */}
          <div className="absolute top-3 left-3 z-30 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 bg-[#131D38] border border-[#1E2D56] hover:bg-[#1E2D56] text-white rounded flex items-center justify-center text-xs transition cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 bg-[#131D38] border border-[#1E2D56] hover:bg-[#1E2D56] text-white rounded flex items-center justify-center text-xs transition cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="w-7 h-7 bg-[#131D38] border border-[#1E2D56] hover:bg-[#1E2D56] text-white rounded flex items-center justify-center text-xs transition cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Floating Velocity Badge */}
          <div className="absolute bottom-3 right-3 z-30 bg-[#0B132B]/90 backdrop-blur-md border border-[#1E2D56] p-2.5 rounded-lg text-xs shadow-lg pointer-events-none">
            <span className="font-bold text-white block text-[11px] mb-0.5">Flight Path Velocity</span>
            <span className="text-[#10B981] flex items-center gap-1 font-medium text-[11px]">
              <TrendingUp className="w-3 h-3" /> High Mercosul Drive
            </span>
          </div>

          {/* SVG World Map */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 select-none"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              <defs>
                <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* World Continents simplified shapes */}
              {/* North America */}
              <path
                d="M 120 70 Q 220 50 280 80 Q 320 120 280 170 Q 250 230 180 230 Q 140 210 110 140 Z"
                fill="#131F3F"
                stroke="#1B2C52"
                strokeWidth="1.5"
              />
              {/* South America */}
              <path
                d="M 270 240 Q 360 250 380 320 Q 370 420 310 470 Q 280 470 270 380 Q 250 300 270 240 Z"
                fill="#18274E"
                stroke="#10B981"
                strokeWidth="1.8"
              />
              {/* Europe */}
              <path
                d="M 460 70 Q 550 60 580 120 Q 560 170 490 180 Q 450 160 460 70 Z"
                fill="#131F3F"
                stroke="#1B2C52"
                strokeWidth="1.5"
              />
              {/* Africa */}
              <path
                d="M 470 190 Q 560 190 580 270 Q 560 370 510 410 Q 460 360 450 260 Z"
                fill="#111B35"
                stroke="#1B2C52"
                strokeWidth="1.2"
              />
              {/* Asia */}
              <path
                d="M 590 70 Q 820 60 880 160 Q 830 260 710 240 Q 640 210 590 140 Z"
                fill="#111B35"
                stroke="#1B2C52"
                strokeWidth="1.2"
              />
              {/* Oceania / Australia */}
              <path
                d="M 760 330 Q 860 330 870 400 Q 820 440 760 420 Q 730 380 760 330 Z"
                fill="#111B35"
                stroke="#1B2C52"
                strokeWidth="1.2"
              />

              {/* Destination Hub (Brazil: GRU/GIG) */}
              <g>
                <circle cx={brazilHub.x} cy={brazilHub.y} r="16" fill="#10B981" opacity="0.2" className="animate-ping" />
                <circle cx={brazilHub.x} cy={brazilHub.y} r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" filter="url(#hubGlow)" />
                <text x={brazilHub.x} y={brazilHub.y + 18} textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold">
                  BRASIL (DEST)
                </text>
              </g>

              {/* Flight Arcs and Origin Hubs */}
              {WORLD_HUBS.map((hub) => {
                const hx = (hub.x / 100) * 1000;
                const hy = (hub.y / 100) * 500;
                const isSelected = selectedCountry.toLowerCase().includes(hub.country.toLowerCase());
                const isHovered = hoveredHub?.country === hub.country;

                // Geodesic curve control point
                const midX = (hx + brazilHub.x) / 2;
                const midY = (hy + brazilHub.y) / 2 - 40;

                const pathData = `M ${hx} ${hy} Q ${midX} ${midY} ${brazilHub.x} ${brazilHub.y}`;

                return (
                  <g
                    key={hub.country}
                    className="cursor-pointer group"
                    onClick={() => onSelectCountry && onSelectCountry(hub.country)}
                    onMouseEnter={() => setHoveredHub(hub)}
                    onMouseLeave={() => setHoveredHub(null)}
                  >
                    {/* Flight Arc Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={hub.color}
                      strokeWidth={isSelected || isHovered ? 2.2 : 1.2}
                      strokeDasharray="5, 6"
                      opacity={isSelected || isHovered ? 0.9 : 0.45}
                      className="transition-all"
                    />

                    {/* Origin Pin Aura */}
                    <circle
                      cx={hx}
                      cy={hy}
                      r={isHovered ? 14 : 9}
                      fill={hub.color}
                      opacity={isHovered ? 0.35 : 0.15}
                      className="transition-all"
                    />

                    {/* Origin Pin Core */}
                    <circle
                      cx={hx}
                      cy={hy}
                      r={isHovered ? 7 : 5}
                      fill={hub.color}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      filter="url(#hubGlow)"
                    />

                    {/* City label on hover */}
                    {(isHovered || isSelected) && (
                      <text
                        x={hx}
                        y={hy - 10}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-md font-sans"
                      >
                        {hub.flag} {hub.country}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hover Tooltip */}
          {hoveredHub && (
            <div
              className="absolute z-40 bg-[#131D38]/95 backdrop-blur-md border border-[#0EA5E9]/50 rounded-xl p-3 shadow-2xl text-xs text-white max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${hoveredHub.x}%`,
                top: `${hoveredHub.y}%`
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-bold text-white text-sm">
                  {hoveredHub.flag} {hoveredHub.country}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#0EA5E9]/20 text-[#0EA5E9]">
                  {hoveredHub.share}
                </span>
              </div>
              <div className="text-[#0EA5E9] font-extrabold text-base font-sans">
                {hoveredHub.volume}{' '}
                <span className="text-xs font-normal text-gray-300">Tourists to Brazil</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-snug">
                Hub: {hoveredHub.city} • Direct routes into GRU, GIG &amp; Southern terrestrial corridors
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top 5 Source Nations Badges */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div
          onClick={() => onSelectCountry && onSelectCountry('Argentina')}
          className="p-2 rounded-lg bg-[#0B132B]/60 border border-[#1E2D56] hover:border-[#10B981] transition cursor-pointer"
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">🇦🇷 Argentina</div>
          <div className="font-bold text-emerald-400">18.2M (31%)</div>
        </div>

        <div
          onClick={() => onSelectCountry && onSelectCountry('United States')}
          className="p-2 rounded-lg bg-[#0B132B]/60 border border-[#1E2D56] hover:border-[#0EA5E9] transition cursor-pointer"
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">🇺🇸 United States</div>
          <div className="font-bold text-cyan-400">5.8M (9.9%)</div>
        </div>

        <div
          onClick={() => onSelectCountry && onSelectCountry('Chile')}
          className="p-2 rounded-lg bg-[#0B132B]/60 border border-[#1E2D56] hover:border-[#F59E0B] transition cursor-pointer"
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">🇨🇱 Chile</div>
          <div className="font-bold text-amber-400">4.7M (8.0%)</div>
        </div>

        <div
          onClick={() => onSelectCountry && onSelectCountry('Paraguay')}
          className="p-2 rounded-lg bg-[#0B132B]/60 border border-[#1E2D56] hover:border-purple-400 transition cursor-pointer"
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">🇵🇾 Paraguay</div>
          <div className="font-bold text-purple-400">4.1M (7.0%)</div>
        </div>

        <div
          onClick={() => onSelectCountry && onSelectCountry('France')}
          className="p-2 rounded-lg bg-[#0B132B]/60 border border-[#1E2D56] hover:border-rose-400 transition cursor-pointer"
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">🇫🇷 France / EU</div>
          <div className="font-bold text-rose-400">2.6M (4.4%)</div>
        </div>
      </div>
    </div>
  );
};
