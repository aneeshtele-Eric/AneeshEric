import React from 'react';
import { Database, Radio, Download, FileText, Bot, Sparkles } from 'lucide-react';

interface HeaderProps {
  onExportCSV: () => void;
  onOpenExecutiveBrief: () => void;
  onOpenChatbot: () => void;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExportCSV,
  onOpenExecutiveBrief,
  onOpenChatbot
}) => {
  return (
    <header className="border-b border-[#1E2D56] bg-[#0B132B]/90 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#059669] via-[#0EA5E9] to-[#F59E0B] p-[2px] shadow-lg shadow-[#059669]/20">
            <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
              {/* Brazil Stylized Diamond & Circle Emblem */}
              <svg className="w-6 h-6 text-[#10B981]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5-5.5-5.5L12 6.5zm0 2.5a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/25">
                VISIT BRASIL
              </span>
              <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
                Ministério do Turismo • Embratur
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Tourism Intelligence & Trend Analytics
              <span className="hidden md:inline-block text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30">
                TurDataDeBrazil.xlsx (10-Yr Series)
              </span>
            </h1>
          </div>
        </div>

        {/* Live Metadata & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex flex-col text-right pr-3 border-r border-[#1E2D56]">
            <span className="text-[11px] text-[#94A3B8] flex items-center justify-end gap-1.5">
              <Database className="w-3 h-3 text-[#10B981]" /> Synced Data Lake
            </span>
            <span className="text-xs font-semibold text-gray-200">Dec 2014 – Dec 2024 (120 Mo)</span>
          </div>

          {/* Live Inbound Feeds indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#10B981]" />
            <span>Live Inbound Feeds</span>
          </div>

          {/* Department Chatbot Trigger */}
          <button
            onClick={onOpenChatbot}
            className="relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 via-emerald-600 to-teal-500 text-white hover:opacity-95 shadow-lg shadow-sky-500/20 transition cursor-pointer active:scale-95 border border-sky-400/30"
            title="Ask Department Intelligence questions"
          >
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span>Department AI</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#131D38] border border-[#1E2D56] hover:bg-[#1E2D56] text-gray-200 hover:text-white transition cursor-pointer"
            title="Download full CSV extract from TurDataDeBrazil.xlsx"
          >
            <Download className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Executive Brief Modal Trigger */}
          <button
            onClick={onOpenExecutiveBrief}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#059669] to-[#10B981] text-white hover:opacity-95 shadow-md shadow-[#059669]/25 transition cursor-pointer active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Executive Brief</span>
          </button>
        </div>

      </div>
    </header>
  );
};
