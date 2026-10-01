import ConfiguracoesProfessor from './components/ConfiguracoesProfessor';
import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ================= IMPORTS PÚBLICOS =================
import Login from './Login';
import RecuperarSenha from './RecuperarSenha';
import RedefinirSenha from './RedefinirSenha';

// Tela de notificações — a mesma para os três perfis (a API só devolve as
// notificações do usuário logado), montada em uma rota dentro de cada área.
import Notificacoes from './components/Notificacoes';

// ================= IMPORTS DO ALUNO (MOBILE) =================
const EntradaEstoque = lazy(() => import('./components/EntradaEstoque'));
const CmePacotes = lazy(() => import('./components/CmePacotes'));
const LayoutAluno = lazy(() => import('./PagesApp/pagesAlunos/LayoutAluno'));
const DashboardAluno = lazy(() => import('./PagesApp/pagesAlunos/DashboardAluno'));
const AgendaAluno = lazy(() => import('./PagesApp/pagesAlunos/AgendaAluno'));
const ListaCirurgias = lazy(() => import('./PagesApp/pagesAlunos/ListaCirurgias'));
const DetalhesCirurgia = lazy(() => import('./PagesApp/pagesAlunos/DetalhesCirurgia'));
const EstoqueAluno = lazy(() => import('./PagesApp/pagesAlunos/EstoqueAluno'));
const CadastrarMaterial = lazy(() => import('./PagesApp/pagesAlunos/CadastrarMaterial'));
const LeitorScanner = lazy(() => import('./PagesApp/pagesAlunos/LeitorScanner'));
const MateriaisCadastrados = lazy(() => import('./PagesApp/pagesAlunos/MateriaisCadastrados'));
const DetalhesMaterial = lazy(() => import('./PagesApp/pagesAlunos/DetalhesMaterial'));
const ConfigurarEtiqueta = lazy(() => import('./PagesApp/pagesAlunos/ConfigurarEtiqueta'));
const PreVisualizacaoEtiqueta = lazy(() => import('./PagesApp/pagesAlunos/PreVisualizacaoEtiqueta'));
const ConcluirImpressaoEtiqueta = lazy(() => import('./PagesApp/pagesAlunos/ConcluirImpressaoEtiqueta'));
const Configuracoes = lazy(() => import('./PagesApp/pagesAlunos/Configuracoes'));
const DetalhesAtendimento = lazy(() => import('./PagesApp/pagesAlunos/DetalhesAtendimento'));
const DetalhesPacienteAluno = lazy(() => import('./PagesApp/pagesAlunos/DetalhesPacienteAluno'));

// ================= IMPORTS DO COORDENADOR (MOBILE) =================
const LayoutCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/LayoutCoordenador'));
const DashboardCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/DashboardCoordenador'));
const AgendaCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/AgendaCoordenador'));
const CmeCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/CmeCoordenador'));
const LeitorCmeCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/LeitorCmeCoordenador'));
const DetalhesPacoteCme = lazy(() => import('./PagesApp/pagesCoordenador/DetalhesPacoteCme'));
const PacotesEsterilizadosCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/PacotesEsterilizadosCoordenador'));
const ControleBiologicoCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/ControleBiologicoCoordenador'));
const GerenciadorCirurgias = lazy(() => import('./PagesApp/pagesCoordenador/GerenciadorCirurgias'));
const TelaMutiraoCirurgico = lazy(() => import('./PagesApp/pagesCoordenador/TelaMutiraoCirurgico'));
const DetalhesCirurgiaCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/DetalhesCirurgiaCoordenador'));
const SettingsManager = lazy(() => import('./PagesApp/pagesCoordenador/SettingsManager'));
const NovoUsuario = lazy(() => import('./PagesApp/pagesCoordenador/NovoUsuario'));
const NovaCirurgia = lazy(() => import('./PagesApp/pagesCoordenador/NovaCirurgia'));
const NovoCicloCme = lazy(() => import('./PagesApp/pagesCoordenador/NovoCicloCme'));
const PacientesCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/PacientesCoordenador'));
const DetalhesPacienteCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/DetalhesPacienteCoordenador'));

// ESTOQUE COORDENADOR (NOVOS IMPORTS)
const EstoqueCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/EstoqueCoordenador'));
const CadastrarMaterialCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/CadastrarMaterialCoordenador'));
const LeitorScannerCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/LeitorScannerCoordenador'));
const MateriaisCadastradosCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/MateriaisCadastradosCoordenador'));
const DetalhesMaterialCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/DetalhesMaterialCoordenador'));
const ConfigurarEtiquetaCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/ConfigurarEtiquetaCoordenador'));
const PreVisualizacaoEtiquetaCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/PreVisualizacaoEtiquetaCoordenador'));
const ConcluirImpressaoEtiquetaCoordenador = lazy(() => import('./PagesApp/pagesCoordenador/ConcluirImpressaoEtiquetaCoordenador'));

