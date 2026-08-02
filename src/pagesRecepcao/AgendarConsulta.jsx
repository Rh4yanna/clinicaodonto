import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, ChevronRight, Stethoscope, RefreshCw, Wrench, Scissors, Search, UserPlus } from 'lucide-react';

export default function AgendarConsulta() {
  const navigate = useNavigate();
  const buscaRef = useRef(null);

  // Estados do formulário
  const [tipoConsulta, setTipoConsulta] = useState('Avaliação');
  const [termoBusca, setTermoBusca] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  // Banco de dados mockado para teste da pesquisa
  const listaPacientesMock = [
    { id: 1, nome: "Rhaya Borges", cpf: "012.123.456-89", status: "Ativo" },
    { id: 2, nome: "Ana Beatriz Santos", cpf: "456.789.123-00", status: "Ativo" },
    { id: 3, nome: "Carlos Eduardo Lima", cpf: "789.456.123-11", status: "Inativo" },
    { id: 4, nome: "Mariana Costa", cpf: "321.654.987-22", status: "Ativo" }
  ];

  // Filtra os pacientes conforme digita
  const pacientesFiltrados = listaPacientesMock.filter(paciente =>
    paciente.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    paciente.cpf.includes(termoBusca)
  );

  // Fecha o dropdown ao clicar fora do campo
  useEffect(() => {
    function handleClickOutside(event) {
      if (buscaRef.current && !buscaRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 select-none">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 text-[#3B44A8]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black">Agendar Consulta</h1>
      </div>

      {/* ÁREA SELECIONAR / BUSCAR PACIENTE */}
      <div className="space-y-2" ref={buscaRef}>
        <label className="text-sm font-black text-[#3B44A8]">Paciente</label>
        
        {!pacienteSelecionado ? (
          /* INPUT DE BUSCA QUANDO NÃO HÁ PACIENTE SELECIONADO */
          <div className="relative">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar paciente por nome ou CPF..."
                  value={termoBusca}
                  onFocus={() => setMostrarDropdown(true)}
                  onChange={(e) => {
                    setTermoBusca(e.target.value);
                    setMostrarDropdown(true);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 p-3.5 text-sm font-medium focus:outline-none focus:border-[#3B44A8] transition-all shadow-sm"
                />
                <Search size={18} className="absolute left-4 top-4 text-gray-400" />
              </div>

              {/* BOTÃO ADICIONAR NOVO PACIENTE CASO NÃO TENHA CADASTRO */}
              <button 
                type="button"
                onClick={() => navigate('/app/recepcao/pacientes')} // Ajuste para sua rota de cadastro
                className="bg-white border border-dashed border-gray-300 hover:border-[#3B44A8] hover:bg-blue-50/30 text-gray-600 hover:text-[#3B44A8] font-bold text-xs px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-sm"
              >
                <UserPlus size={16} />
                Adicionar paciente
              </button>
            </div>

            {/* DROPDOWN DE RESULTADOS DA BUSCA */}
            {mostrarDropdown && termoBusca.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-gray-50">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <button
                      key={paciente.id}
                      type="button"
                      onClick={() => {
                        setPacienteSelecionado(paciente);
                        setMostrarDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-800">{paciente.nome}</p>
                        <p className="text-xs text-gray-400 font-medium">{paciente.cpf}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        paciente.status === 'Ativo' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {paciente.status}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400 text-xs font-medium">
                    Nenhum paciente encontrado.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* CARD DE PACIENTE ATIVO JÁ SELECIONADO (DO SEU LAYOUT ORIGINAL) */
          <div className="bg-white border border-[#3B44A8] ring-1 ring-[#3B44A8]/20 bg-blue-50/10 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                <User size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-sm">{pacienteSelecionado.nome}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    pacienteSelecionado.status === 'Ativo' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {pacienteSelecionado.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-0.5">{pacienteSelecionado.cpf}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setPacienteSelecionado(null);
                  setTermoBusca('');
                }} 
                className="text-xs text-red-500 hover:underline font-bold"
              >
                Alterar
              </button>
              <span className="w-px h-4 bg-gray-200" />
              <button className="text-[#3B44A8] text-xs font-bold flex items-center gap-0.5 hover:underline">
                Ver histórico <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FORMULÁRIO COMPLETO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        {/* Disciplina */}
        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Disciplina</label>
          <select className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#3B44A8]">
            <option>Selecione</option>
            <option>Periodontia</option>
            <option>Endodontia</option>
          </select>
        </div>

        {/* Tipo de Consulta */}
        <div className="space-y-2">
          <label className="text-sm font-black text-[#3B44A8]">Tipo de consulta</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Avaliação', title: 'Avaliação', desc: 'Avaliação inicial e diagnóstico', icon: <Stethoscope size={20} /> },
              { id: 'Retorno', title: 'Retorno', desc: 'Acompanhamento e retorno', icon: <RefreshCw size={20} /> },
              { id: 'Procedimento', title: 'Procedimento', desc: 'Procedimentos clínicos', icon: <Wrench size={20} /> },
              { id: 'Cirurgia', title: 'Cirurgia', desc: 'Procedimentos cirúrgicos', icon: <Scissors size={20} /> }
            ].map((tipo) => (
              <button
                key={tipo.id}
                type="button"
                onClick={() => setTipoConsulta(tipo.id)}
                className={`p-3 border rounded-xl flex items-start gap-3 text-left transition-all ${
                  tipoConsulta === tipo.id 
                    ? 'border-[#3B44A8] bg-blue-50/50 ring-1 ring-[#3B44A8]' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={tipoConsulta === tipo.id ? 'text-[#3B44A8]' : 'text-gray-400'}>
                  {tipo.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-800">{tipo.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">{tipo.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profissional / Aluno */}
        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Profissional / Aluno</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Profissional responsável *</span>
              <input type="text" placeholder="Nome do profissional" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Aluno responsável *</span>
              <input type="text" placeholder="Nome do aluno" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
            </div>
          </div>
        </div>

        {/* Data e Horário */}
        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Data e horário</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input type="text" placeholder="dd/mm/aaaa" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
              <Calendar size={18} className="absolute right-3 top-3.5 text-gray-400" />
            </div>
            <div className="relative">
              <input type="text" placeholder="00:00" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
              <Clock size={18} className="absolute right-3 top-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Observações</label>
          <textarea rows="2" placeholder="Adicione observações (opcional)" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8] resize-none" />
        </div>

        {/* Botão de Ação */}
        <button 
          disabled={!pacienteSelecionado}
          className={`w-full font-black text-sm p-4 rounded-xl shadow-md transition-all pt-3.5 pb-3.5 ${
            pacienteSelecionado 
              ? 'bg-[#F9A814] text-white hover:bg-orange-500 cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Agendar consulta
        </button>
      </div>
    </div>
  );
}