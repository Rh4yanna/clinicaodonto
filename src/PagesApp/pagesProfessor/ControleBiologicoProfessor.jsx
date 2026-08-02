import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Dados mockados baseados na imagem
const MOCK_CONTROLE = [
  {
    id: '1',
    autoclave: '01',
    ciclo: '2548',
    dataInicio: '20/05/2026 - 12:30',
    dataResultado: '20/05/2026 - 17:30',
    status: 'Em incubação', // Em incubação | Concluído | Negativo
  },
  {
    id: '2',
    autoclave: '02',
    ciclo: '2550',
    dataInicio: '20/05/2026 - 11:50',
    dataResultado: '21/05/2026 - 11:50',
    status: 'Em incubação',
  },
  {
    id: '3',
    autoclave: '03',
    ciclo: '2547',
    dataInicio: '19/05/2026 - 14:40',
    dataResultado: '20/05/2026 - 10:00',
    status: 'Concluído',
  },
  {
    id: '4',
    autoclave: '01',
    ciclo: '2546',
    dataInicio: '19/05/2026 - 09:30',
    lidoEm: '20/05/2026 - 09:00',
    resultadoFinal: 'Satisfatório',
    status: 'Negativo',
  }
];

// Ícone customizado de Autoclave para bater com a imagem
const AutoclaveIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Corpo */}
    <rect x="5" y="9" width="14" height="11" rx="2" />
    {/* Tampa superior */}
    <path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    {/* Relógio de pressão (Manômetro) */}
    <circle cx="10" cy="5" r="2" />
    <path d="M10 5l1 -1" />
    {/* Alças laterais */}
    <path d="M5 13H3" />
    <path d="M21 13h-2" />
    {/* Botões frontais */}
    <circle cx="9" cy="16" r="1.5" />
    <circle cx="15" cy="16" r="1.5" />
  </svg>
);

export default function ControleBiologicoProfessor() {
  const navigate = useNavigate();

  // Função para retornar o estilo correto da tag de status
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Em incubação':
        return 'bg-[#C5CBE9] text-[#3B42B2]';
      case 'Concluído':
        return 'bg-[#FDE6C5] text-amber-600';
      case 'Negativo':
        return 'bg-[#B8D8B2] text-emerald-800';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

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
          Controle Biológico
        </h1>

        <div className="w-9" />
      </div>

      {/* CARD PRINCIPAL BRANCO COM SCROLL */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-5 pt-6 pb-20 flex-1 overflow-y-auto flex flex-col space-y-6 shadow-inner relative">
        
        {/* CARDS DE RESUMO (KPIs) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Card: Em incubação */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-900 mb-0.5">Em incubação</span>
            <span className="text-4xl font-black text-[#3B42B2] leading-none mb-1">5</span>
            <span className="text-[10px] font-bold text-slate-700">Testes</span>
          </div>

          {/* Card: Para leitura */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-900 mb-0.5">Para leitura</span>
            <span className="text-4xl font-black text-[#3B42B2] leading-none mb-1">3</span>
            <span className="text-[10px] font-bold text-slate-700">Testes</span>
          </div>

          {/* Card: Não conformes */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-3 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-900 mb-0.5">Não conformes</span>
            <span className="text-4xl font-black text-red-600 leading-none mb-1">1</span>
            <span className="text-[10px] font-bold text-slate-700">Teste</span>
          </div>
        </div>

        {/* LISTA DE TESTES BIOLÓGICOS */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-slate-100">
          
          {MOCK_CONTROLE.map((item) => (
            <div key={item.id} className="p-4 flex gap-3">
              
              {/* Ícone */}
              <div className="shrink-0 mt-1">
                <AutoclaveIcon className="w-8 h-8 text-[#3B42B2]" />
              </div>

              {/* Informações */}
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-[#3B42B2] text-sm">
                  Autoclave {item.autoclave} - Ciclo {item.ciclo}
                </h4>
                
                <p className="text-[10px] text-slate-500 font-medium">
                  {item.dataInicio}
                </p>
                
                {/* Condicional para itens com resultado já lido ou não */}
                {item.status === 'Negativo' ? (
                  <>
                    <p className="text-[10px] text-slate-700 font-bold mt-1">
                      Lido em: <span className="font-medium text-slate-500">{item.lidoEm}</span>
                    </p>
                    <p className="text-[10px] text-slate-700 font-bold">
                      Resultado: <span className="font-black">{item.resultadoFinal}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-[10px] text-slate-700 font-bold mt-1">
                    Resultado em: <span className="font-medium text-slate-500">{item.dataResultado}</span>
                  </p>
                )}
              </div>

              {/* Badge de Status */}
              <div className="shrink-0 flex items-start">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${getBadgeStyle(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}