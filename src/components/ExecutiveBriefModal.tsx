import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, TrendingUp, Compass, Award } from 'lucide-react';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d1733] border border-[#1E2D56] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2D56] bg-[#0B132B]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#059669] to-[#10B981] flex items-center justify-center text-white font-bold text-xs shadow-md">
              BR
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#F59E0B] tracking-wider">
                Visit Brasil • Embratur Executive Brief
              </div>
              <h2 className="text-base font-bold text-white">
                10-Year Inbound Tourism &amp; Border Flow Dossier (2015–2024)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#131D38] border border-[#1E2D56] text-white hover:bg-[#1E2D56] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#1E2D56] text-[#94A3B8] hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Report Document */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm custom-scroll">
          
          {/* Institutional Banner */}
          <div className="p-4 rounded-xl bg-[#131D38]/80 border border-[#1E2D56] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Official STI / Federal Police Validated Release
              </span>
              <p className="text-xs text-[#94A3B8]">
                Document ID: <span className="font-mono text-white font-bold">EMBRATUR-STI-2024-XLSX</span> • Series: 120 Months Synced
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-[#94A3B8]">Total Recorded Inbound:</span>
              <div className="text-xl font-extrabold text-white font-sans">58,742,910 Arrivals</div>
            </div>
          </div>

          {/* Key Strategic Takeaways Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F59E0B]" /> Executive Summary &amp; Structural Insights
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-[#1E2D56] space-y-1.5">
                <div className="flex items-center gap-2 text-[#10B981] font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>1. All-Time Record High (2024)</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  2024 concluded with <strong>6,896,075 verified international arrivals</strong>, marking an increase of +16.7% over 2023 and outstripping the historic pre-pandemic high-water mark of 2018 (6.62M).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-[#1E2D56] space-y-1.5">
                <div className="flex items-center gap-2 text-[#0EA5E9] font-bold">
                  <Compass className="w-4 h-4" />
                  <span>2. Mercosul Anchor &amp; Road Crossings</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  South American neighbors generated <strong>54% of all international tourists</strong>. Argentina alone contributed 18.2 million visitors (31%), heavily funneling through terrestrial border points in RS (Uruguaiana) and PR (Foz do Iguaçu).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-[#1E2D56] space-y-1.5">
                <div className="flex items-center gap-2 text-[#F59E0B] font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>3. Transatlantic Aviation Concentration</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Aviation absorbed <strong>64.8% of inbound volume (38.0M passengers)</strong>. São Paulo (GRU) and Rio de Janeiro (GIG) account for 58.3% of national gateway capacity, followed by expanding direct routes into Fortaleza (CE) and Salvador (BA).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B132B]/80 border border-[#1E2D56] space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>4. High-Yield Seasonality Asymmetry</span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  January, February, and December exhibit peak monthly arrivals averaging <strong>850k–920k tourists/month</strong>, primarily driven by summer vacations and Carnival festivities, creating notable low-trough seasonality in May and June (~410k).
                </p>
              </div>
            </div>
          </div>

          {/* Policy Recommendations */}
          <div className="p-4 rounded-xl bg-[#0B132B] border border-[#1E2D56] space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">
              Strategic Policy &amp; Infrastructure Recommendations for 2025–2030:
            </h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#94A3B8] leading-relaxed">
              <li>
                <strong className="text-white">Smart Biometric Border Gates:</strong> Modernize high-traffic terrestrial borders in Uruguaiana and Foz do Iguaçu with automated electronic customs lanes to cut peak-season transit queues.
              </li>
              <li>
                <strong className="text-white">Winter Off-Peak Campaigns:</strong> Target the Northern Hemisphere summer (June–August) with eco-tourism packages across the Amazon (AM) and Pantanal (MS) to smooth seasonality deficits.
              </li>
              <li>
                <strong className="text-white">Long-Haul Flight Bilateral Pacts:</strong> Incentivize direct connectivity from North America and Asia-Pacific to diversify reliance beyond Mercosul core economies.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1E2D56] bg-[#0B132B] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Source: STI / Polícia Federal do Brasil • Embratur Intelligence</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#131D38] border border-[#1E2D56] text-white hover:bg-[#1E2D56] font-semibold transition cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
