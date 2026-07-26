import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, 
  MoreVertical, Eye, User2, Stethoscope 
} from 'lucide-react';

export default function AgendaAluno() {
  const navigate = useNavigate();
  
  // Captura automática da data real atual do dispositivo
  const [dataContexto, setDataContexto] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(new Date().getDate());

  // Estados dos controles de interface
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('Todas as disciplinas');
  const [dropdownDisciplinasAberto, setDropdownDisciplinasAberto] = useState(false);
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  const listaDisciplinas = [
    { nome: 'Todas as disciplinas' },
    { nome: 'Dentística' },
    { nome: 'Endodontia' },
    { nome: 'Periodontia' },
    { nome: 'Ortodontia' },
    { nome: 'Odontopediatria' },
    { nome: 'Cirurgia Bucal' },
    { nome: 'Prótese' },
    { nome: 'Reabilitação Bucal' }
  ];

  const pacientesMock = [
    { id: 1, hora: '09:30', nome: 'Kauan Ferreira', procedimento: 'Clareamento Dental', disciplina: 'Dentística', cpf: '012.123.456-89', telefone: '(42) 99999-7777', status: 'Ativo' },
    { id: 2, hora: '11:40', nome: 'Nome do paciente', procedimento: 'Restauração', disciplina: 'Dentística', cpf: '000.000.000-00', telefone: '(42) 99999-0000', status: 'Ativo' },
    { id: 3, hora: '13:00', nome: 'Nome do paciente', procedimento: 'Tratamento de Canal', disciplina: 'Endodontia', cpf: '111.111.111-11', telefone: '(42) 98888-8888', status: 'Ativo' }
  ];

  // Cálculo da grade do calendário mensal completo
  const anoAtual = dataContexto.getFullYear();
  const mesAtual = dataContexto.getMonth();
  
  const nomeMes = dataContexto.toLocaleDateString('pt-BR', { month: 'long' });
  const nomeMesCapitalizado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const diasDoMes = [];
  for (let i = 0; i < primeiroDiaSemana; i++) {
    diasDoMes.push({ dia: '', ativo: false });
  }
  for (let i = 1; i <= totalDiasNoMes; i++) {
    diasDoMes.push({ dia: i, ativo: true });
  }

  const diasSemanaLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const navegarMes = (direcao) => {
    const novaData = new Date(anoAtual, mesAtual + direcao, 1);
    setDataContexto(novaData);
    setDiaSelecionado(1);
  };

  const alternarMenuPacientes = (id) => {
    setMenuAbertoId(menuAbertoId === id ? null : id);
  };

  const disciplinasParaExibir = disciplinaSelecionada === 'Todas as disciplinas'
    ? ['Dentística', 'Endodontia', 'Periodontia'] 
    : [disciplinaSelecionada];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FD]">
      
      {/* HEADER FIXO AZUL */}
      <div className="bg-[#3B44A8] pt-12 pb-6 px-6 text-white flex items-center justify-between shadow-md rounded-b-[24px] shrink-0 relative z-30">
        <button 
          onClick={() => navigate('/app/aluno/dashboard')}
          className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-bold tracking-wide">Agenda</h1>
        <div className="w-6"></div>
      </div>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-8 relative z-10">
        
        {/* DROPDOWN DE FILTRO POR DISCIPLINAS */}
        <div className="relative z-20">
          <button
            onClick={() => setDropdownDisciplinasAberto(!dropdownDisciplinasAberto)}
            className="w-full bg-white border border-gray-200/80 rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm text-xs font-bold text-[#3B44A8] transition hover:border-[#3B44A8]/30 active:bg-gray-50"
          >
            <span className="truncate">{disciplinaSelecionada}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${dropdownDisciplinasAberto ? 'rotate-180' : ''}`} />
          </button>

          {dropdownDisciplinasAberto && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownDisciplinasAberto(false)}></div>
              <div className="absolute left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-20 max-h-60 overflow-y-auto">
                {listaDisciplinas.map((disc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDisciplinaSelecionada(disc.nome);
                      setDropdownDisciplinasAberto(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between transition ${
                      disciplinaSelecionada === disc.nome ? 'bg-[#3B44A8]/5 text-[#3B44A8]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{disc.nome}</span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      disciplinaSelecionada === disc.nome ? 'border-[#3B44A8] bg-[#3B44A8]' : 'border-gray-300'
                    }`}>
                      {disciplinaSelecionada === disc.nome && <div className="w-1 h-1 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CALENDÁRIO MENSAL COMPLETO */}
        <div className="w-full bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden select-none p-4">
          
          <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-gray-100">
            <button onClick={() => navegarMes(-1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-xs font-bold text-[#3B44A8] tracking-wider">
              {nomeMesCapitalizado} {anoAtual}
            </h2>
            <button onClick={() => navegarMes(1)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-black text-gray-400 uppercase mb-2">
            {diasSemanaLabels.map((d) => (
              <div key={d} className="py-0.5">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-bold text-gray-700">
            {diasDoMes.map((item, index) => {
              if (!item.ativo) return <div key={`vazio-${index}`} className="py-2"></div>;
              
              const isSelected = diaSelecionado === item.dia;
              return (
                <div key={`dia-${item.dia}`} className="flex justify-center items-center py-0.5">
                  <button
                    onClick={() => setDiaSelecionado(item.dia)}
                    className={`w-7 h-7 text-[11px] rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#3B44A8] text-white shadow-md font-black scale-105' : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.dia}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* LISTAGEM DOS BLOCOS DE DISCIPLINAS */}
        <div className="space-y-4">
          {disciplinasParaExibir.map((disciplina, dIdx) => {
            const pacientesFiltrados = pacientesMock.filter((p) => p.disciplina === disciplina);
            const totalAgendamentos = pacientesFiltrados.length;

            return (
              <div key={dIdx} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-3 relative">
                
                <div className="flex items-center justify-between border-b border-gray-50 pb-2 select-none">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-50 border border-orange-100 text-orange-500 rounded-lg">
                      <Stethoscope size={14} />
                    </div>
                    <h3 className="text-xs font-black text-[#3B44A8]">{disciplina}</h3>
                  </div>
                  
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${
                    totalAgendamentos > 0 ? 'bg-[#3B44A8]/5 text-[#3B44A8]' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {totalAgendamentos > 0 ? `${totalAgendamentos} agendamentos` : 'Sem agendamentos'}
                  </span>
                </div>

                {totalAgendamentos > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {pacientesFiltrados.map((paciente) => (
                      <div key={paciente.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 relative">
                        
                        <span className="text-gray-500 font-bold text-[11px] w-12 shrink-0">
                          {paciente.hora}
                        </span>

                        <div className="flex-1 min-w-0 px-2">
                          <h4 className="font-bold text-gray-900 text-xs truncate">{paciente.nome}</h4>
                          <p className="text-gray-400 text-[10px] truncate font-medium mt-0.5">{paciente.procedimento}</p>
                        </div>

                        {/* MENU INTERNO DE OPÇÕES (3 PONTINHOS) */}
                        <div className="relative">
                          <button 
                            onClick={() => alternarMenuPacientes(paciente.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {menuAbertoId === paciente.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setMenuAbertoId(null)}></div>
                              <div className="absolute right-0 mt-1 w-34 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-40">
                                <button 
                                  onClick={() => {
                                    setMenuAbertoId(null);
                                    navigate('/app/aluno/agenda/detalhes', { state: { paciente } });
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition"
                                >
                                  <Eye size={12} className="text-gray-400" />
                                  Ver atendimento
                                </button>
                                <button 
                                  onClick={() => {
                                    setMenuAbertoId(null);
                                    navigate('/app/aluno/pacientes/detalhes', { state: { paciente } });
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 border-t border-gray-50 transition"
                                >
                                  <User2 size={12} className="text-gray-400" />
                                  Ver paciente
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-[10px] text-gray-400 font-medium select-none">
                    Não há pacientes agendados para essa data.
                  </p>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}