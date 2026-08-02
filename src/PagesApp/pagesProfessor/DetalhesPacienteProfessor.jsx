import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  SquarePen,
  ChevronRight,
  User,
  Search,
  MoreVertical,
  Upload,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export default function DetalhesPacienteProfessor() {
  const navigate = useNavigate();
  
  // Controle da Tela de Evolução (true = mostra tela de Evolução, false = mostra tela padrão com abas)
  const [modoEvolucao, setModoEvolucao] = useState(false);

  // Controle de Abas Principais: 'resumo' | 'historico' | 'documentos'
  const [abaAtiva, setAbaAtiva] = useState('resumo');
  
  // Controle de Filtros do Histórico
  const [filtroHistorico, setFiltroHistorico] = useState('todos');

  // Controle de Filtros e Busca de Documentos
  const [filtroDoc, setFiltroDoc] = useState('todos');
  const [buscaDoc, setBuscaDoc] = useState('');
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  // Dados Mockados do Paciente
  const [paciente] = useState({
    nomeHeader: 'Rhaya Borges',
    cpfHeader: '012.123.456-89',
    status: 'Ativo', // 'Ativo' ou 'Inativo'
    
    // Resumo
    nomeCompleto: 'Rhaya Borges',
    telefone: '(42) 99999-9999',
    email: 'engs-rhayannatonete@camporeal.edu.br',
    dataNascimento: '14/02/2005',
    endereco: {
      rua: 'Rua Diogo Emanoel de Almeida, 200',
      bairro: 'Centro',
      cidadeEstado: 'Guamiranga - PR'
    },
    responsavel: {
      nome: 'Nome do responsável',
      telefone: '(42) 88888-8888'
    },
    ultimoAtendimento: {
      data: '18/05/2026',
      procedimento: 'Instalação de Aparelho Fixo',
      especialidade: 'Ortodontia',
      professor: 'Prof. Dr. Michel Barros',
      aluno: 'Isabela Lima'
    },

    // Histórico
    historico: [
      {
        id: 1,
        data: '18/05/2026',
        procedimento: 'Instalação de Aparelho Fixo',
        especialidade: 'Ortodontia',
        professor: 'Prof. Dr. Michel Barros',
        aluno: 'Isabela Lima',
        categoria: 'consultas'
      },
      {
        id: 2,
        data: '01/07/2024',
        procedimento: 'Tratamento de Canal',
        especialidade: 'Endodontia',
        professor: 'Profª. Dra. Cláudia Silva',
        aluno: 'Iara Magalhães',
        categoria: 'consultas'
      },
      {
        id: 3,
        data: '25/06/2024',
        procedimento: 'Extração de Siso',
        especialidade: 'Cirurgia Bucal',
        professor: 'Profª. Dra. Cláudia Silva',
        aluno: 'Pedro Pereira',
        categoria: 'cirurgias'
      }
    ],

    // Evolução
    evolucao: {
      ultimoAtendimento: '18/05/2026',
      totalAtendimentos: 3,
      linhaDoTempo: [
        {
          id: 1,
          dataTipo: '18/05/2026 - Cirurgia',
          professor: 'Prof: Dra. Luzia Maria',
          aluno: 'Aluno: Douglas Henrique',
          rotulo: 'Procedimento:',
          descricao: 'Restauração do dente inferior direito.'
        },
        {
          id: 2,
          dataTipo: '15/05/2026 - Procedimento',
          professor: 'Prof: Dr. Mário Luiz',
          aluno: 'Aluno: Ana Maria',
          rotulo: 'Procedimento:',
          descricao: 'Radiografia do elemento 26.'
        },
        {
          id: 3,
          dataTipo: '12/05/2026 - Avaliação',
          professor: 'Prof: Dr. Sérgio Amaral',
          aluno: 'Aluno: Olívia Santos',
          rotulo: 'Queixa principal:',
          descricao: 'Dor no dente inferior direito.'
        }
      ]
    },

    // Documentos
    documentos: [
      {
        id: 1,
        titulo: 'Radiografia Periapical',
        subtitulo: 'Elemento 46',
        data: '18/05/2025',
        formato: 'JPG',
        tamanho: '1.2 MB',
        categoria: 'radiografias'
      },
      {
        id: 2,
        titulo: 'Exame Clínico',
        subtitulo: 'Exame Clínico Inicial',
        data: '01/07/2024',
        formato: 'PDF',
        tamanho: '180 KB',
        categoria: 'exames'
      }
    ]
  });

  // Filtragem do Histórico
  const historicoFiltrado = paciente.historico.filter((item) => {
    if (filtroHistorico === 'todos') return true;
    return item.categoria === filtroHistorico;
  });

  // Filtragem dos Documentos
  const documentosFiltrados = paciente.documentos.filter((doc) => {
    const atendeCategoria = filtroDoc === 'todos' || doc.categoria === filtroDoc;
    const atendeBusca = doc.titulo.toLowerCase().includes(buscaDoc.toLowerCase()) || 
                         doc.subtitulo.toLowerCase().includes(buscaDoc.toLowerCase());
    return atendeCategoria && atendeBusca;
  });

  // Título do Header dinâmico
  const getHeaderTitle = () => {
    if (modoEvolucao) return 'Evolução do paciente';
    if (abaAtiva === 'historico') return 'Histórico do paciente';
    if (abaAtiva === 'documentos') return 'Documentos do paciente';
    return 'Detalhe do paciente';
  };

  // Botão Voltar do Header
  const handleVoltar = () => {
    if (modoEvolucao) {
      setModoEvolucao(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div 
      className="w-full h-screen bg-[#3B42B2] text-white flex flex-col font-sans m-0 p-0 overflow-hidden relative"
      onClick={() => setMenuAbertoId(null)}
    >
      
      {/* TOPO / HEADER */}
      <div className="pt-8 pb-4 px-4 flex items-center justify-between shrink-0">
        <button
          onClick={handleVoltar}
          className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-lg font-semibold tracking-wide text-center flex-1">
          {getHeaderTitle()}
        </h1>

        {!modoEvolucao ? (
          <button 
            className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
            aria-label="Editar"
          >
            <SquarePen className="w-5 h-5 text-white" />
          </button>
        ) : (
          <div className="w-9" /> // Espaçador para centralizar o título
        )}
      </div>

      {/* PAINEL BRANCO ARREDONDADO COM SCROLL INTERNO */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-5 pb-32 flex-1 overflow-y-auto flex flex-col space-y-4 shadow-inner relative">
        
        {/* ================= TELA 1: MODO EVOLUÇÃO ================= */}
        {modoEvolucao ? (
          <div className="flex-1 flex flex-col space-y-5">
            {/* CABEÇALHO PACIENTE (SEM BADGE) */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 bg-slate-50">
                <User className="w-7 h-7 text-slate-900" />
              </div>

              <div>
                <h2 className="font-extrabold text-slate-900 text-base leading-tight">
                  {paciente.nomeHeader}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {paciente.cpfHeader}
                </p>
              </div>
            </div>

            {/* CARDS KPIS: ÚLTIMO ATENDIMENTO E REALIZADOS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-2xl p-3.5 text-center bg-white shadow-xs">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Último atendimento
                </span>
                <span className="text-[#3B42B2] font-extrabold text-sm block mt-1">
                  {paciente.evolucao.ultimoAtendimento}
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl p-3.5 text-center bg-white shadow-xs">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Atendimentos realizados
                </span>
                <span className="text-[#3B42B2] font-extrabold text-base block mt-1">
                  {paciente.evolucao.totalAtendimentos}
                </span>
              </div>
            </div>

            {/* LINHA DO TEMPO DA EVOLUÇÃO */}
            <div className="pt-2">
              <h3 className="text-[#3B42B2] font-extrabold text-sm mb-4">
                Linha do tempo da evolução
              </h3>

              <div className="relative pl-6 space-y-4">
                {/* Linha vertical contínua */}
                <div className="absolute left-[7px] top-3 bottom-6 w-[2px] bg-[#3B42B2]" />

                {paciente.evolucao.linhaDoTempo.map((item) => (
                  <div key={item.id} className="relative">
                    {/* Marcador em círculo na linha */}
                    <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3B42B2] z-10" />

                    {/* Card de Atendimento */}
                    <div className="border border-slate-200 rounded-2xl p-3.5 bg-white shadow-xs space-y-1">
                      <h4 className="text-[#3B42B2] font-extrabold text-xs">
                        {item.dataTipo}
                      </h4>

                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.professor} • {item.aluno}
                      </p>

                      <div className="pt-1.5 text-xs">
                        <span className="text-[#3B42B2] font-bold block text-[11px]">
                          {item.rotulo}
                        </span>
                        <p className="text-slate-500 font-medium text-[11px]">
                          {item.descricao}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ================= TELA 2: VISUALIZAÇÃO PADRÃO (RESUMO, HISTÓRICO, DOCUMENTOS) ================= */
          <>
            {/* CABEÇALHO DO PACIENTE */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 bg-slate-50">
                  <User className="w-7 h-7 text-slate-900" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-extrabold text-slate-900 text-base leading-tight truncate">
                    {paciente.nomeHeader}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {paciente.cpfHeader}
                  </p>
                </div>
              </div>

              <span className={`px-3.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                paciente.status === 'Ativo'
                  ? 'bg-[#BCE3C5] text-[#2D7A42]'
                  : 'bg-[#F9C8C8] text-[#B93838]'
              }`}>
                {paciente.status}
              </span>
            </div>

            {/* ABAS DE NAVEGAÇÃO PRINCIPAL */}
            <div className="flex items-center justify-around border-b border-slate-200 pb-2 shrink-0">
              <button
                onClick={() => setAbaAtiva('resumo')}
                className={`text-xs font-bold pb-2 relative transition cursor-pointer ${
                  abaAtiva === 'resumo' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Resumo
                {abaAtiva === 'resumo' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#F59E0B] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setAbaAtiva('historico')}
                className={`text-xs font-bold pb-2 relative transition cursor-pointer ${
                  abaAtiva === 'historico' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Histórico
                {abaAtiva === 'historico' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#F59E0B] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setAbaAtiva('documentos')}
                className={`text-xs font-bold pb-2 relative transition cursor-pointer ${
                  abaAtiva === 'documentos' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Documentos
                {abaAtiva === 'documentos' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#F59E0B] rounded-full" />
                )}
              </button>
            </div>

            {/* ================= ABA 1: RESUMO ================= */}
            {abaAtiva === 'resumo' && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white shadow-xs">
                  <h3 className="text-[#3B42B2] font-extrabold text-sm">Informações pessoais</h3>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="block font-bold text-slate-900">Nome completo</span>
                      <span className="text-slate-500 font-medium">{paciente.nomeCompleto}</span>
                    </div>

                    <div>
                      <span className="block font-bold text-slate-900">Telefone</span>
                      <span className="text-slate-500 font-medium">{paciente.telefone}</span>
                    </div>

                    <div>
                      <span className="block font-bold text-slate-900">E-mail</span>
                      <span className="text-slate-500 font-medium">{paciente.email}</span>
                    </div>

                    <div>
                      <span className="block font-bold text-slate-900">Data de nascimento</span>
                      <span className="text-slate-500 font-medium">{paciente.dataNascimento}</span>
                    </div>

                    <div>
                      <span className="block font-bold text-slate-900">Endereço</span>
                      <div className="text-slate-500 font-medium leading-tight">
                        <p>{paciente.endereco.rua}</p>
                        <p>{paciente.endereco.bairro}</p>
                        <p>{paciente.endereco.cidadeEstado}</p>
                      </div>
                    </div>

                    <div>
                      <span className="block font-bold text-slate-900">Responsável</span>
                      <div className="text-slate-500 font-medium leading-tight">
                        <p>{paciente.responsavel.nome}</p>
                        <p>{paciente.responsavel.telefone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="p-4 space-y-2">
                    <h3 className="text-[#3B42B2] font-extrabold text-sm">Últimos atendimentos</h3>

                    <div className="flex items-center justify-between pt-1 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-[#3B42B2] font-black text-xs block">
                          {paciente.ultimoAtendimento.data}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs">
                          {paciente.ultimoAtendimento.procedimento}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {paciente.ultimoAtendimento.especialidade}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                          {paciente.ultimoAtendimento.professor} • Aluna: {paciente.ultimoAtendimento.aluno}
                        </p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-[#3B42B2] shrink-0" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setAbaAtiva('historico')}
                    className="w-full py-3 border-t border-slate-100 text-[#3B42B2] font-extrabold text-xs text-center hover:bg-slate-50 transition cursor-pointer"
                  >
                    Ver histórico completo
                  </button>
                </div>
              </div>
            )}

            {/* ================= ABA 2: HISTÓRICO ================= */}
            {abaAtiva === 'historico' && (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
                  {['todos', 'consultas', 'cirurgias', 'exames'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFiltroHistorico(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition cursor-pointer shrink-0 ${
                        filtroHistorico === cat
                          ? 'bg-[#3B42B2] text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {cat === 'todos' ? 'Todos' : cat}
                    </button>
                  ))}
                </div>

                <div className="flex-1">
                  {historicoFiltrado.length > 0 ? (
                    <div className="border border-slate-200 rounded-2xl bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
                      {historicoFiltrado.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[#3B42B2] font-black text-xs block">
                              {item.data}
                            </span>
                            <h4 className="font-bold text-slate-900 text-xs">
                              {item.procedimento}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {item.especialidade}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                              {item.professor} • {item.aluno.includes('Alun') ? item.aluno : `Aluno: ${item.aluno}`}
                            </p>
                          </div>

                          <ChevronRight className="w-5 h-5 text-[#3B42B2] shrink-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <p className="font-bold text-xs">Nenhum atendimento nesta categoria</p>
                    </div>
                  )}
                </div>

                {/* BOTÕES DE AÇÃO INFERIORES */}
                <div className="grid grid-cols-2 gap-3 pt-2 shrink-0">
                  <button 
                    onClick={() => setModoEvolucao(true)}
                    className="w-full py-3 px-2 border-2 border-[#3B42B2] text-[#3B42B2] font-extrabold text-xs rounded-2xl hover:bg-indigo-50 transition cursor-pointer flex items-center justify-center active:scale-95"
                  >
                    Ver evolução
                  </button>

                  <button className="w-full py-3 px-2 bg-[#F59E0B] hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-95">
                    + Adicionar atendimento
                  </button>
                </div>
              </div>
            )}

            {/* ================= ABA 3: DOCUMENTOS ================= */}
            {abaAtiva === 'documentos' && (
              <div className="flex-1 flex flex-col space-y-4 relative min-h-[350px]">
                
                {/* BUSCA DE DOCUMENTO */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">Documentos</h3>

                  <div className="relative flex-1 max-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar documento"
                      value={buscaDoc}
                      onChange={(e) => setBuscaDoc(e.target.value)}
                      className="w-full bg-slate-100/80 border border-slate-200 rounded-full py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#3B42B2]"
                    />
                  </div>
                </div>

                {/* FILTROS DE DOCUMENTOS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'exames', label: 'Exames' },
                    { id: 'radiografias', label: 'Radiografias' },
                    { id: 'formularios', label: 'Formulários' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFiltroDoc(f.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 ${
                        filtroDoc === f.id
                          ? 'bg-[#3B42B2] text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* LISTA DE DOCUMENTOS */}
                <div className="space-y-3 flex-1 pb-16">
                  {documentosFiltrados.length > 0 ? (
                    documentosFiltrados.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-slate-200 rounded-2xl p-3.5 bg-white shadow-xs flex items-center justify-between relative"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                            {doc.formato === 'JPG' ? (
                              <ImageIcon className="w-5 h-5 text-[#3B42B2]" />
                            ) : (
                              <FileText className="w-5 h-5 text-[#3B42B2]" />
                            )}
                            <span className="text-[9px] font-black text-[#3B42B2] mt-0.5 leading-none">
                              {doc.formato}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-slate-900 text-xs">
                              {doc.titulo}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {doc.subtitulo}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {doc.data}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">
                              {doc.formato}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {doc.tamanho}
                            </span>
                          </div>

                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAbertoId(menuAbertoId === doc.id ? null : doc.id);
                              }}
                              className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer"
                            >
                              <MoreVertical className="w-5 h-5 text-slate-600" />
                            </button>

                            {menuAbertoId === doc.id && (
                              <div 
                                className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => setMenuAbertoId(null)}
                                  className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  Baixar documento
                                </button>
                                <button
                                  onClick={() => setMenuAbertoId(null)}
                                  className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  Ver documento
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <p className="font-bold text-xs">Nenhum documento encontrado</p>
                    </div>
                  )}
                </div>

                {/* BOTÃO FLUTUANTE (FAB) - ENVIAR (ABSOLUTE DENTRO DO CARD) */}
                <div className="absolute bottom-4 right-2 z-10">
                  <button className="w-14 h-14 bg-[#F59E0B] hover:bg-amber-600 text-white rounded-full shadow-lg flex flex-col items-center justify-center transition transform active:scale-95 cursor-pointer">
                    <Upload className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[9px] font-bold mt-0.5">Enviar</span>
                  </button>
                </div>

              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}