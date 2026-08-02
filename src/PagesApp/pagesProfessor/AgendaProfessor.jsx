import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from 'lucide-react';

export default function AgendaProfessor() {
  const navigate = useNavigate();

  // Estados dos Modais / Dropdowns
  const [modalDisciplinasAberto, setModalDisciplinasAberto] = useState(false);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('Todas as disciplinas');
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  // Lista de Disciplinas disponíveis
  const listaDisciplinas = [
    'Todas as disciplinas',
    'Dentística',
    'Endodontia',
    'Periodontia',
    'Ortodontia',
    'Odontopediatria',
    'Cirurgia Bucal',
    'Prótese',
    'Reabilitação Bucal'
  ];

  // Dados Mockados da Agenda
  const agendamentos = [
    {
      disciplina: 'Dentística',
      pacientes: [
        { id: 1, hora: '09:30', nome: 'Nome do paciente', procedimento: 'Clareamento Dental' },
        { id: 2, hora: '11:40', nome: 'Nome do paciente', procedimento: 'Restauração' }
      ]
    },
    {
      disciplina: 'Endodontia',
      pacientes: [
        { id: 3, hora: '13:00', nome: 'Nome do paciente', procedimento: 'Tratamento de Canal' }
      ]
    },
    {
      disciplina: 'Periodontia',
      pacientes: []
    }
  ];

  // Filtragem por disciplina
  const agendamentosFiltrados = agendamentos.filter((grupo) => {
    if (disciplinaSelecionada === 'Todas as disciplinas') return true;
    return grupo.disciplina === disciplinaSelecionada;
  });

  return (
    <div 
      className="w-full h-full bg-[#3B42B2] text-white flex flex-col font-sans m-0 p-0 overflow-hidden relative"
      onClick={() => {
        setMenuAbertoId(null);
        if (modalDisciplinasAberto) setModalDisciplinasAberto(false);
      }}
    >
      {/* 1. HEADER / TOPO */}
      <div className="pt-8 pb-4 px-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-lg font-semibold tracking-wide text-center flex-1">
          Agenda
        </h1>

        <div className="w-9" /> {/* Espaçador */}
      </div>

      {/* 2. CARD PRINCIPAL BRANCO */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-5 pb-6 flex-1 overflow-y-auto flex flex-col space-y-4 shadow-inner relative">
        
        {/* BOTÃO SELECT DE DISCIPLINAS */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalDisciplinasAberto(!modalDisciplinasAberto);
            }}
            className="w-full border border-slate-200 rounded-2xl py-3 px-4 flex items-center justify-between text-[#3B42B2] font-semibold text-xs bg-white shadow-xs cursor-pointer hover:bg-slate-50 transition"
          >
            <span>{disciplinaSelecionada}</span>
            {modalDisciplinasAberto ? (
              <ChevronUp className="w-5 h-5 text-amber-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-500" />
            )}
          </button>
        </div>

        {/* CALENDÁRIO SEMANAL */}
        <div className="pt-1 pb-2">
          <div className="flex items-center justify-between text-[#3B42B2] font-bold text-sm mb-3 px-2">
            <button className="p-1 hover:bg-slate-100 rounded-full transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span>Maio 2026</span>
            <button className="p-1 hover:bg-slate-100 rounded-full transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center gap-1">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, idx) => (
              <span key={idx} className="text-[10px] font-bold text-slate-400">
                {dia}
              </span>
            ))}

            {[
              { dia: 24, ativo: false },
              { dia: 25, ativo: true },
              { dia: 26, ativo: false },
              { dia: 27, ativo: false },
              { dia: 28, ativo: false },
              { dia: 29, ativo: false },
              { dia: 30, ativo: false }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-center pt-1">
                <button
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                    item.ativo
                      ? 'bg-[#3B42B2] text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.dia}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DE ATENDIMENTOS POR DISCIPLINA */}
        <div className="space-y-4 pb-6">
          {agendamentosFiltrados.map((grupo, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs space-y-3">
              {/* Título do Grupo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    🦷
                  </div>
                  <h3 className="font-extrabold text-[#3B42B2] text-xs">
                    {grupo.disciplina}
                  </h3>
                </div>

                <span className="bg-indigo-50 text-[#3B42B2] text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {grupo.pacientes.length > 0 
                    ? `${grupo.pacientes.length} agendamento${grupo.pacientes.length > 1 ? 's' : ''}`
                    : 'Sem agendamentos'
                  }
                </span>
              </div>

              {/* Pacientes do Grupo */}
              {grupo.pacientes.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {grupo.pacientes.map((paciente) => (
                    <div key={paciente.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-500 w-10">
                          {paciente.hora}
                        </span>

                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs">
                            {paciente.nome}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {paciente.procedimento}
                          </p>
                        </div>
                      </div>

                      {/* Botão dos 3 pontinhos */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAbertoId(menuAbertoId === paciente.id ? null : paciente.id);
                          }}
                          className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer"
                        >
                          <MoreVertical className="w-5 h-5 text-[#3B42B2]" />
                        </button>

                        {/* MENU POPUP */}
                        {menuAbertoId === paciente.id && (
                          <div 
                            className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setMenuAbertoId(null);
                                navigate('/app/professor/atendimento');
                              }}
                              className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition"
                            >
                              Ver atendimento
                            </button>
                            <button
                              onClick={() => {
                                setMenuAbertoId(null);
                                navigate('/app/professor/pacientes/detalhes');
                              }}
                              className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition"
                            >
                              Ver paciente
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 font-medium py-2 text-center">
                  Não há pacientes agendados para essa data.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 3. MODAL POPUP SELEÇÃO DE DISCIPLINAS */}
        {modalDisciplinasAberto && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setModalDisciplinasAberto(false)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-xs p-5 space-y-3 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-extrabold text-[#3B42B2] text-sm">
                  Todas as disciplinas
                </span>
                <ChevronUp className="w-5 h-5 text-amber-500" />
              </div>

              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                {listaDisciplinas.map((item, idx) => {
                  const selecionado = disciplinaSelecionada === item;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setDisciplinaSelecionada(item);
                        setModalDisciplinasAberto(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 font-bold text-xs">
                          🦷
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {item}
                        </span>
                      </div>

                      {/* Radio button personalizado */}
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selecionado ? 'border-[#3B42B2] bg-[#3B42B2]' : 'border-slate-300'
                      }`}>
                        {selecionado && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}