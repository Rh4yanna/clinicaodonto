import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, PackageCheck, Scissors, CalendarDays, ShieldCheck } from 'lucide-react';

export default function LayoutAluno() {
  const navigate = useNavigate();
  const location = useLocation();

  // Descobre qual aba está ativa na URL para acender o ícone correspondente
  const obterAbaAtiva = () => {
    const path = location.pathname;
    
    if (path === '/app/aluno' || path === '/app/aluno/' || path.startsWith('/app/aluno/dashboard')) {
      return 'home';
    }
    if (path.startsWith('/app/aluno/cme')) return 'cme';
    if (path.startsWith('/app/aluno/estoque')) {
      return 'estoque';
    }
    if (path.startsWith('/app/aluno/cirurgias')) {
      return 'cirurgias';
    }
    if (path.startsWith('/app/aluno/agenda')) {
      return 'agenda';
    }
    if (path.startsWith('/app/aluno/configuracoes')) {
      return 'configuracoes';
    }
    
    return '';
  };

  const activeTab = obterAbaAtiva();

  return (
    <div className="clinical-shell font-sans">
      {/* Layout responsivo */}
      <div className="clinical-frame">
        
        {/* CONTEÚDO DINÂMICO ROLÁVEL */}
        <main className="clinical-content">
          <Outlet />
        </main>

        {/* BARRA DE NAVEGAÇÃO INFERIOR FIXA */}
        <nav 
          aria-label="Navegação principal do aluno"
          className="clinical-navigation text-white/80"
        >
          {/* Botão HOME */}
          <button 
            type="button"
            onClick={() => navigate('/app/aluno/dashboard')}
            aria-label="Ir para a página inicial"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all cursor-pointer ${
              activeTab === 'home' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <Home size={20} className={activeTab === 'home' ? 'stroke-[2.5px]' : ''} />
            <span className="text-xs font-bold">Home</span>
          </button>

          <button onClick={() => navigate('/app/aluno/cme/pacotes')} aria-label="Abrir CME" aria-current={activeTab === 'cme' ? 'page' : undefined} className={`flex flex-col items-center flex-1 gap-1 ${activeTab === 'cme' ? 'text-[#F9A814]' : ''}`}><ShieldCheck size={20}/><span className="text-xs font-bold">CME</span></button>
          {/* Botão ESTOQUE */}
          <button 
            type="button"
            onClick={() => navigate('/app/aluno/estoque')}
            aria-label="Ir para a gestão de estoque"
            aria-current={activeTab === 'estoque' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all cursor-pointer ${
              activeTab === 'estoque' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <PackageCheck size={20} className={activeTab === 'estoque' ? 'stroke-[2.5px]' : ''} />
            <span className="text-xs font-bold">Estoque</span>
          </button>

          {/* Botão CIRURGIAS */}
          <button 
            type="button"
            onClick={() => navigate('/app/aluno/cirurgias')}
            aria-label="Ir para módulo de cirurgias"
            aria-current={activeTab === 'cirurgias' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all cursor-pointer ${
              activeTab === 'cirurgias' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <Scissors size={20} className={activeTab === 'cirurgias' ? 'stroke-[2.5px]' : ''} />
            <span className="text-xs font-bold">Cirurgias</span>
          </button>

          {/* Botão AGENDA */}
          <button 
            type="button"
            onClick={() => navigate('/app/aluno/agenda')}
            aria-label="Ir para a agenda de atendimentos"
            aria-current={activeTab === 'agenda' ? 'page' : undefined}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all cursor-pointer ${
              activeTab === 'agenda' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <CalendarDays size={20} className={activeTab === 'agenda' ? 'stroke-[2.5px]' : ''} />
            <span className="text-xs font-bold">Agenda</span>
          </button>
        </nav>

      </div>
    </div>
  );
}