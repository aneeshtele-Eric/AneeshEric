import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 border-t border-[#1E2D56]/70 py-6 text-center text-xs text-[#94A3B8]">
      <div className="max-w-[1720px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="font-bold text-white">Governo Federal do Brasil</span> •
          <span>Ministério do Turismo (MTur)</span> •
          <span>Agência Brasileira de Promoção Internacional do Turismo (Embratur)</span>
        </div>
        <div>
          <span>
            Analytical Engine v4.2 • Data Source: Polícia Federal / Sistema de Tráfego Internacional (STI)
          </span>
        </div>
      </div>
    </footer>
  );
};
