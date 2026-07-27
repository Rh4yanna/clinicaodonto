import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Home,
  Calendar as CalendarIcon,
  Scissors,
  Users,
  CheckCircle,
  Box,
  User
} from 'lucide-react';

export default function PacientesProfessor() {
  const navigate = useNavigate();

  // Estados da página
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos' | 'ativos' | 'inativos'

  // Fila de pacientes (dados simulados)
  const [pacientes] = useState([
    { id: 1, nome: 'Kauan Ferreira', cpf: '012.123.456-89', status: 'ativo' },
    { id: 2, nome: 'Nome do paciente', cpf: 'CPF', status: 'ativo' },
    { id: 3, nome: 'Nome do paciente', cpf: 'CPF', status: 'ativo' },
    { id: 4, nome: 'Nome do paciente', cpf: 'CPF', status: 'ativo' },
    { id: 5, nome: 'Nome do paciente', cpf: 'CPF', status: 'ativo' },
    { id: 6, nome: 'Nome do paciente', cpf: 'CPF', status: 'ativo' },
  ]);

  // Filtragem dos pacientes por busca e por aba (Todos / Ativos / Inativos)
  const pacientesFiltrados = pacientes.filter((p) => {
    const atendeFiltroStatus =
      filtroStatus === 'todos' ? true : p.status === filtroStatus;

    const atendeBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.cpf.toLowerCase().includes(busca.toLowerCase());

    return atendeFiltroStatus && atendeBusca;
  });

  return (
    <div className="w-full h-full min-h-screen bg-[#3B42B2] text-white flex flex-col justify-between font-sans m-0 p-0 overflow-x-hidden">
      
      {/* TOPO FIXO / HEADER */}
      <div className="pt-8 pb-4 px-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-medium tracking-wide text-center flex-1 pr-8">
          Pacientes
        </h1>
      </div>

      {/* CORPO PRINCIPAL (FUNDO BRANCO ARREDONDADO) */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-5 pb-6 flex-1 flex flex-col space-y-4">
        
        {/* BARRA DE PESQUISA */}
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar paciente"
            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3B42B2] shadow-sm"
          />
        </div>

        {/* BOTOES DE FILTRO (Todos / Ativos / Inativos) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filtroStatus === 'todos'
                ? 'bg-[#3B42B2] text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setFiltroStatus('ativos')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filtroStatus === 'ativos'
                ? 'bg-[#3B42B2] text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Ativos
          </button>

          <button
            onClick={() => setFiltroStatus('inativos')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filtroStatus === 'inativos'
                ? 'bg-[#3B42B2] text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Inativos
          </button>
        </div>

        {/* LISTA DE PACIENTES OU MENSAGEM DE LISTA VAZIA */}
        <div className="flex-1 flex flex-col justify-start">
          {pacientesFiltrados.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
              {pacientesFiltrados.map((paciente) => (
                <div
                  key={paciente.id}
                  onClick={() => navigate('/app/professor/pacientes/detalhes')}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer active:bg-slate-100 gap-3"
                >
                  {/* Ícone de Usuário Arredondado */}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0 bg-slate-50">
                    <User className="w-6 h-6 text-slate-800" />
                  </div>

                  {/* Informações do Paciente */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                      {paciente.nome}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {paciente.cpf}
                    </p>
                  </div>

                  {/* Seta indicativa */}
                  <ChevronRight className="w-5 h-5 text-[#3B42B2] shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-16">
              <p className="text-slate-400 font-bold text-sm text-center">
                {filtroStatus === 'inativos'
                  ? 'Não há pacientes inativos'
                  : 'Nenhum paciente encontrado'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="bg-[#3B42B2] px-2 py-3 flex items-center justify-around border-t border-white/10 sticky bottom-0 z-10 shrink-0">
        <button
          onClick={() => navigate('/app/professor/dashboard')}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Agenda</span>
        </button>

        <button
          onClick={() => navigate('/app/professor/cirurgias')}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer"
        >
          <Scissors className="w-5 h-5 rotate-90" />
          <span className="text-[10px] font-medium">Cirurgias</span>
        </button>

        {/* ABA ATIVA COM DESTAQUE AMARELO */}
        <button className="flex flex-col items-center gap-1 text-amber-400 font-bold cursor-pointer">
          <Users className="w-5 h-5 text-amber-400" />
          <span className="text-[10px]">Pacientes</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <CheckCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">CME</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <Box className="w-5 h-5" />
          <span className="text-[10px] font-medium">Estoque</span>
        </button>
      </div>

    </div>
  );
}