// ================= IMPORTS DA RECEPÇÃO (SISTEMA WEB) =================
const LayoutRecepcao = lazy(() => import('./pagesRecepcao/LayoutRecepcao'));
const DashboardRecepcao = lazy(() => import('./pagesRecepcao/DashboardRecepcao'));
const PacientesRecepcao = lazy(() => import('./pagesRecepcao/PacientesRecepcao'));
const CadastroPacienteRecepcao = lazy(() => import('./pagesRecepcao/CadastroPacienteRecepcao'));
const DetalhesPacienteRecepcao = lazy(() => import('./pagesRecepcao/DetalhesPacienteRecepcao'));
const FilaPacientes = lazy(() => import('./pagesRecepcao/FilaPacientes'));
const StatusConsultas = lazy(() => import('./pagesRecepcao/StatusConsultas'));
const AgendaGeral = lazy(() => import('./pagesRecepcao/AgendaGeral'));
const AgendarConsulta = lazy(() => import('./pagesRecepcao/AgendarConsulta'));
const ReagendarConsulta = lazy(() => import('./pagesRecepcao/ReagendarConsulta'));
const CancelarConsulta = lazy(() => import('./pagesRecepcao/CancelarConsulta'));

function SpacerWrapper({ children }) {
  return <div className="w-full h-full">{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center text-[#3B44A8]">Carregando?</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ROTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* ROTAS DO ALUNO */}
          <Route
            path="/app/aluno"
            element={
              <ProtectedRoute perfisPermitidos={['aluno']}>
                <LayoutAluno />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardAluno />} />
            <Route path="agenda" element={<AgendaAluno />} />
            <Route path="cirurgias" element={<SpacerWrapper><ListaCirurgias /></SpacerWrapper>} />
            <Route path="cirurgias/detalhes" element={<DetalhesCirurgia />} />
            <Route path="estoque/entrada" element={<EntradaEstoque />} />
            <Route path="cme/pacotes" element={<CmePacotes />} />
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
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>

          {/* ROTAS DO COORDENADOR */}
          {['coordenador', 'professor'].map(area => (
          <Route
            key={area} path={`/app/${area}`}
            element={
              <ProtectedRoute perfisPermitidos={[area]}>
                <LayoutCoordenador />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardCoordenador />} />
            <Route path="agenda" element={<AgendaCoordenador />} />
            <Route path="cme" element={<CmeCoordenador />} />
            <Route path="cme/leitor" element={<LeitorCmeCoordenador />} />
            <Route path="cme/pacote-detalhes/:pacoteId" element={<DetalhesPacoteCme />} />
            <Route path="cme/pacotes-esterilizados" element={<PacotesEsterilizadosCoordenador />} />
            <Route path="cme/controle-biologico" element={<ControleBiologicoCoordenador />} />
            <Route path="cirurgias" element={<SpacerWrapper><GerenciadorCirurgias /></SpacerWrapper>} />
            <Route path="cirurgias/detalhes" element={<SpacerWrapper><DetalhesCirurgiaCoordenador /></SpacerWrapper>} />
            <Route path="cirurgias/nova" element={<NovaCirurgia />} />
            <Route path="cme/novo-ciclo" element={<NovoCicloCme />} />
            <Route path="mutirao" element={<SpacerWrapper><TelaMutiraoCirurgico /></SpacerWrapper>} />
            <Route path="pacientes" element={<PacientesCoordenador />} />
            <Route path="pacientes/detalhes" element={<DetalhesPacienteCoordenador />} />
            <Route path="notificacoes" element={<Notificacoes />} />
            <Route path="configuracoes" element={area === 'coordenador' ? <SettingsManager /> : <ConfiguracoesProfessor />} />
            {area === 'coordenador' && <Route path="configuracoes/novo-usuario" element={<NovoUsuario />} />}
            <Route path="*" element={<Navigate to={`/app/${area}/dashboard`} replace />} />

            {/* ROTAS DO ESTOQUE DO COORDENADOR */}
            <Route path="estoque/entrada" element={<EntradaEstoque />} />
            <Route path="cme/pacotes" element={<CmePacotes />} />
            <Route path="estoque" element={<EstoqueCoordenador />} />
            <Route path="estoque/cadastrar" element={<CadastrarMaterialCoordenador />} />
            <Route path="estoque/scanner" element={<LeitorScannerCoordenador />} />
            <Route path="estoque/materiais" element={<MateriaisCadastradosCoordenador />} />
            <Route path="estoque/detalhes" element={<DetalhesMaterialCoordenador />} />
            <Route path="estoque/configurar-etiqueta" element={<ConfigurarEtiquetaCoordenador />} />
            <Route path="estoque/pre-visualizacao" element={<PreVisualizacaoEtiquetaCoordenador />} />
            <Route path="estoque/impressao-concluida" element={<ConcluirImpressaoEtiquetaCoordenador />} />
          </Route>
          ))}

          {/* ROTAS DA RECEPÇÃO */}
          <Route
            path="/app/recepcao"
            element={
              <ProtectedRoute perfisPermitidos={['recepcionista']}>
                <LayoutRecepcao />
              </ProtectedRoute>
            }
          >
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
            <Route path="notificacoes" element={<Notificacoes />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
SpacerWrapper.propTypes = { children: PropTypes.node };
