import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ================= IMPORTS PÚBLICOS =================
import Login from './Login';
import RecuperarSenha from './RecuperarSenha';

// ================= IMPORTS DO ALUNO (MOBILE) =================
import LayoutAluno from './PagesApp/pagesAlunos/LayoutAluno';
import DashboardAluno from './PagesApp/pagesAlunos/DashboardAluno';
import ListaCirurgias from './PagesApp/pagesAlunos/ListaCirurgias';
import DetalhesCirurgia from './PagesApp/pagesAlunos/DetalhesCirurgia';
import EstoqueAluno from './PagesApp/pagesAlunos/EstoqueAluno'; 
import CadastrarMaterial from './PagesApp/pagesAlunos/CadastrarMaterial';
import LeitorScanner from './PagesApp/pagesAlunos/LeitorScanner';
import MateriaisCadastrados from './PagesApp/pagesAlunos/MateriaisCadastrados';
import DetalhesMaterial from './PagesApp/pagesAlunos/DetalhesMaterial';
import ConfigurarEtiqueta from './PagesApp/pagesAlunos/ConfigurarEtiqueta';
import PreVisualizacaoEtiqueta from './PagesApp/pagesAlunos/PreVisualizacaoEtiqueta';
import ConcluirImpressaoEtiqueta from './PagesApp/pagesAlunos/ConcluirImpressaoEtiqueta';
import Configuracoes from './PagesApp/pagesAlunos/Configuracoes';
import DetalhesAtendimento from './PagesApp/pagesAlunos/DetalhesAtendimento';
import DetalhesPacienteAluno from './PagesApp/pagesAlunos/DetalhesPacienteAluno';

// ================= IMPORTS DO PROFESSOR (MOBILE) =================
import LayoutProfessor from './PagesApp/pagesProfessor/LayoutProfessor';
import DashboardProfessor from './PagesApp/pagesProfessor/DashboardProfessor';
import GerenciadorCirurgias from './PagesApp/pagesProfessor/GerenciadorCirurgias';
import TelaMutiraoCirurgico from './PagesApp/pagesProfessor/TelaMutiraoCirurgico';
import DetalhesCirurgiaProfessor from './PagesApp/pagesProfessor/DetalhesCirurgiaProfessor';
import SettingsManager from './PagesApp/pagesProfessor/SettingsManager';
import NovoUsuario from './PagesApp/pagesProfessor/NovoUsuario';
import PacientesProfessor from './PagesApp/pagesProfessor/PacientesProfessor';
import DetalhesPacienteProfessor from './PagesApp/pagesProfessor/DetalhesPacienteProfessor';

// ================= IMPORTS DA RECEPÇÃO (SISTEMA WEB) =================
import LayoutRecepcao from './pagesRecepcao/LayoutRecepcao';
import DashboardRecepcao from './pagesRecepcao/DashboardRecepcao';
import PacientesRecepcao from './pagesRecepcao/PacientesRecepcao';
import CadastroPacienteRecepcao from './pagesRecepcao/CadastroPacienteRecepcao';
import DetalhesPacienteRecepcao from './pagesRecepcao/DetalhesPacienteRecepcao';
import FilaPacientes from './pagesRecepcao/FilaPacientes';
import StatusConsultas from './pagesRecepcao/StatusConsultas';
import AgendaGeral from './pagesRecepcao/AgendaGeral';
import AgendarConsulta from './pagesRecepcao/AgendarConsulta';
import ReagendarConsulta from './pagesRecepcao/ReagendarConsulta';
import CancelarConsulta from './pagesRecepcao/CancelarConsulta';

function SpacerWrapper({ children }) {
  return <div className="w-full h-full">{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* ROTAS DO ALUNO */}
        <Route path="/app/aluno" element={<LayoutAluno />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAluno />} />
          <Route path="cirurgias" element={<SpacerWrapper><ListaCirurgias /></SpacerWrapper>} />
          <Route path="cirurgias/detalhes" element={<DetalhesCirurgia />} />
          <Route path="estoque" element={<EstoqueAluno />} />
          <Route path="estoque/cadastrar" element={<CadastrarMaterial />} />
          <Route path="estoque/scanner" element={<LeitorScanner />} />
          <Route path="estoque/materiais" element={<MateriaisCadastrados />} />
          <Route path="estoque/detalhes" element={<DetalhesMaterial />} />
          <Route path="estoque/configurar-etiqueta" element={<ConfigurarEtiqueta />} />
          <Route path="estoque/pre-visualizacao" element={<PreVisualizacaoEtiqueta />} />
          <Route path="estoque/impressao-concluida" element={<ConcluirImpressaoEtiqueta />} />
          <Route path="agenda/detalhes" element={<DetalhesAtendimento />} />
          <Route path="pacientes/detalhes" element={<DetalhesPacienteAluno />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        {/* ROTAS DO PROFESSOR */}
        <Route path="/app/professor" element={<LayoutProfessor />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardProfessor />} />
          <Route path="cirurgias" element={<SpacerWrapper><GerenciadorCirurgias /></SpacerWrapper>} />
          <Route path="cirurgias/detalhes" element={<SpacerWrapper><DetalhesCirurgiaProfessor /></SpacerWrapper>} />
          <Route path="mutirao" element={<SpacerWrapper><TelaMutiraoCirurgico /></SpacerWrapper>} />
          <Route path="pacientes" element={<PacientesProfessor />} />
          <Route path="pacientes/detalhes" element={<DetalhesPacienteProfessor />} />
          <Route path="configuracoes" element={<SettingsManager />} />
          <Route path="configuracoes/novo-usuario" element={<NovoUsuario />} />
        </Route>

        {/* ROTAS DA RECEPÇÃO */}
        <Route path="/app/recepcao" element={<LayoutRecepcao />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardRecepcao />} />
          <Route path="fila-completa" element={<FilaPacientes />} />
          <Route path="pacientes" element={<PacientesRecepcao />} />
          <Route path="pacientes/cadastro" element={<CadastroPacienteRecepcao />} />
          <Route path="pacientes/detalhes" element={<DetalhesPacienteRecepcao />} />
          <Route path="status-consultas" element={<StatusConsultas />} />
          <Route path="agenda" element={<AgendaGeral />} />
          <Route path="agenda/reagendar" element={<ReagendarConsulta />} />
          <Route path="agenda/cancelar" element={<CancelarConsulta />} />
          <Route path="agenda/novo-agendamento" element={<AgendarConsulta />} />
        </Route>

        {/* ROTA CORINGA */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}