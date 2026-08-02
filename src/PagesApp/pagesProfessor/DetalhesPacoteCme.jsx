import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';

export default function DetalhesPacoteCme() {
  const navigate = useNavigate();

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
          Detalhes do Pacote
        </h1>

        <div className="w-9" /> {/* Espaçador */}
      </div>

      {/* CARD PRINCIPAL BRANCO COM SCROLL */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-5 pt-6 pb-8 flex-1 overflow-y-auto flex flex-col space-y-6 shadow-inner relative">
        
        {/* TÍTULO DO PAC OTE */}
        <h2 className="text-xl font-black text-slate-900 text-center tracking-wide uppercase">
          KIT CIRÚRGICO 01
        </h2>

        {/* CÓDIGOS DE BARRAS / QR CODE */}
        <div className="flex items-center justify-center gap-4 py-1">
          {/* QR Code Simulado / SVG */}
          <div className="w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900">
              <path d="M0,0 h40 v40 h-40 z M10,10 v20 h20 v-20 z M15,15 h10 v10 h-10 z" />
              <path d="M60,0 h40 v40 h-40 z M70,10 v20 h20 v-20 z M75,15 h10 v10 h-10 z" />
              <path d="M0,60 h40 v40 h-40 z M10,70 v20 h20 v-20 z M15,75 h10 v10 h-10 z" />
              <rect x="50" y="50" width="10" height="10" />
              <rect x="70" y="50" width="10" height="10" />
              <rect x="50" y="70" width="10" height="10" />
              <rect x="80" y="80" width="20" height="20" />
              <rect x="60" y="90" width="10" height="10" />
            </svg>
          </div>

          {/* Código de Barras Simulado */}
          <div className="flex flex-col items-center justify-center">
            <div className="h-16 flex items-stretch gap-1 bg-white p-1">
              <div className="w-1 bg-slate-900" />
              <div className="w-0.5 bg-slate-900" />
              <div className="w-1.5 bg-slate-900" />
              <div className="w-0.5 bg-slate-900" />
              <div className="w-1 bg-slate-900" />
              <div className="w-2 bg-slate-900" />
              <div className="w-0.5 bg-slate-900" />
              <div className="w-1 bg-slate-900" />
              <div className="w-1.5 bg-slate-900" />
              <div className="w-0.5 bg-slate-900" />
              <div className="w-1 bg-slate-900" />
              <div className="w-2 bg-slate-900" />
              <div className="w-0.5 bg-slate-900" />
              <div className="w-1 bg-slate-900" />
            </div>
            <span className="text-xs font-black text-slate-800 tracking-wider mt-1">
              125794216646
            </span>
          </div>
        </div>

        {/* BADGE DE STATUS */}
        <div className="flex justify-center">
          <span className="bg-[#B8D8B2] text-emerald-900 text-xs font-extrabold px-8 py-1.5 rounded-full">
            Válido
          </span>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button className="bg-[#C5CBE9] hover:bg-[#b4bce0] text-[#3B42B2] font-extrabold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer text-xs">
            <Printer className="w-5 h-5 shrink-0" />
            <span>Imprimir etiqueta</span>
          </button>

          <button className="bg-[#C5CBE9] hover:bg-[#b4bce0] text-[#3B42B2] font-extrabold py-3 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Registrar uso</span>
          </button>
        </div>

        {/* SEÇÃO INFORMAÇÕES DO PACOTE */}
        <div className="space-y-2 pt-2">
          <h3 className="font-extrabold text-[#3B42B2] text-sm">
            Informações do pacote
          </h3>

          <div className="border border-slate-200/80 rounded-2xl p-4 bg-white shadow-xs">
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
              
              {/* Tipo de pacote */}
              <div>
                <p className="font-extrabold text-slate-800">Tipo de pacote:</p>
                <p className="text-slate-600 font-semibold">Kit cirúrgico</p>
              </div>

              {/* Data de esterilização */}
              <div>
                <p className="font-extrabold text-slate-800">Data de esterilização:</p>
                <p className="text-slate-600 font-semibold">20/05/2026 - 09:38</p>
              </div>

              {/* Conteúdo */}
              <div>
                <p className="font-extrabold text-slate-800">Conteúdo:</p>
                <p className="text-slate-600 font-semibold">10 itens</p>
              </div>

              {/* Validade */}
              <div>
                <p className="font-extrabold text-slate-800">Validade:</p>
                <p className="text-slate-600 font-semibold">27/08/2026</p>
              </div>

              {/* Autoclave */}
              <div>
                <p className="font-extrabold text-slate-800">Autoclave:</p>
                <p className="text-slate-600 font-semibold">01</p>
              </div>

              {/* Responsável */}
              <div>
                <p className="font-extrabold text-slate-800">Responsável:</p>
                <p className="text-slate-600 font-semibold">Vitória Taques</p>
              </div>

              {/* Ciclo */}
              <div>
                <p className="font-extrabold text-slate-800">Ciclo:</p>
                <p className="text-slate-600 font-semibold">2549</p>
              </div>

              {/* Status */}
              <div>
                <p className="font-extrabold text-slate-800">Status:</p>
                <p className="text-emerald-600 font-extrabold">Válido</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}