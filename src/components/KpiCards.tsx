import React from 'react';
import {
  TrendingUp,
  Globe2,
  Sparkles,
  PlaneTakeoff,
  Compass,
  FileCheck,
  Sun,
  MapPin,
  Plane
} from 'lucide-react';

interface KpiCardsProps {
  totalVisitors: number;
  growthText: string;
  isPositiveGrowth?: boolean;
  activePeriodLabel?: string;
  selectedGateway?: string;
  selectedModality?: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalVisitors,
  growthText,
  activePeriodLabel = '10-Yr Total',
  selectedGateway = 'São Paulo (SP)',
  selectedModality = 'Aviation (64.8%)'
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      
      {/* KPI 1: Total Inbound Arrivals */}
      <div className="glass-card glass-card-hover rounded-xl p-4 border border-[#1E2D56] relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-[#10B981]/5 text-6xl pointer-events-none transition-transform group-hover:scale-110">
          <FileCheck className="w-20 h-20" />
        </div>
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1.5">
          <span className="uppercase tracking-wider font-semibold">Total Inbound Arrivals</span>
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-sm shadow-[#10B981]"></span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-extrabold text-white tracking-tight font-sans">
            {totalVisitors.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#10B981] font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{growthText}</span>
          <span className="text-[#94A3B8] text-[10px] ml-auto font-normal">{activePeriodLabel}</span>
        </div>
      </div>

      {/* KPI 2: Origin Nations */}
      <div className="glass-card glass-card-hover rounded-xl p-4 border border-[#1E2D56] relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-[#0EA5E9]/5 text-6xl pointer-events-none transition-transform group-hover:scale-110">
          <Globe2 className="w-20 h-20" />
        </div>
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1.5">
          <span className="uppercase tracking-wider font-semibold">Origin Nations</span>
          <span className="w-2 h-2 rounded-full bg-[#0EA5E9] shadow-sm shadow-[#0EA5E9]"></span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-extrabold text-white tracking-tight">186 Countries</div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#0EA5E9] font-medium">
          <Globe2 className="w-3.5 h-3.5" />
          <span>Mercosul: 53.4% Share</span>
          <span className="text-[#94A3B8] text-[10px] ml-auto font-normal">Active</span>
        </div>
      </div>

      {/* KPI 3: Peak Demand Season */}
      <div className="glass-card glass-card-hover rounded-xl p-4 border border-[#1E2D56] relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-[#F59E0B]/5 text-6xl pointer-events-none transition-transform group-hover:scale-110">
          <Sun className="w-20 h-20" />
        </div>
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1.5">
          <span className="uppercase tracking-wider font-semibold">Peak Demand Season</span>
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-sm shadow-[#F59E0B]"></span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-extrabold text-white tracking-tight">January • Summer</div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-[#F59E0B] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Carnival / Verão Spike</span>
          <span className="text-[#94A3B8] text-[10px] ml-auto font-normal">~890k/mo</span>
        </div>
      </div>

      {/* KPI 4: Primary Gateway */}
      <div className="glass-card glass-card-hover rounded-xl p-4 border border-[#1E2D56] relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-purple-400/5 text-6xl pointer-events-none transition-transform group-hover:scale-110">
          <MapPin className="w-20 h-20" />
        </div>
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1.5">
          <span className="uppercase tracking-wider font-semibold">Primary Gateway (UF)</span>
          <span className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400"></span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-extrabold text-white tracking-tight">{selectedGateway}</div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-400 font-medium">
          <PlaneTakeoff className="w-3.5 h-3.5" />
          <span>38.2% Total Volume</span>
          <span className="text-[#94A3B8] text-[10px] ml-auto font-normal">2.2M/yr</span>
        </div>
      </div>

      {/* KPI 5: Leading Transit Modality */}
      <div className="glass-card glass-card-hover rounded-xl p-4 border border-[#1E2D56] relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 text-emerald-400/5 text-6xl pointer-events-none transition-transform group-hover:scale-110">
          <Plane className="w-20 h-20" />
        </div>
        <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-1.5">
          <span className="uppercase tracking-wider font-semibold">Leading Transit Modality</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-extrabold text-white tracking-tight">{selectedModality}</div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
          <Compass className="w-3.5 h-3.5" />
          <span>Land 32.1% • Sea/Riv 3.1%</span>
          <span className="text-[#94A3B8] text-[10px] ml-auto font-normal">Air Dominant</span>
        </div>
      </div>

    </section>
  );
};
