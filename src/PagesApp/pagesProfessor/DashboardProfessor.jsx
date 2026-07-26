import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Bell, Calendar, ChevronRight, Home, CalendarDays, 
  Stethoscope, Users, Box, PackageCheck, ArrowLeft, User, 
  ShieldCheck, CloudDownload, FileText, FileSearch, LogOut, CheckCircle2,
  Download, ChevronDown, Search, MapPin
} from 'lucide-react';

export default function DashboardProfessor() {
  const navigate = useNavigate();

  // Estado para controlar a tela ('dashboard', 'configuracoes', 'permissoes', 'backup', 'logs', 'auditoria')
  const [telaAtual, setTelaAtual] = useState('dashboard');
  
  // Estado para controlar o perfil selecionado na tela de Permissões
  const [perfilSelecionado, setPerfilSelecionado] = useState('Administrador');

  // Estados de busca e filtro para Logs
  const [buscaLogs, setBuscaLogs] = useState('');
  const [filtroLogs, setFiltroLogs] = useState('Todos');

  // Estados de busca e filtro para Auditoria
  const [buscaAuditoria, setBuscaAuditoria] = useState('');
  const [filtroAuditoria, setFiltroAuditoria] = useState('Todos');

  // Estado para controlar o modal de confirmação de saída
  const [modalSairAberto, setModalSairAberto] = useState(false);

  // Dados dos Perfis para a tela de Permissões
  const perfis = [
    { id: 'Administrador', titulo: 'Administrador', desc: 'Acesso total ao sistema', usuarios: '3 usuários' },
    { id: 'Recepção', titulo: 'Recepção', desc: 'Atendimento e agendamento', usuarios: '6 usuários' },
    { id: 'Aluno', titulo: 'Aluno', desc: 'Atendimentos clínicos', usuarios: '54 usuários' },
    { id: 'Professor', titulo: 'Professor', desc: 'Supervisão', usuarios: '9 usuários' },
  ];

  // Mapeamento das permissões por perfil
  const permissoesPorPerfil = {
    'Administrador': [
      { modulo: 'Usuários', nivel: 'Acesso total' },
      { modulo: 'Pacientes', nivel: 'Acesso total' },
      { modulo: 'Agenda', nivel: 'Acesso total' },
      { modulo: 'Estoque', nivel: 'Acesso total' },
      { modulo: 'CME', nivel: 'Acesso total' },
      { modulo: 'Relatórios', nivel: 'Acesso total' },
    ],
    'Recepção': [
      { modulo: 'Pacientes', nivel: 'Cadastro e Edição' },
      { modulo: 'Agenda', nivel: 'Agendamento total' },
      { modulo: 'Estoque', nivel: 'Apenas leitura' },
      { modulo: 'Relatórios', nivel: 'Relatórios básicos' },
    ],
    'Aluno': [
      { modulo: 'Pacientes', nivel: 'Consulta e Prontuário' },
      { modulo: 'Agenda', nivel: 'Consulta de horários' },
      { modulo: 'Estoque', nivel: 'Solicitação de materiais' },
      { modulo: 'CME', nivel: 'Envio de kits' },
    ],
    'Professor': [
      { modulo: 'Pacientes', nivel: 'Validação e Supervisão' },
      { modulo: 'Agenda', nivel: 'Supervisão de agenda' },
      { modulo: 'Estoque', nivel: 'Aprovação de materiais' },
      { modulo: 'CME', nivel: 'Aprovação de esterilização' },
      { modulo: 'Relatórios', nivel: 'Relatórios de desempenho' },
    ]
  };

  // Dados dos Backups Disponíveis
  const backupsDisponiveis = [
    { dataHora: '13/05/2026 - 07:00', tamanho: '1,2 GB', tipo: 'Automático' },
    { dataHora: '06/05/2026 - 07:00', tamanho: '1,1 GB', tipo: 'Automático' },
    { dataHora: '30/04/2026 - 07:00', tamanho: '1,5 GB', tipo: 'Automático' },
    { dataHora: '23/04/2026 - 07:00', tamanho: '1,0 GB', tipo: 'Automático' },
  ];

  // Dados Mockados para Logs
  const dadosLogs = [
    {
      data: '20/05/2026',
      itens: [
        { usuario: 'Mariana Santos', acao: 'Login realizado com sucesso', hora: '10:45:24', cat: 'Login' },
        { usuario: 'Pietro Antunes', acao: 'Cadastro de paciente: Luísa Mattos', hora: '09:51:36', cat: 'Cadastro' },
        { usuario: 'Rafael Silva', acao: 'Alteração de agendamento', hora: '09:53:14', cat: 'Alteração' },
        { usuario: 'Juliana Mendes', acao: 'Login realizado com sucesso', hora: '09:37:59', cat: 'Login' },
        { usuario: 'Judite Guimarães', acao: 'Exclusão de agendamento ID: 13456', hora: '09:22:10', cat: 'Exclusão' },
        { usuario: 'André Marques', acao: 'Login realizado com sucesso', hora: '08:30:32', cat: 'Login' },
      ]
    },
    {
      data: '19/05/2026',
      itens: [
        { usuario: 'Jéssica Ruiz', acao: 'Login realizado com sucesso', hora: '17:37:15', cat: 'Login' },
        { usuario: 'Débora Andrade', acao: 'Alteração de dados do paciente', hora: '15:17:48', cat: 'Alteração' },
        { usuario: 'Lucas Emanoel', acao: 'Login realizado com sucesso', hora: '15:17:05', cat: 'Login' },
      ]
    }
  ];

  // Dados Mockados para Auditoria
  const dadosAuditoria = [
    {
      data: '20/05/2026',
      itens: [
        { usuario: 'Mariana Santos', acao: 'Alterou permissões do usuário Marcos Pontes\nAntes: Recepção | Depois: Administrador', hora: '11:08:24', cat: 'Permissões' },
        { usuario: 'Pietro Antunes', acao: 'Acessou dados da paciente Ana Clara Lima\nProntuário ID: 13456', hora: '11:00:07', cat: 'Dados' },
        { usuario: 'Juliana Mendes', acao: 'Criou novo agendamento\nPaciente: Bruno Pereira', hora: '10:56:34', cat: 'Dados' },
        { usuario: 'Judite Guimarães', acao: 'Tentativa de acesso negado\nMódulo: Estoque', hora: '08:47:23', cat: 'Acessos' },
      ]
    },
    {
      data: '19/05/2026',
      itens: [
        { usuario: 'Jéssica Ruiz', acao: 'Backup realizado manualmente', hora: '16:04:51', cat: 'Sistema' },
        { usuario: 'Débora Andrade', acao: 'Tentativa de acesso negado\nMódulo: CME', hora: '15:56:01', cat: 'Acessos' },
        { usuario: 'Lucas Emanoel', acao: 'Alterou dados do paciente\nPaciente: Antônio Marques', hora: '15:55:00', cat: 'Dados' },
      ]
    }
  ];

  // Função para confirmar saída e redirecionar para a rota /login real
  const handleConfirmarSaida = () => {
    setModalSairAberto(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans select-none flex justify-center items-center sm:p-4">
      {/* Container do Celular */}
      <div className="w-full max-w-[400px] h-screen sm:h-[850px] bg-[#F8F9FD] sm:rounded-[40px] flex flex-col relative overflow-hidden shadow-2xl">
        
        {/* ========================================================= */}
        {/* TELA DE LOGS                                             */}
        {/* ========================================================= */}
        {telaAtual === 'logs' ? (
          <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] animate-fade-in">
            {/* HEADER LOGS */}
            <div className="bg-[#3B44A8] pt-12 pb-10 px-6 text-white rounded-b-[28px] shadow-md shrink-0 z-10 relative">
              <div className="flex items-center justify-center relative">
                <button 
                  onClick={() => setTelaAtual('configuracoes')}
                  className="absolute left-0 p-2 hover:bg-white/10 rounded-xl transition active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-xl font-bold tracking-wide">Logs</h1>
              </div>
            </div>

            {/* CONTEÚDO LOGS */}
            <div className="flex-1 overflow-y-auto px-4 pt-5 pb-24 space-y-4 scrollbar-hide">
              <div className="relative">
                <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar logs"
                  value={buscaLogs}
                  onChange={(e) => setBuscaLogs(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] transition shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {['Todos', 'Login', 'Cadastro', 'Alteração', 'Exclusão'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroLogs(f)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
                      filtroLogs === f 
                        ? 'bg-[#3B44A8] text-white shadow-xs' 
                        : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {dadosLogs.map((grupo, gIdx) => (
                <div key={gIdx} className="space-y-2 pt-1">
                  <h3 className="text-[#3B44A8] font-bold text-xs px-1">{grupo.data}</h3>
                  <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm divide-y divide-gray-100">
                    {grupo.itens
                      .filter(item => filtroLogs === 'Todos' || item.cat === filtroLogs)
                      .filter(item => item.usuario.toLowerCase().includes(buscaLogs.toLowerCase()) || item.acao.toLowerCase().includes(buscaLogs.toLowerCase()))
                      .map((item, idx) => (
                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-[#3B44A8]">{item.usuario}</h4>
                            <p className="text-[10px] text-gray-500 font-medium leading-tight">{item.acao}</p>
                          </div>
                          <span className="text-[9px] text-gray-400 font-semibold shrink-0 pt-0.5">{item.hora}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : telaAtual === 'auditoria' ? (

          /* ========================================================= */
          /* TELA DE AUDITORIA                                         */
          /* ========================================================= */
          <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] animate-fade-in">
            <div className="bg-[#3B44A8] pt-12 pb-10 px-6 text-white rounded-b-[28px] shadow-md shrink-0 z-10 relative">
              <div className="flex items-center justify-center relative">
                <button 
                  onClick={() => setTelaAtual('configuracoes')}
                  className="absolute left-0 p-2 hover:bg-white/10 rounded-xl transition active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-xl font-bold tracking-wide">Auditoria</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-5 pb-24 space-y-4 scrollbar-hide">
              <div className="relative">
                <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar logs"
                  value={buscaAuditoria}
                  onChange={(e) => setBuscaAuditoria(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] transition shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {['Todos', 'Dados', 'Permissões', 'Acessos', 'Sistema'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroAuditoria(f)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition whitespace-nowrap ${
                      filtroAuditoria === f 
                        ? 'bg-[#3B44A8] text-white shadow-xs' 
                        : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {dadosAuditoria.map((grupo, gIdx) => (
                <div key={gIdx} className="space-y-2 pt-1">
                  <h3 className="text-[#3B44A8] font-bold text-xs px-1">{grupo.data}</h3>
                  <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm divide-y divide-gray-100">
                    {grupo.itens
                      .filter(item => filtroAuditoria === 'Todos' || item.cat === filtroAuditoria)
                      .filter(item => item.usuario.toLowerCase().includes(buscaAuditoria.toLowerCase()) || item.acao.toLowerCase().includes(buscaAuditoria.toLowerCase()))
                      .map((item, idx) => (
                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-bold text-[#3B44A8]">{item.usuario}</h4>
                            <p className="text-[10px] text-gray-500 font-medium leading-tight whitespace-pre-line">{item.acao}</p>
                          </div>
                          <span className="text-[9px] text-gray-400 font-semibold shrink-0 pt-0.5">{item.hora}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : telaAtual === 'backup' ? (

          /* ========================================================= */
          /* TELA DE BACKUP                                            */
          /* ========================================================= */
          <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] animate-fade-in">
            <div className="bg-[#3B44A8] pt-12 pb-10 px-6 text-white rounded-b-[28px] shadow-md shrink-0 z-10 relative">
              <div className="flex items-center justify-center relative">
                <button 
                  onClick={() => setTelaAtual('configuracoes')}
                  className="absolute left-0 p-2 hover:bg-white/10 rounded-xl transition active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-xl font-bold tracking-wide">Backup</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-5 scrollbar-hide">
              <div className="bg-white border border-gray-100 rounded-3xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900">Próximo backup automático</h4>
                  <p className="text-xs font-bold text-[#3B44A8]">27/05/2026 às 07:00</p>
                </div>
                <div className="p-4 space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900">Último backup realizado</h4>
                  <p className="text-xs font-bold text-[#3B44A8]">20/05/2026 às 07:00</p>
                </div>
              </div>

              <button className="w-full bg-[#F59E0B] hover:bg-amber-600 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition">
                <CloudDownload size={22} />
                <span>Realizar backup agora</span>
              </button>

              <div className="space-y-2.5">
                <h3 className="text-[#3B44A8] font-bold text-sm px-1">Backups disponíveis</h3>
                <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm divide-y divide-gray-100">
                  {backupsDisponiveis.map((b, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-500 text-[11px]">{b.dataHora}</span>
                      <span className="font-semibold text-gray-500 text-[11px]">{b.tamanho}</span>
                      <span className="font-semibold text-gray-500 text-[11px]">{b.tipo}</span>
                      <button className="text-[#3B44A8] hover:text-indigo-800 transition active:scale-90 p-1">
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[#3B44A8] font-bold text-sm px-1">Configurações de backup</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#3B44A8] px-1">Frequência</label>
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between shadow-xs cursor-pointer">
                      <span className="text-xs font-bold text-[#3B44A8]">Semanal</span>
                      <ChevronDown size={18} className="text-[#3B44A8]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#3B44A8] px-1">Horário</label>
                    <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between shadow-xs cursor-pointer">
                      <span className="text-xs font-bold text-[#3B44A8]">07:00</span>
                      <ChevronDown size={18} className="text-[#3B44A8]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-[#3B44A8] px-1">Manter backups por</label>
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between shadow-xs cursor-pointer">
                    <span className="text-xs font-bold text-[#3B44A8]">60 dias</span>
                    <ChevronDown size={18} className="text-[#3B44A8]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : telaAtual === 'permissoes' ? (

          /* ========================================================= */
          /* TELA DE PERMISSÕES                                        */
          /* ========================================================= */
          <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] animate-fade-in">
            <div className="bg-[#3B44A8] pt-12 pb-10 px-6 text-white rounded-b-[28px] shadow-md shrink-0 z-10 relative">
              <div className="flex items-center justify-center relative">
                <button 
                  onClick={() => setTelaAtual('configuracoes')}
                  className="absolute left-0 p-2 hover:bg-white/10 rounded-xl transition active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-xl font-bold tracking-wide">Permissões</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6 scrollbar-hide">
              <div className="bg-white border border-gray-100 rounded-3xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                {perfis.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setPerfilSelecionado(item.id)}
                    className={`w-full p-4 flex items-center justify-between transition text-left active:bg-gray-100 ${
                      perfilSelecionado === item.id ? 'bg-indigo-50/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#3B44A8]">{item.titulo}</h4>
                      <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#3B44A8]/10 text-[#3B44A8] text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                        {item.usuarios}
                      </span>
                      <ChevronRight size={18} className="text-[#3B44A8]" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[#3B44A8] font-black text-xs">
                    Permissões do perfil selecionado
                  </h3>
                  <span className="bg-[#3B44A8]/10 text-[#3B44A8] text-[10px] font-bold px-3 py-1 rounded-full">
                    {perfilSelecionado}
                  </span>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
                  {permissoesPorPerfil[perfilSelecionado]?.map((perm, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-[#3B44A8] leading-tight">{perm.modulo}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{perm.nivel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : telaAtual === 'configuracoes' ? (

          /* ========================================================= */
          /* TELA DE CONFIGURAÇÕES                                     */
          /* ========================================================= */
          <div className="flex-1 flex flex-col h-full bg-[#F8F9FD] animate-fade-in">
            <div className="bg-[#3B44A8] pt-12 pb-10 px-6 text-white rounded-b-[28px] shadow-md shrink-0 z-10 relative">
              <div className="flex items-center justify-center relative">
                <button 
                  onClick={() => setTelaAtual('dashboard')}
                  className="absolute left-0 p-2 hover:bg-white/10 rounded-xl transition active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="text-xl font-bold tracking-wide">Configurações</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 space-y-6 scrollbar-hide">
              <div className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50 text-gray-700 shrink-0">
                  <User size={30} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">Kauan Ferreira</h3>
                  <p className="text-xs font-semibold text-gray-500">Administrador / Professor</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[#3B44A8] font-black text-sm px-1">Configurações do sistema</h3>

                <div className="bg-white border border-gray-100 rounded-3xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                  <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left active:bg-gray-100">
                    <div className="flex items-center gap-3.5">
                      <div className="text-[#3B44A8]"><Users size={24} /></div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Usuários</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Gerenciar usuários do sistema</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8]" />
                  </button>

                  <button 
                    onClick={() => setTelaAtual('permissoes')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left active:bg-gray-100"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-[#3B44A8]"><ShieldCheck size={24} /></div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Permissões</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Gerenciar permissões</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8]" />
                  </button>

                  <button 
                    onClick={() => setTelaAtual('backup')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left active:bg-gray-100"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-[#3B44A8]"><CloudDownload size={24} /></div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Backup</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Configurar e restaurar backups</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8]" />
                  </button>

                  <button 
                    onClick={() => setTelaAtual('logs')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left active:bg-gray-100"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-[#3B44A8]"><FileText size={24} /></div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Logs</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Verificar logs do sistema</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8]" />
                  </button>

                  <button 
                    onClick={() => setTelaAtual('auditoria')}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left active:bg-gray-100"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="text-[#3B44A8]"><FileSearch size={24} /></div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Auditoria</h4>
                        <p className="text-[10px] text-gray-400 font-medium">Histórico de auditoria e acessos</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8]" />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setModalSairAberto(true)}
                className="w-full bg-[#F59E0B] hover:bg-amber-600 active:scale-[0.98] text-white py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition"
              >
                <LogOut size={18} />
                <span>Sair do sistema</span>
              </button>
            </div>
          </div>
        ) : (
          
          /* ========================================================= */
          /* TELA DA DASHBOARD PRINCIPAL (FIEL À IMAGEM)               */
          /* ========================================================= */
          <div className="flex-1 flex flex-col h-full animate-fade-in bg-[#3B44A8]">
            {/* HEADER AZUL COM ÍCONES */}
            <div className="pt-8 pb-6 px-6 text-white shrink-0 z-10">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setTelaAtual('configuracoes')} 
                  className="p-1.5 hover:bg-white/10 rounded-xl transition active:scale-95"
                >
                  <Settings size={24} />
                </button>
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                  <span className="text-[11px] text-amber-400 font-semibold tracking-wide block -mt-0.5">Professor</span>
                </div>
                <button className="p-1.5 hover:bg-white/10 rounded-xl transition active:scale-95">
                  <Bell size={24} />
                </button>
              </div>
            </div>

            {/* CONTAINER BRANCO ARREDONDADO */}
            <div className="flex-1 bg-[#F8F9FD] rounded-t-[36px] overflow-y-auto px-4 pt-6 pb-28 space-y-5 scrollbar-hide">
              
              {/* SAUDAÇÃO E DATA */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">Olá, Prof. Kauan</h2>
                  <p className="text-xs text-gray-500 font-semibold">Bem-vindo de volta!</p>
                </div>

                {/* CARD DE DATA */}
                <div className="bg-white border border-gray-200/70 rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
                  <span className="text-xs font-bold text-[#3B44A8]">Hoje, 25 de Maio de 2026</span>
                  <div className="p-1 text-[#3B44A8]">
                    <Calendar size={18} />
                  </div>
                </div>
              </div>

              {/* GRID DE MÉTRICAS (4 CARDS) */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white p-2.5 rounded-2xl border border-gray-200/70 shadow-xs text-center flex flex-col justify-between h-[90px]">
                  <p className="text-[9px] font-bold text-gray-800 leading-tight">Consultas do dia</p>
                  <span className="text-2xl font-black text-[#3B44A8]">16</span>
                  <p className="text-[8px] font-medium text-gray-400">Confirmadas</p>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-gray-200/70 shadow-xs text-center flex flex-col justify-between h-[90px]">
                  <p className="text-[9px] font-bold text-gray-800 leading-tight">Cirurgias do dia</p>
                  <span className="text-2xl font-black text-[#3B44A8]">5</span>
                  <p className="text-[8px] font-medium text-gray-400">Confirmadas</p>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-gray-200/70 shadow-xs text-center flex flex-col justify-between h-[90px]">
                  <p className="text-[9px] font-bold text-gray-800 leading-tight">Estoque crítico</p>
                  <span className="text-2xl font-black text-[#3B44A8]">8</span>
                  <p className="text-[8px] font-medium text-gray-400">Itens em alerta</p>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-gray-200/70 shadow-xs text-center flex flex-col justify-between h-[90px]">
                  <p className="text-[9px] font-bold text-gray-800 leading-tight">CME Pendente</p>
                  <span className="text-2xl font-black text-[#3B44A8]">5</span>
                  <p className="text-[8px] font-medium text-gray-400">Processos</p>
                </div>
              </div>

              {/* SEÇÃO MUTIRÃO CIRÚRGICO */}
              <div className="space-y-1.5 pt-1">
                <h3 className="text-[#3B44A8] font-bold text-xs">Mutirão Cirúrgico</h3>
                <div className="bg-white border border-gray-200/70 rounded-2xl p-4 h-12 shadow-xs flex items-center justify-between">
                </div>
              </div>

              {/* GRÁFICO ATENDIMENTOS DA SEMANA */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <h3 className="text-[#3B44A8] font-bold text-sm">Atendimentos da semana</h3>
                  <span className="text-[9px] text-[#3B44A8] font-medium hover:underline cursor-pointer">Ver relatórios</span>
                </div>

                {/* LEGENDAS */}
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 bg-[#3B44A8] rounded-full"></span>
                    <span className="text-gray-700">Consultas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 bg-emerald-500 rounded-full"></span>
                    <span className="text-gray-700">Cirurgias</span>
                  </div>
                </div>

                {/* VISUALIZAÇÃO DO GRÁFICO COM SVG */}
                <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-xs">
                  <div className="relative h-40 w-full flex flex-col justify-between">
                    {/* Linhas de grade e valores */}
                    <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-300 pointer-events-none">
                      <div className="border-b border-gray-100 pb-0.5">50</div>
                      <div className="border-b border-gray-100 pb-0.5">40</div>
                      <div className="border-b border-gray-100 pb-0.5">30</div>
                      <div className="border-b border-gray-100 pb-0.5">20</div>
                      <div className="border-b border-gray-100 pb-0.5">10</div>
                      <div>0</div>
                    </div>

                    {/* SVG do Gráfico de Linha */}
                    <svg className="absolute inset-0 w-full h-32 pt-2 overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      {/* Gradientes */}
                      <defs>
                        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3B44A8" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3B44A8" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Área Azul */}
                      <path d="M 10,60 L 50,52 L 90,28 L 130,50 L 170,32 L 210,34 L 250,12 L 290,38 L 290,100 L 10,100 Z" fill="url(#gradBlue)" />
                      {/* Linha Azul */}
                      <path d="M 10,60 L 50,52 L 90,28 L 130,50 L 170,32 L 210,34 L 250,12 L 290,38" fill="none" stroke="#3B44A8" strokeWidth="2.5" />
                      {/* Pontos Azuis */}
                      {[
                        [10,60], [50,52], [90,28], [130,50], [170,32], [210,34], [250,12], [290,38]
                      ].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#3B44A8" />
                      ))}

                      {/* Área Verde */}
                      <path d="M 10,82 L 50,70 L 90,58 L 130,66 L 170,52 L 210,50 L 250,42 L 290,48 L 290,100 L 10,100 Z" fill="url(#gradGreen)" />
                      {/* Linha Verde */}
                      <path d="M 10,82 L 50,70 L 90,58 L 130,66 L 170,52 L 210,50 L 250,42 L 290,48" fill="none" stroke="#10B981" strokeWidth="2.5" />
                      {/* Pontos Verdes */}
                      {[
                        [10,82], [50,70], [90,58], [130,66], [170,52], [210,50], [250,42], [290,48]
                      ].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#10B981" />
                      ))}
                    </svg>

                    {/* Dias da semana */}
                    <div className="absolute bottom-0 inset-x-0 flex justify-between text-[10px] text-gray-500 font-semibold px-1 pt-2">
                      <span>Seg</span>
                      <span>Ter</span>
                      <span>Qua</span>
                      <span>Qui</span>
                      <span>Sex</span>
                      <span>Sáb</span>
                      <span>Dom</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO PRÓXIMOS ATENDIMENTOS */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <h3 className="text-[#3B44A8] font-bold text-sm">Próximos atendimentos</h3>
                  <span className="text-[9px] text-[#3B44A8] font-medium hover:underline cursor-pointer">Ver agenda</span>
                </div>

                <div className="bg-white border border-gray-200/70 rounded-2xl divide-y divide-gray-100 shadow-xs overflow-hidden">
                  {/* Item 1 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600">08:30</span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">Kauan Ferreira</h4>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">Clareamento Dental</p>
                        <span className="text-[9px] text-gray-400 block font-medium">Dentística</span>
                      </div>
                    </div>
                    <span className="bg-[#3B44A8]/15 text-[#3B44A8] text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      Centro Cirúrgico
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600">08:50</span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">Nome do paciente</h4>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">Restauração</p>
                        <span className="text-[9px] text-gray-400 block font-medium">Dentística</span>
                      </div>
                    </div>
                    <span className="bg-[#3B44A8]/15 text-[#3B44A8] text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      Consultório 03
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600">09:00</span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">Nome do paciente</h4>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">Procedimento</p>
                        <span className="text-[9px] text-gray-400 block font-medium">Periodontia</span>
                      </div>
                    </div>
                    <span className="bg-[#3B44A8]/15 text-[#3B44A8] text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      Consultório 05
                    </span>
                  </div>

                  {/* Item 4 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600">10:00</span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">Nome do paciente</h4>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">Procedimento</p>
                        <span className="text-[9px] text-gray-400 block font-medium">Cirurgia Bucal</span>
                      </div>
                    </div>
                    <span className="bg-[#3B44A8]/15 text-[#3B44A8] text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      Consultório 03
                    </span>
                  </div>
                </div>
              </div>

              {/* SEÇÃO CIRURGIAS DE HOJE */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between px-0.5">
                  <h3 className="text-[#3B44A8] font-bold text-sm">Cirurgias de hoje</h3>
                  <span className="text-[9px] text-[#3B44A8] font-medium hover:underline cursor-pointer">Ver agenda</span>
                </div>

                <div className="bg-white border border-gray-200/70 rounded-2xl divide-y divide-gray-100 shadow-xs overflow-hidden">
                  {/* Cirurgia 1 */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600 shrink-0">08:30</span>
                      <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 shrink-0">
                        <User size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">Kauan Ferreira</h4>
                        <p className="text-xs font-bold text-[#3B44A8] leading-tight">Exodontia - 36</p>
                        <p className="text-[10px] text-gray-500 font-medium">Prof: Dr. Carlos Eduardo</p>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium mt-0.5">
                          <MapPin size={10} className="text-[#3B44A8]" />
                          <span>Centro Cirúrgico</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8] shrink-0" />
                  </div>

                  {/* Cirurgia 2 */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-600 shrink-0">15:30</span>
                      <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 shrink-0">
                        <User size={22} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 leading-tight">Nome do paciente</h4>
                        <p className="text-xs font-bold text-[#3B44A8] leading-tight">Extração de siso</p>
                        <p className="text-[10px] text-gray-500 font-medium">Prof: Dra. Ana Maria</p>
                        <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium mt-0.5">
                          <MapPin size={10} className="text-[#3B44A8]" />
                          <span>Centro Cirúrgico</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#3B44A8] shrink-0" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* NAVEGAÇÃO INFERIOR FIXA COM 6 ÍCONES */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#3B44A8] px-2 py-2.5 flex items-center justify-around z-20 text-white">
          <button 
            onClick={() => setTelaAtual('dashboard')} 
            className="flex flex-col items-center gap-0.5 active:scale-90 transition"
          >
            <div className="p-1.5 rounded-lg bg-[#F59E0B] text-white">
              <Home size={18} />
            </div>
            <span className="text-[9px] font-bold text-[#F59E0B]">Home</span>
          </button>

          <button 
            onClick={() => setTelaAtual('dashboard')} 
            className="flex flex-col items-center gap-0.5 active:scale-90 transition opacity-80 hover:opacity-100"
          >
            <div className="p-1">
              <Calendar size={20} />
            </div>
            <span className="text-[9px] font-medium">Agenda</span>
          </button>

          <button 
            onClick={() => setTelaAtual('dashboard')} 
            className="flex flex-col items-center gap-0.5 active:scale-90 transition opacity-80 hover:opacity-100"
          >
            <div className="p-1">
              <Stethoscope size={20} />
            </div>
            <span className="text-[9px] font-medium">Cirurgias</span>
          </button>

          <button 
            onClick={() => setTelaAtual('dashboard')} 
            className="flex flex-col items-center gap-0.5 active:scale-90 transition opacity-80 hover:opacity-100"
          >
            <div className="p-1">
              <Users size={20} />
            </div>
            <span className="text-[9px] font-medium">Pacientes</span>
          </button>

          <button 
            onClick={() => setTelaAtual('dashboard')} 
            className="flex flex-col items-center gap-0.5 active:scale-90 transition opacity-80 hover:opacity-100"
          >
            <div className="p-1">
              <PackageCheck size={20} />
            </div>
            <span className="text-[9px] font-medium">CME</span>
          </button>

          <button 
            onClick={() => setTelaAtual('dashboard')} 
            className="flex flex-col items-center gap-0.5 active:scale-90 transition opacity-80 hover:opacity-100"
          >
            <div className="p-1">
              <Box size={20} />
            </div>
            <span className="text-[9px] font-medium">Estoque</span>
          </button>
        </div>

        {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
        {modalSairAberto && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                <LogOut size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">Sair da Conta?</h3>
                <p className="text-xs text-gray-500 font-medium">Tem certeza que deseja encerrar a sua sessão?</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => setModalSairAberto(false)}
                  className="py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirmarSaida}
                  className="py-2.5 bg-[#F59E0B] text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}