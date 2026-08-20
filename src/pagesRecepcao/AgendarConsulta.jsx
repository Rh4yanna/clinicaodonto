import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, User, Calendar, Clock, ChevronRight, 
  Stethoscope, RefreshCw, Wrench, Scissors, Search, 
  UserPlus, Loader2, CheckCircle2, AlertCircle 
} from 'lucide-react';
import api from '../Services/api';

export default function AgendarConsulta() {
  const navigate = useNavigate();
  const location = useLocation();
  const buscaRef = useRef(null);

  // Estados do formulário
  const [disciplina, setDisciplina] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('Avaliação');
  const [profissional, setProfissional] = useState('');
  const [aluno, setAluno] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Estados de busca de pacientes
  const [termoBusca, setTermoBusca] = useState('');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [buscandoPacientes, setBuscandoPacientes] = useState(false);

  // Estados de submissão do formulário
  const [enviando, setEnviando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');

  // Captura o paciente novo criado se tiver retornado da tela de cadastro
  useEffect(() => {
    if (location.state?.pacienteNovo) {
      const novo = location.state.pacienteNovo;
      setPacienteSelecionado({
        id: novo.id || novo._id,
        nome: novo.nome,
        cpf: novo.cpf || 'Sem CPF',
        status: novo.status || 'Ativo'
      });
    }
  }, [location.state]);

  // Busca dinamicamente os pacientes na API
  useEffect(() => {
    const buscarPacientesAPI = async () => {
      if (termoBusca.trim().length === 0) {
        setPacientesFiltrados([]);
        return;
      }

      setBuscandoPacientes(true);
      try {
        const response = await api.get('/pacientes', {
          params: { busca: termoBusca }
        });

        const lista = response.data.map(p => ({
          id: p.id || p._id,
          nome: p.nome,
          cpf: p.cpf || 'Sem CPF',
          status: p.status || 'Ativo'
        }));

        setPacientesFiltrados(lista);
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
      } finally {
        setBuscandoPacientes(false);
      }
    };

    const timer = setTimeout(() => {
      if (termoBusca) buscarPacientesAPI();
    }, 300);

    return () => clearTimeout(timer);
  }, [termoBusca]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (buscaRef.current && !buscaRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pacienteSelecionado) {
      setErro('Por favor, selecione um paciente.');
      return;
    }

    setEnviando(true);
    setErro('');
    setMensagemSucesso('');

    try {
      const payload = {
        pacienteId: pacienteSelecionado.id,
        pacienteNome: pacienteSelecionado.nome,
        disciplina,
        tipoConsulta,
        procedimento: tipoConsulta,
        profissional,
        aluno,
        data,
        hora,
        observacoes,
        status: 'AGENDADO'
      };

      await api.post('/agendamentos', payload);

      setMensagemSucesso('Consulta agendada com sucesso!');
      
      setTimeout(() => {
        navigate(-1);
      }, 1500);

    } catch (err) {
      console.error('Erro ao agendar consulta:', err);
      const msg = err.response?.data?.message || err.response?.data?.mensagem || 'Não foi possível agendar a consulta. Verifique os dados fornecidos.';
      setErro(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 select-none font-sans">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 text-[#3B44A8]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black">Agendar Consulta</h1>
      </div>

      {/* Busca de Paciente */}
      <div className="space-y-2" ref={buscaRef}>
        <label className="text-sm font-black text-[#3B44A8]">Paciente *</label>
        
        {!pacienteSelecionado ? (
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

              <button 
                type="button"
                onClick={() => navigate('/app/recepcao/pacientes/cadastro')}
                className="bg-white border border-dashed border-gray-300 hover:border-[#3B44A8] hover:bg-blue-50/30 text-gray-600 hover:text-[#3B44A8] font-bold text-xs px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-sm cursor-pointer"
              >
                <UserPlus size={16} />
                Adicionar paciente
              </button>
            </div>

            {mostrarDropdown && termoBusca.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-gray-50">
                {buscandoPacientes ? (
                  <div className="p-4 text-center text-gray-400 text-xs font-medium flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#3B44A8]" /> Buscando pacientes...
                  </div>
                ) : pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <button
                      key={paciente.id}
                      type="button"
                      onClick={() => {
                        setPacienteSelecionado(paciente);
                        setMostrarDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between transition-colors cursor-pointer"
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
          <div className="bg-white border border-[#3B44A8] ring-1 ring-[#3B44A8]/20 bg-blue-50/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
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
                type="button"
                onClick={() => {
                  setPacienteSelecionado(null);
                  setTermoBusca('');
                }} 
                className="text-xs text-red-500 hover:underline font-bold cursor-pointer"
              >
                Alterar
              </button>
              <span className="w-px h-4 bg-gray-200" />
              <button 
                type="button" 
                onClick={() => navigate(`/app/recepcao/pacientes/${pacienteSelecionado.id}`)}
                className="text-[#3B44A8] text-xs font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                Ver histórico <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        
        {erro && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle size={16} className="shrink-0" />
            {erro}
          </div>
        )}

        {mensagemSucesso && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            {mensagemSucesso}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Disciplina *</label>
          <select 
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            required
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#3B44A8]"
          >
            <option value="">Selecione uma disciplina</option>
            <option value="Periodontia">Periodontia</option>
            <option value="Endodontia">Endodontia</option>
            <option value="Dentística">Dentística</option>
            <option value="Odontopediatria">Odontopediatria</option>
            <option value="Cirurgia">Cirurgia</option>
          </select>
        </div>

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
                className={`p-3 border rounded-xl flex items-start gap-3 text-left transition-all cursor-pointer ${
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

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Profissional / Aluno</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Profissional responsável *</span>
              <input 
                type="text" 
                placeholder="Nome do profissional" 
                value={profissional}
                onChange={(e) => setProfissional(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" 
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 block mb-1">Aluno responsável *</span>
              <input 
                type="text" 
                placeholder="Nome do aluno" 
                value={aluno}
                onChange={(e) => setAluno(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Data e horário *</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input 
                type="date" 
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" 
              />
              <Calendar size={18} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <input 
                type="time" 
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" 
              />
              <Clock size={18} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Observações</label>
          <textarea 
            rows="2" 
            placeholder="Adicione observações (opcional)" 
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8] resize-none" 
          />
        </div>

        <button 
          type="submit"
          disabled={!pacienteSelecionado || enviando}
          className={`w-full font-black text-sm p-4 rounded-xl shadow-md transition-all pt-3.5 pb-3.5 flex items-center justify-center gap-2 ${
            pacienteSelecionado && !enviando
              ? 'bg-[#F9A814] text-white hover:bg-orange-500 cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {enviando ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Agendando...
            </>
          ) : (
            'Agendar consulta'
          )}
        </button>
      </form>
    </div>
  );
}