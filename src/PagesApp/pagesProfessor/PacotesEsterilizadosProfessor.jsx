import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Search, ChevronDown, Check } from 'lucide-react';

// Lista de dados mockados
const MOCK_PACOTES = [
  {
    id: '1',
    nome: 'Kit Cirúrgico 01',
    codigo: '125794215546',
    autoclave: '01',
    ciclo: '2548',
    data: '20/05/2026 - 09:30',
    status: 'Válido',
    tipo: 'Kit Cirúrgico'
  },
  {
    id: '2',
    nome: 'Kit Cirúrgico 03',
    codigo: '4687913200005',
    autoclave: '03',
    ciclo: '2548',
    data: '20/05/2026 - 09:34',
    status: 'Válido',
    tipo: 'Kit Cirúrgico'
  },
  {
    id: '3',
    nome: 'Campo Fenestrado 02',
    codigo: '9876543210012',
    autoclave: '02',
    ciclo: '2545',
    data: '18/05/2026 - 14:20',
    status: 'Vencido',
    tipo: 'Campo'
  },
  {
    id: '4',
    nome: 'Bandeja de Diagnóstico',
    codigo: '1122334455667',
    autoclave: '01',
    ciclo: '2540',
    data: '15/05/2026 - 11:00',
    status: 'Em Uso',
    tipo: 'Instrumental'
  }
];

export default function PacotesEsterilizadosProfessor() {
  const navigate = useNavigate();

  // ESTADOS DE BUSCA E SELEÇÃO DE FILTROS
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  // ESTADOS PARA CONTROLAR A ABERTURA DOS MENUS
  const [openStatus, setOpenStatus] = useState(false);
  const [openTipo, setOpenTipo] = useState(false);

  const opcoesStatus = ['Todos', 'Válido', 'Vencido', 'Em Uso'];
  const opcoesTipo = ['Todos', 'Kit Cirúrgico', 'Campo', 'Instrumental'];

  // LÓGICA DE FILTRAGEM
  const pacotesFiltrados = MOCK_PACOTES.filter((item) => {
    const atendeBusca =
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.codigo.includes(busca);

    const atendeStatus =
      statusFiltro === 'Todos' || item.status === statusFiltro;

    const atendeTipo =
      tipoFiltro === 'Todos' || item.tipo === tipoFiltro;

    return atendeBusca && atendeStatus && atendeTipo;
  });

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
          Pacotes Esterilizados
        </h1>

        <div className="w-9" />
      </div>

      {/* CARD PRINCIPAL BRANCO COM SCROLL */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-5 pb-8 flex-1 overflow-y-auto flex flex-col space-y-4 shadow-inner relative">
        
        {/* BARRA DE PESQUISA */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B42B2]"
          />
        </div>

        {/* SELETORES EM MODO DROPDOWN / REFLUXO */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          
          {/* 1. SELECTOR DE STATUS */}
          <div className="relative">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Status:
            </label>
            
            {/* BOTÃO QUE EXIBE O SELECIONADO */}
            <button
              onClick={() => {
                setOpenStatus(!openStatus);
                setOpenTipo(false); // fecha o outro menu se estiver aberto
              }}
              className="w-full bg-slate-100 border border-slate-200 text-[#3B42B2] font-extrabold text-xs px-3 py-2 rounded-xl flex items-center justify-between shadow-xs cursor-pointer active:scale-98 transition"
            >
              <span className="truncate">{statusFiltro}</span>
              <ChevronDown className={`w-4 h-4 text-[#3B42B2] transition-transform duration-200 ${openStatus ? 'rotate-180' : ''}`} />
            </button>

            {/* OPCÕES QUE APARECEM AO CLICAR E SOBRESCREVEM O CONTEÚDO */}
            {openStatus && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 space-y-0.5 p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {opcoesStatus.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFiltro(st);
                      setOpenStatus(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      statusFiltro === st
                        ? 'bg-[#3B42B2] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{st}</span>
                    {statusFiltro === st && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. SELECTOR DE TIPO */}
          <div className="relative">
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Tipo:
            </label>
            
            {/* BOTÃO QUE EXIBE O SELECIONADO */}
            <button
              onClick={() => {
                setOpenTipo(!openTipo);
                setOpenStatus(false); // fecha o outro menu se estiver aberto
              }}
              className="w-full bg-slate-100 border border-slate-200 text-[#3B42B2] font-extrabold text-xs px-3 py-2 rounded-xl flex items-center justify-between shadow-xs cursor-pointer active:scale-98 transition"
            >
              <span className="truncate">{tipoFiltro}</span>
              <ChevronDown className={`w-4 h-4 text-[#3B42B2] transition-transform duration-200 ${openTipo ? 'rotate-180' : ''}`} />
            </button>

            {/* OPÇÕES QUE APARECEM AO CLICAR E SOBRESCREVEM O CONTEÚDO */}
            {openTipo && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20 space-y-0.5 p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {opcoesTipo.map((tp) => (
                  <button
                    key={tp}
                    onClick={() => {
                      setTipoFiltro(tp);
                      setOpenTipo(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      tipoFiltro === tp
                        ? 'bg-[#3B42B2] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{tp}</span>
                    {tipoFiltro === tp && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* LISTA DE PACOTES FILTRADOS */}
        <div className="space-y-3 pt-2">
          {pacotesFiltrados.length > 0 ? (
            pacotesFiltrados.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/app/professor/cme/pacote-detalhes', { state: { pacote: item } })}
                className="border border-slate-200 rounded-2xl p-3 bg-white shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/60 shrink-0">
                    <span className="text-xl">📦</span>
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-[#3B42B2] text-xs">
                      {item.nome}
                    </h4>
                    <p className="text-[9px] text-slate-500 font-bold">
                      Código: {item.codigo}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold">
                      Autoclave: {item.autoclave}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold">
                      Ciclo: {item.ciclo}
                    </p>
                    <p className="text-[8px] text-slate-400 font-medium">
                      {item.data}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      item.status === 'Válido'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'Vencido'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[#3B42B2]" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-sm font-bold text-slate-400">
                Nenhum pacote encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}