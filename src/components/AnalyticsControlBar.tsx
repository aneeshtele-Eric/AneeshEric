import React from 'react';
import { Sliders, RotateCcw, FilterX, ChevronDown } from 'lucide-react';

export interface FilterState {
  timeHorizon: string;
  modality: string;
  continent: string;
  stateGateway: string;
}

interface AnalyticsControlBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  activeBrushText: string | null;
  onClearBrush: () => void;
}

export const AnalyticsControlBar: React.FC<AnalyticsControlBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeBrushText,
  onClearBrush
}) => {
  return (
    <section className="glass-card rounded-2xl p-4 sm:p-5 border border-[#1E2D56]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/15 text-[#0EA5E9] flex items-center justify-center font-bold text-sm">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Analytics Control Bar</h2>
            <p className="text-xs text-[#94A3B8]">Dynamic multi-dimensional segmentations & time horizons</p>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 lg:max-w-4xl">
          
          {/* 1. Time Horizon Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Time Horizon (Years)</label>
            <div className="relative">
              <select
                value={filters.timeHorizon}
                onChange={(e) => onFilterChange('timeHorizon', e.target.value)}
                className="w-full bg-[#0B132B] border border-[#1E2D56] text-xs text-white rounded-lg px-2.5 py-2 pr-7 focus:ring-1 focus:ring-[#0EA5E9] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Decades (2015 - 2024)</option>
                <option value="RECENT5">Last 5 Years (2020 - 2024)</option>
                <option value="PRECOVID">Pre-Pandemic Baseline (2015 - 2019)</option>
                <option value="2024">2024 (Full Record)</option>
                <option value="2023">2023 (Record Year)</option>
                <option value="2022">2022 (Recovery Rebound)</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 2. Transport Modality */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Transport Modality</label>
            <div className="relative">
              <select
                value={filters.modality}
                onChange={(e) => onFilterChange('modality', e.target.value)}
                className="w-full bg-[#0B132B] border border-[#1E2D56] text-xs text-white rounded-lg px-2.5 py-2 pr-7 focus:ring-1 focus:ring-[#0EA5E9] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Modes (Air, Land, Sea, River)</option>
                <option value="Air">Air Travel Only (Vôos)</option>
                <option value="Land">Terrestrial / Land (Rodoviário)</option>
                <option value="Sea">Maritime / Sea Cruises (Marítimo)</option>
                <option value="River">Fluvial / River Ports (Fluvial)</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 3. Source Region / Continent */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Source Region / Continent</label>
            <div className="relative">
              <select
                value={filters.continent}
                onChange={(e) => onFilterChange('continent', e.target.value)}
                className="w-full bg-[#0B132B] border border-[#1E2D56] text-xs text-white rounded-lg px-2.5 py-2 pr-7 focus:ring-1 focus:ring-[#0EA5E9] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">Global (All Continents)</option>
                <option value="South America">South America (Mercosul Core)</option>
                <option value="Europe">Europe (EU & UK)</option>
                <option value="North America">North America (USA & Canada)</option>
                <option value="Asia">Asia & Pacific</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* 4. Entry Gateway (UF) */}
          <div>
            <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Entry Gateway (UF)</label>
            <div className="relative">
              <select
                value={filters.stateGateway}
                onChange={(e) => onFilterChange('stateGateway', e.target.value)}
                className="w-full bg-[#0B132B] border border-[#1E2D56] text-xs text-white rounded-lg px-2.5 py-2 pr-7 focus:ring-1 focus:ring-[#0EA5E9] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All 27 Federative Units</option>
                <option value="SP">São Paulo (GRU/VCP)</option>
                <option value="RJ">Rio de Janeiro (GIG/SDU)</option>
                <option value="RS">Rio Grande do Sul (Fronteira/POA)</option>
                <option value="PR">Paraná (Foz do Iguaçu/CWB)</option>
                <option value="BA">Bahia (SSA)</option>
                <option value="SC">Santa Catarina (FLN)</option>
                <option value="AM">Amazonas (MAO - River/Air)</option>
                <option value="CE">Ceará (FOR)</option>
                <option value="PE">Pernambuco (REC)</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#94A3B8] absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Quick Reset */}
        <div className="flex items-center gap-2 justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1E2D56]">
          <button
            onClick={onResetFilters}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#0B132B] border border-[#1E2D56] hover:border-red-500/50 hover:text-red-400 text-[#94A3B8] transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

      </div>

      {/* Cross-Filtering Active Banner */}
      {activeBrushText && (
        <div className="mt-3 pt-3 border-t border-[#1E2D56]/60 flex items-center justify-between text-xs text-[#0EA5E9] bg-[#0EA5E9]/10 px-3 py-2 rounded-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <FilterX className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>
              Cross-filtering active from <strong>Timeline Selection</strong>:{' '}
              <span className="font-bold underline">{activeBrushText}</span>
            </span>
          </div>
          <button
            onClick={onClearBrush}
            className="text-xs bg-[#0EA5E9] text-[#0B132B] font-bold px-2 py-0.5 rounded hover:bg-white transition cursor-pointer"
          >
            Clear Brush
          </button>
        </div>
      )}
    </section>
  );
};
