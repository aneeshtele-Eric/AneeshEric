import React, { useState, useMemo } from 'react';
import {
  Table as TableIcon,
  Search,
  Plane,
  Bus,
  Ship,
  Waves,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { InboundRecord } from '../data/tourismData';

interface DetailedRegistryTableProps {
  records: InboundRecord[];
}

export const DetailedRegistryTable: React.FC<DetailedRegistryTableProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof InboundRecord>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const pageSize = 10;

  // Filter records by search term
  const filteredRecords = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.country.toLowerCase().includes(q) ||
        r.continent.toLowerCase().includes(q) ||
        r.state.toLowerCase().includes(q) ||
        r.mode.toLowerCase().includes(q) ||
        r.date.includes(q)
    );
  }, [records, searchTerm]);

  // Sort records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [filteredRecords, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: keyof InboundRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getModeDetails = (mode: string) => {
    switch (mode) {
      case 'Air':
        return { icon: Plane, color: 'text-[#0EA5E9]', label: 'Air' };
      case 'Land':
        return { icon: Bus, color: 'text-[#10B981]', label: 'Land' };
      case 'Sea':
        return { icon: Ship, color: 'text-[#F59E0B]', label: 'Sea' };
      case 'River':
      default:
        return { icon: Waves, color: 'text-[#A855F7]', label: 'River' };
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5 border border-[#1E2D56]">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#1E2D56] gap-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-[#10B981]" />
            Detailed Records Drill-Down &amp; Inbound Registry
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Tabular extract from <code className="text-[#0EA5E9] font-mono">TurDataDeBrazil.xlsx</code> with dynamic search and sorting
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search country, state, mode..."
              className="w-full bg-[#0B132B] border border-[#1E2D56] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#10B981] pl-8"
            />
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-[#0B132B] text-[11px] text-[#94A3B8] uppercase font-semibold border-b border-[#1E2D56]">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-2.5 px-4 cursor-pointer hover:text-white transition select-none"
              >
                <div className="flex items-center gap-1">
                  Period <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('country')}
                className="py-2.5 px-4 cursor-pointer hover:text-white transition select-none"
              >
                <div className="flex items-center gap-1">
                  Origin Country <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('continent')}
                className="py-2.5 px-4 cursor-pointer hover:text-white transition select-none"
              >
                <div className="flex items-center gap-1">
                  Continent <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('state')}
                className="py-2.5 px-4 cursor-pointer hover:text-white transition select-none"
              >
                <div className="flex items-center gap-1">
                  Arrival Gateway (UF) <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('mode')}
                className="py-2.5 px-4 cursor-pointer hover:text-white transition select-none"
              >
                <div className="flex items-center gap-1">
                  Modality <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('count')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-white transition select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  Inbound Count <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2D56]/50 font-mono">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => {
                const modeMeta = getModeDetails(r.mode);
                const ModeIcon = modeMeta.icon;

                return (
                  <tr key={r.id} className="hover:bg-[#0B132B]/60 transition">
                    <td className="py-3 px-4 text-white font-medium">{r.date}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-gray-200">
                      <span className="mr-1.5">{r.flag}</span> {r.country}
                    </td>
                    <td className="py-3 px-4 font-sans text-[#94A3B8]">{r.continent}</td>
                    <td className="py-3 px-4 font-sans text-white">{r.state}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="flex items-center gap-1.5">
                        <ModeIcon className={`w-3.5 h-3.5 ${modeMeta.color}`} />
                        <span>{r.mode}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#10B981] font-mono">
                      {r.formattedCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#94A3B8] font-sans">
                  No records match the current filter or search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] pt-3 border-t border-[#1E2D56]/50 gap-2">
        <span>
          Showing {paginatedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
          {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length} records
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 bg-[#0B132B] border border-[#1E2D56] rounded hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-3 h-3" /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            // Keep page buttons reasonable
            if (totalPages > 5 && Math.abs(pg - currentPage) > 2) return null;
            return (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`px-2.5 py-1 rounded font-mono font-bold transition cursor-pointer ${
                  currentPage === pg
                    ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                    : 'bg-[#0B132B] border border-[#1E2D56] text-[#94A3B8] hover:text-white'
                }`}
              >
                {pg}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 bg-[#0B132B] border border-[#1E2D56] rounded hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
          >
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
