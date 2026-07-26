import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import RecuperarSenha from './RecuperarSenha';


// ================= IMPORTS DO ALUNO (MOBILE) =================
import LayoutAluno from './PagesApp/pagesAlunos/LayoutAluno';
import DashboardAluno from './PagesApp/pagesAlunos/DashboardAluno';
import ListaCirurgias from './PagesApp/pagesAlunos/ListaCirurgias';
import DetalhesCirurgia from './PagesApp/pagesAlunos/DetalhesCirurgia';
import StockAluno from './PagesApp/pagesAlunos/EstoqueAluno';
import CadastrarMaterial from './PagesApp/pagesAlunos/CadastrarMaterial';
import LeitorScanner from './PagesApp/pagesAlunos/LeitorScanner';
import MateriaisCadastrados from './PagesApp/pagesAlunos/MateriaisCadastrados';
import DetalhesMaterial from './PagesApp/pagesAlunos/DetalhesMaterial';
import ConfigurarEtiqueta from './PagesApp/pagesAlunos/ConfigurarEtiqueta';
import PreVisualizacaoEtiqueta from './PagesApp/pagesAlunos/PreVisualizacaoEtiqueta';
import ConcluirImpressaoEtiqueta from './PagesApp/pagesAlunos/ConcluirImpressaoEtiqueta';
import Configuracoes from './PagesApp/pagesAlunos/Configuracoes';
import AgendaAluno from './PagesApp/pagesAlunos/AgendaAluno';
import DetalhesAtendimento from './PagesApp/pagesAlunos/DetalhesAtendimento';
import DetalhesPacienteAluno from './PagesApp/pagesAlunos/DetalhesPacienteAluno';


// ================= IMPORTS DO PROFESSOR (MOBILE) =================
import LayoutProfessor from './PagesApp/pagesProfessor/LayoutProfessor';
import DashboardProfessor from './PagesApp/pagesProfessor/DashboardProfessor';


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


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= ROTAS PÚBLICAS ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />


        {/* ================= ROTAS DO ALUNO (MOBILE) ================= */}
        <Route path="/app/aluno" element={<LayoutAluno />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardAluno />} />
          <Route path="cirurgias" element={<SpacerWrapper><ListaCirurgias /></SpacerWrapper>} />
          <Route path="cirurgias/detalhes" element={<DetalhesCirurgia />} />
         
          {/* FLUXO DE ESTOQUE E ETIQUETAS */}
          <Route path="estoque" element={<StockAluno />} />
          <Route path="estoque/cadastrar" element={<CadastrarMaterial />} />
          <Route path="estoque/scanner" element={<LeitorScanner />} />
          <Route path="estoque/materiais" element={<MateriaisCadastrados />} />
          <Route path="estoque/detalhes" element={<DetalhesMaterial />} />
          <Route path="estoque/configurar-etiqueta" element={<ConfigurarEtiqueta />} />
          <Route path="estoque/pre-visualizacao" element={<PreVisualizacaoEtiqueta />} />
          <Route path="estoque/impressao-concluida" element={<ConcluirImpressaoEtiqueta />} />
         
          {/* ROTAS DA AGENDA EXCLUSIVAS DO ALUNO */}
          <Route path="agenda" element={<AgendaAluno />} />
          <Route path="agenda/detalhes" element={<DetalhesAtendimento />} />
          <Route path="pacientes/detalhes" element={<DetalhesPacienteAluno />} />
         
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>


        {/* ================= ROTAS DO PROFESSOR (MOBILE) ================= */}
        <Route path="/app/professor" element={<LayoutProfessor />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardProfessor />} />
        </Route>


        {/* ================= ROTAS DA RECEPÇÃO (SISTEMA WEB) ================= */}
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


        {/* ROTA CORINGA (REDIRECIONA QUALQUER ROTA INVÁLIDA PARA O LOGIN) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


function SpacerWrapper({ children }) {
  return <>{children}</>;
}

