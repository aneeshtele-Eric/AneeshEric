/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AnalyticsControlBar, FilterState } from './components/AnalyticsControlBar';
import { KpiCards } from './components/KpiCards';
import { MasterTimelineChart } from './components/MasterTimelineChart';
import { ModalTransportSplit } from './components/ModalTransportSplit';
import { SeasonalityProfile } from './components/SeasonalityProfile';
import { ContinentalBreakdown } from './components/ContinentalBreakdown';
import { BrazilGatewayHeatmap } from './components/BrazilGatewayHeatmap';
import { WorldOriginMap } from './components/WorldOriginMap';
import { DetailedRegistryTable } from './components/DetailedRegistryTable';
import { ExecutiveBriefModal } from './components/ExecutiveBriefModal';
import { DepartmentChatbot } from './components/DepartmentChatbot';
import { Footer } from './components/Footer';
import {
  TIMELINE_SERIES,
  DETAILED_REGISTRY_RECORDS,
  SEASONALITY_FACTORS,
  MonthlyPoint
} from './data/tourismData';
import { CheckCircle2, Bot, Sparkles } from 'lucide-react';

export default function App() {
  // Global Filter State
  const [filters, setFilters] = useState<FilterState>({
    timeHorizon: 'ALL',
    modality: 'ALL',
    continent: 'ALL',
    stateGateway: 'ALL'
  });

  // Master Timeline Brush State
  const [activePeriod, setActivePeriod] = useState<'ALL' | 'PRE_COVID' | 'PANDEMIC' | 'RECOVERY'>('ALL');
  const [selectedPoint, setSelectedPoint] = useState<MonthlyPoint | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

  // Executive Briefing Modal
  const [isExecutiveBriefOpen, setIsExecutiveBriefOpen] = useState(false);

  // Department Chatbot Modal
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Filter Timeline series based on brush or year selection
  const timelineData = useMemo(() => {
    let result = [...TIMELINE_SERIES];
    if (activePeriod === 'PRE_COVID') {
      result = result.filter((d) => d.year <= 2019);
    } else if (activePeriod === 'PANDEMIC') {
      result = result.filter((d) => d.year >= 2020 && d.year <= 2021);
    } else if (activePeriod === 'RECOVERY') {
      result = result.filter((d) => d.year >= 2022);
    } else if (filters.timeHorizon !== 'ALL') {
      if (filters.timeHorizon === 'RECENT5') {
        result = result.filter((d) => d.year >= 2020);
      } else if (filters.timeHorizon === 'PRECOVID') {
        result = result.filter((d) => d.year <= 2019);
      } else {
        const targetYear = parseInt(filters.timeHorizon, 10);
        if (!isNaN(targetYear)) {
          result = result.filter((d) => d.year === targetYear);
        }
      }
    }
    return result;
  }, [activePeriod, filters.timeHorizon]);

  // Compute total visitors dynamically
  const { totalVisitors, growthText, activePeriodLabel, volumeMultiplier } = useMemo(() => {
    if (activePeriod === 'PRE_COVID') {
      return {
        totalVisitors: 32415489,
        growthText: '+1.8% Constant Avg',
        activePeriodLabel: '2015–2019 Total',
        volumeMultiplier: 1.05
      };
    }
    if (activePeriod === 'PANDEMIC') {
      return {
        totalVisitors: 2891965,
        growthText: '-65.8% Contraction',
        activePeriodLabel: '2020–2021 Total',
        volumeMultiplier: 0.35
      };
    }
    if (activePeriod === 'RECOVERY') {
      return {
        totalVisitors: 16434447,
        growthText: '+42.5% Annual Surge',
        activePeriodLabel: '2022–2024 Total',
        volumeMultiplier: 1.25
      };
    }
    if (filters.timeHorizon === '2024') {
      return {
        totalVisitors: 6896075,
        growthText: '+16.7% All-Time High',
        activePeriodLabel: '2024 Full Year',
        volumeMultiplier: 1.3
      };
    }
    if (filters.timeHorizon === '2023') {
      return {
        totalVisitors: 5908341,
        growthText: '+62.8% YoY Surge',
        activePeriodLabel: '2023 Full Year',
        volumeMultiplier: 1.15
      };
    }

    return {
      totalVisitors: 58742910,
      growthText: '+14.8% YoY Recovery',
      activePeriodLabel: '10-Yr Total',
      volumeMultiplier: 1.0
    };
  }, [activePeriod, filters.timeHorizon]);

  // Seasonality chart data dynamically adjusted by era
  const seasonalityData = useMemo(() => {
    const baseSeasonality = [
      885000, 850000, 640000, 520000, 420000, 410000,
      590000, 490000, 515000, 560000, 670000, 820000
    ];

    if (activePeriod === 'PRE_COVID') {
      return [
        860000, 830000, 620000, 500000, 410000, 390000,
        570000, 480000, 500000, 540000, 650000, 810000
      ];
    }
    if (activePeriod === 'PANDEMIC') {
      return [
        320000, 310000, 180000, 45000, 38000, 42000,
        55000, 60000, 68000, 85000, 110000, 140000
      ];
    }
    if (activePeriod === 'RECOVERY') {
      return [
        960000, 920000, 710000, 590000, 490000, 470000,
        680000, 570000, 595000, 640000, 780000, 930000
      ];
    }
    return baseSeasonality;
  }, [activePeriod]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    showToast(`Filter updated: ${key} = ${value}`);
  };

  const handleResetFilters = () => {
    setFilters({
      timeHorizon: 'ALL',
      modality: 'ALL',
      continent: 'ALL',
      stateGateway: 'ALL'
    });
    setActivePeriod('ALL');
    setSelectedPoint(null);
    setSelectedMonthIndex(null);
    showToast('All dashboard filters reset to 10-year baseline.');
  };

  const handleClearBrush = () => {
    setActivePeriod('ALL');
    setSelectedPoint(null);
    showToast('Timeline brush filter cleared.');
  };

  const handleTimelineBrushSelect = (period: 'ALL' | 'PRE_COVID' | 'PANDEMIC' | 'RECOVERY') => {
    setActivePeriod(period);
    setSelectedPoint(null);
    const label =
      period === 'PRE_COVID'
        ? 'Pre-Pandemic Era (2015–2019)'
        : period === 'PANDEMIC'
        ? 'Pandemic Boundary (2020–2021)'
        : period === 'RECOVERY'
        ? 'Boom Period (2022–2024)'
        : 'Full 10-Year Series';
    showToast(`Timeline brush active: ${label}`);
  };

  const handleTimelinePointSelect = (point: MonthlyPoint) => {
    setSelectedPoint(point);
    setSelectedMonthIndex(point.monthIndex);
    showToast(`Selected monthly point: ${point.label} (${point.arrivals.toLocaleString()} arrivals)`);
  };

  // Filter Table records based on dropdown filters
  const filteredTableRecords = useMemo(() => {
    return DETAILED_REGISTRY_RECORDS.filter((r) => {
      if (filters.modality !== 'ALL' && r.mode.toLowerCase() !== filters.modality.toLowerCase()) {
        return false;
      }
      if (filters.continent !== 'ALL' && r.continent.toLowerCase() !== filters.continent.toLowerCase()) {
        return false;
      }
      if (filters.stateGateway !== 'ALL' && r.uf !== filters.stateGateway) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Export CSV Action
  const handleExportCSV = () => {
    const csvRows = [
      ['Period', 'Origin_Country', 'Continent', 'Arrival_UF', 'Modality', 'Inbound_Count', 'Status']
    ];

    filteredTableRecords.forEach((r) => {
      csvRows.push([
        r.date,
        `"${r.country}"`,
        `"${r.continent}"`,
        `"${r.state}"`,
        r.mode,
        r.count.toString(),
        r.status
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'TurDataDeBrazil_Analytics_10Yr_Export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('TurDataDeBrazil.xlsx extract exported as CSV successfully!');
  };

  const activeBrushText = useMemo(() => {
    if (selectedPoint) {
      return `${selectedPoint.month} ${selectedPoint.year} Point Selection`;
    }
    if (activePeriod === 'PRE_COVID') return '2015–2019 (Pre-Covid Era)';
    if (activePeriod === 'PANDEMIC') return '2020–2021 (Restriction Valley)';
    if (activePeriod === 'RECOVERY') return '2022–2024 (Boom Period Record)';
    return null;
  }, [activePeriod, selectedPoint]);

  return (
    <div className="min-h-screen bg-[#0B132B] text-[#F8FAFC] selection:bg-[#10B981] selection:text-[#0B132B]">
      
      {/* Top Application Header */}
      <Header
        onExportCSV={handleExportCSV}
        onOpenExecutiveBrief={() => setIsExecutiveBriefOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        totalRecordsCount={DETAILED_REGISTRY_RECORDS.length}
      />

      {/* Main Container */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 py-5 space-y-6">
        
        {/* Global Analytics Control Bar */}
        <AnalyticsControlBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          activeBrushText={activeBrushText}
          onClearBrush={handleClearBrush}
        />

        {/* Section A: Top KPI Metric Cards (5 Cards) */}
        <KpiCards
          totalVisitors={totalVisitors}
          growthText={growthText}
          activePeriodLabel={activePeriodLabel}
          selectedGateway={
            filters.stateGateway === 'ALL'
              ? 'São Paulo (SP)'
              : filters.stateGateway === 'SP'
              ? 'São Paulo (SP)'
              : filters.stateGateway === 'RJ'
              ? 'Rio de Janeiro (RJ)'
              : filters.stateGateway === 'RS'
              ? 'Rio Grande do Sul (RS)'
              : `${filters.stateGateway} Gateway`
          }
          selectedModality={
            filters.modality === 'ALL'
              ? 'Aviation (64.8%)'
              : `${filters.modality} Dominant`
          }
        />

        {/* Section B1: Chart 1 Master Timeline Trend with Brush Buttons */}
        <MasterTimelineChart
          data={timelineData}
          activePeriod={activePeriod}
          onPeriodSelect={handleTimelineBrushSelect}
          onPointSelect={handleTimelinePointSelect}
          selectedPointId={selectedPoint?.id}
        />

        {/* Section B2: 3-Column Analytics Grid (Chart 2, Chart 3, Chart 6) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 2: Modal Transport Split */}
          <ModalTransportSplit
            onSelectModality={(m) => handleFilterChange('modality', m)}
            activeModality={filters.modality}
          />

          {/* Chart 3: Seasonality Profile (Jan-Dec) */}
          <SeasonalityProfile
            monthlyData={seasonalityData}
            activeMonthIndex={selectedMonthIndex}
            onSelectMonth={(idx) => {
              setSelectedMonthIndex(idx);
              showToast(`Month highlighted: ${SEASONALITY_FACTORS[idx]} seasonality factor`);
            }}
            isCrossLinked={activePeriod !== 'ALL' || selectedPoint !== null}
          />

          {/* Chart 6: Continental Origin Breakdown */}
          <ContinentalBreakdown
            onSelectContinent={(c) => handleFilterChange('continent', c)}
            activeContinent={filters.continent}
          />
        </section>

        {/* Section B3: Geospatial Maps (Chart 4 & Chart 5) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 4: Brazilian Gateways & State Heatmap */}
          <BrazilGatewayHeatmap
            onSelectState={(uf) => handleFilterChange('stateGateway', uf)}
            selectedUF={filters.stateGateway}
            volumeMultiplier={volumeMultiplier}
          />

          {/* Chart 5: Global Origin World Map & Inbound Hubs */}
          <WorldOriginMap
            onSelectCountry={(c) => {
              showToast(`Origin focus: ${c}`);
            }}
          />
        </section>

        {/* Section C: Detailed Data Drill-Down Table */}
        <DetailedRegistryTable records={filteredTableRecords} />

      </main>

      {/* Application Footer */}
      <Footer />

      {/* Executive Brief Modal */}
      <ExecutiveBriefModal
        isOpen={isExecutiveBriefOpen}
        onClose={() => setIsExecutiveBriefOpen(false)}
      />

      {/* Department Intelligence Chatbot Modal */}
      <DepartmentChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        activeFilters={{
          year: filters.timeHorizon,
          mode: filters.modality,
          continent: filters.continent,
          state: filters.stateGateway,
          timelineEra: activeBrushText || '10-Yr Full'
        }}
      />

      {/* Floating Department AI Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-semibold text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/40 group cursor-pointer"
        title="Open Department Intelligence Assistant"
      >
        <div className="relative">
          <Bot className="w-4 h-4 text-amber-300" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
        </div>
        <span className="tracking-wide">Ask Department AI</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#131D38] border border-[#0EA5E9]/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#0EA5E9]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
