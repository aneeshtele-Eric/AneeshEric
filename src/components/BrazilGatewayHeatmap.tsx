import React, { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { BRAZIL_GATEWAYS, GatewayState } from '../data/tourismData';

interface BrazilGatewayHeatmapProps {
  onSelectState?: (uf: string) => void;
  selectedUF?: string;
  volumeMultiplier?: number;
}

export const BrazilGatewayHeatmap: React.FC<BrazilGatewayHeatmapProps> = ({
  onSelectState,
  selectedUF = 'ALL',
  volumeMultiplier = 1.0
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredGateway, setHoveredGateway] = useState<GatewayState | null>(null);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.8, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, +(z - 0.2).toFixed(1)));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#1E2D56] flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#1E2D56] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Chart 4: Brazilian Gateways & State Heatmap
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Top entry points (UF) across Brazil. Interactive pins with airport and border volumes.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 bg-[#0B132B] border border-[#1E2D56] rounded text-[#10B981] text-[11px] font-medium">
              Dynamic Link Active
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="mt-4 relative rounded-xl overflow-hidden border border-[#1E2D56] h-[360px] w-full bg-[#0d1733]">
          
          {/* Zoom & Reset Controls */}
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

          {/* Floating Density Legend */}
          <div className="absolute bottom-3 left-3 z-30 bg-[#0B132B]/90 backdrop-blur-md border border-[#1E2D56] p-2.5 rounded-lg text-xs space-y-1 shadow-lg">
            <div className="font-bold text-white text-[11px] mb-1">Inbound Density (UF)</div>
            <div className="flex items-center gap-2 text-[#94A3B8] text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]"></span>
              <span>&gt; 2.0M (Major Int&apos;l Hub)</span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8] text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] shadow-sm shadow-[#0EA5E9]"></span>
              <span>500k – 2.0M (Border / Gateway)</span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8] text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm shadow-[#F59E0B]"></span>
              <span>100k – 500k (Regional Entry)</span>
            </div>
          </div>

          {/* SVG Map of Brazil with Nodes */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 select-none"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 500 500" className="w-[440px] h-[440px] overflow-visible">
              <defs>
                <filter id="mapGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#132042" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0B132B" stopOpacity="0.8" />
                </radialGradient>
              </defs>

              {/* Ocean / Surrounding contour */}
              <circle cx="250" cy="250" r="230" fill="url(#oceanGrad)" />

              {/* Brazil Geographic Contour Silhouette */}
              <path
                d="M 170 80 
                   C 220 70, 290 85, 340 120 
                   C 380 145, 430 170, 440 210 
                   C 450 250, 430 290, 410 320 
                   C 380 360, 360 410, 320 440 
                   C 290 460, 260 450, 250 430 
                   C 230 400, 230 360, 200 340 
                   C 170 320, 140 320, 120 290 
                   C 90 250, 80 200, 95 160 
                   C 110 120, 140 90, 170 80 Z"
                fill="#131F3F"
                stroke="#1E3260"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* State divider hint lines */}
              <path
                d="M 230 150 Q 280 200 350 220 M 200 240 Q 270 290 320 370 M 170 200 Q 230 260 260 380 M 320 220 Q 360 260 380 320"
                fill="none"
                stroke="#1B2B50"
                strokeWidth="1.2"
                strokeDasharray="3, 3"
              />

              {/* Major Hub Interconnecting Air Corridors */}
              <path
                d="M 320 360 Q 350 350 360 355 M 320 360 Q 280 400 260 430 M 320 360 Q 380 280 390 260 M 320 360 Q 240 220 160 175"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="1"
                strokeDasharray="4, 4"
                opacity="0.4"
              />

              {/* Gateway Nodes */}
              {BRAZIL_GATEWAYS.map((gw) => {
                const cx = (gw.x / 100) * 500;
                const cy = (gw.y / 100) * 500;
                const isSelected = selectedUF === gw.uf;
                const isHovered = hoveredGateway?.uf === gw.uf;
                const baseRadius = gw.category === 'major' ? 16 : gw.category === 'border' ? 12 : 9;
                const radius = baseRadius * Math.min(1.4, Math.max(0.7, volumeMultiplier));

                return (
                  <g
                    key={gw.uf}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => onSelectState && onSelectState(gw.uf)}
                    onMouseEnter={() => setHoveredGateway(gw)}
                    onMouseLeave={() => setHoveredGateway(null)}
                  >
                    {/* Pulsing outer aura for major hubs */}
                    {gw.category === 'major' && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius * 1.8}
                        fill={gw.color}
                        opacity="0.18"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer glow ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius * 1.3}
                      fill="none"
                      stroke={gw.color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      opacity={isSelected ? 1 : 0.6}
                    />

                    {/* Core node */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={gw.color}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      filter="url(#mapGlow)"
                    />

                    {/* Gateway label tag */}
                    <text
                      x={cx}
                      y={cy - radius - 5}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-md select-none font-sans"
                    >
                      {gw.uf}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hover Tooltip Card */}
          {hoveredGateway && (
            <div
              className="absolute z-40 bg-[#131D38]/95 backdrop-blur-md border border-[#10B981]/50 rounded-xl p-3 shadow-2xl text-xs text-white max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: `${hoveredGateway.x}%`,
                top: `${hoveredGateway.y}%`
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="font-bold text-white text-sm">{hoveredGateway.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#10B981]/20 text-[#10B981]">
                  {hoveredGateway.share}%
                </span>
              </div>
              <div className="text-emerald-400 font-extrabold text-base font-sans">
                {hoveredGateway.formattedCount}{' '}
                <span className="text-xs font-normal text-gray-300">Inbound Tourists</span>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-1 leading-snug">
                {hoveredGateway.details}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* State Gateway Quick Roster */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div
          onClick={() => onSelectState && onSelectState('SP')}
          className={`p-2 rounded-lg border text-center transition cursor-pointer ${
            selectedUF === 'SP'
              ? 'bg-[#1E2D56] border-[#10B981]'
              : 'bg-[#0B132B]/60 border-[#1E2D56] hover:border-gray-500'
          }`}
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">1. São Paulo (SP)</div>
          <div className="font-bold text-[#10B981] text-sm">22.4M (38.2%)</div>
        </div>

        <div
          onClick={() => onSelectState && onSelectState('RJ')}
          className={`p-2 rounded-lg border text-center transition cursor-pointer ${
            selectedUF === 'RJ'
              ? 'bg-[#1E2D56] border-[#0EA5E9]'
              : 'bg-[#0B132B]/60 border-[#1E2D56] hover:border-gray-500'
          }`}
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">2. Rio de Janeiro (RJ)</div>
          <div className="font-bold text-[#0EA5E9] text-sm">11.8M (20.1%)</div>
        </div>

        <div
          onClick={() => onSelectState && onSelectState('RS')}
          className={`p-2 rounded-lg border text-center transition cursor-pointer ${
            selectedUF === 'RS'
              ? 'bg-[#1E2D56] border-[#F59E0B]'
              : 'bg-[#0B132B]/60 border-[#1E2D56] hover:border-gray-500'
          }`}
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">3. Rio Grande Sul (RS)</div>
          <div className="font-bold text-[#F59E0B] text-sm">9.6M (16.4%)</div>
        </div>

        <div
          onClick={() => onSelectState && onSelectState('PR')}
          className={`p-2 rounded-lg border text-center transition cursor-pointer ${
            selectedUF === 'PR'
              ? 'bg-[#1E2D56] border-[#A855F7]'
              : 'bg-[#0B132B]/60 border-[#1E2D56] hover:border-gray-500'
          }`}
        >
          <div className="text-[10px] text-[#94A3B8] font-medium">4. Paraná (PR)</div>
          <div className="font-bold text-purple-400 text-sm">7.9M (13.5%)</div>
        </div>
      </div>
    </div>
  );
};
