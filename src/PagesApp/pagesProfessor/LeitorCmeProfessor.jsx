import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function LeitorCmeProfessor() {
  const navigate = useNavigate();
  const location = useLocation();

  // Define se começa na aba 'qrcode' ou 'barras' via estado do roteador ou padrão
  const [abaAtiva, setAbaAtiva] = useState(location.state?.abaInicial || 'qrcode');

  return (
    <div className="w-full h-full bg-[#3B42B2] text-white flex flex-col font-sans m-0 p-0 overflow-hidden relative">
      
      {/* HEADER / TOPO */}
      <div className="pt-8 pb-4 px-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-lg font-semibold tracking-wide text-center flex-1">
          {abaAtiva === 'qrcode' ? 'Leitura de QR-Code' : 'Leitura de Código de Barras'}
        </h1>

        <div className="w-9" /> {/* Espaçador */}
      </div>

      {/* CARD PRINCIPAL BRANCO COM SCROLL */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-4 pb-8 flex-1 overflow-y-auto flex flex-col space-y-5 shadow-inner relative">
        
        {/* TABS / SELEÇÃO SUPERIOR */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setAbaAtiva('qrcode')}
            className={`flex-1 py-2 text-xs font-bold text-center relative transition ${
              abaAtiva === 'qrcode' ? 'text-[#3B42B2]' : 'text-slate-400'
            }`}
          >
            QR-Code
            {abaAtiva === 'qrcode' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setAbaAtiva('barras')}
            className={`flex-1 py-2 text-xs font-bold text-center relative transition ${
              abaAtiva === 'barras' ? 'text-[#3B42B2]' : 'text-slate-400'
            }`}
          >
            Código de Barras
            {abaAtiva === 'barras' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        {/* ÁREA DO SCANNER COM BORDAS AMARELAS */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div 
            className={`w-full bg-slate-200 rounded-2xl relative transition-all duration-300 flex items-center justify-center ${
              abaAtiva === 'qrcode' ? 'h-64' : 'h-36'
            }`}
          >
            {/* Cantoneira Superior Esquerda */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
            {/* Cantoneira Superior Direita */}
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
            {/* Cantoneira Inferior Esquerda */}
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
            {/* Cantoneira Inferior Direita */}
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />
          </div>

          <p className="text-xs font-bold text-[#3B42B2] mt-4 text-center">
            {abaAtiva === 'qrcode' 
              ? 'Posicione o QR-Code dentro da área' 
              : 'Posicione o código de barras dentro da área'
            }
          </p>
        </div>

        {/* ÚLTIMA LEITURA */}
        <div className="space-y-2 pt-1">
          <h3 className="font-extrabold text-[#3B42B2] text-xs">
            Última leitura
          </h3>

          <div 
            onClick={() => navigate('/app/professor/cme/pacote-detalhes')}
            className="border border-slate-200 rounded-2xl p-3 bg-white shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/60 shrink-0">
                <span className="text-xl">📦</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-[#3B42B2] text-xs">Kit Cirúrgico 01</h4>
                <p className="text-[9px] text-slate-500 font-bold">Código: 125794216646</p>
                <p className="text-[9px] text-slate-500 font-bold">Esterilizado em: 20/05/2026 - 09:38</p>
                <p className="text-[9px] text-slate-500 font-bold">Validade: 20/05/2027</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full">
                Válido
              </span>
              <ChevronRight className="w-5 h-5 text-[#3B42B2]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}