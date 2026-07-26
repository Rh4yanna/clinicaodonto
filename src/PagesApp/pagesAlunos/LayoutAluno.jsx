import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, PackageCheck, Scissors, CalendarDays } from 'lucide-react';

export default function LayoutAluno() {
  const navigate = useNavigate();
  const location = useLocation();

  // Função que descobre qual aba está ativa na URL para acender o ícone correto
  const obterAbaAtiva = () => {
    const path = location.pathname;
    
    if (path === '/app/aluno' || path === '/app/aluno/' || path.startsWith('/app/aluno/dashboard')) {
      return 'home';
    }
    if (path.startsWith('/app/aluno/cirurgias')) {
      return 'cirurgias';
    }
    if (path.startsWith('/app/aluno/estoque')) {
      return 'estoque';
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
    <div className="min-h-screen w-full bg-[#2E3583]/15 flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Container que simula o celular */}
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[820px] sm:h-[820px] bg-white flex flex-col justify-between shadow-2xl overflow-hidden sm:rounded-[32px] sm:border sm:border-gray-150 relative pb-[72px]">
        
        {/* Conteúdo Dinâmico das Páginas (Dashboard, Cirurgias, Estoque, etc.) */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          <Outlet />
        </div>

        {/* BARRA DE NAVEGAÇÃO INFERIOR FIXA */}
        <div className="absolute bottom-0 left-0 w-full h-[72px] bg-[#3B44A8] text-white/60 px-2 sm:px-4 py-2 flex items-center justify-between sm:rounded-b-[30px] z-20 select-none shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
          
          {/* Botão HOME */}
          <button 
            onClick={() => navigate('/app/aluno/dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all ${
              activeTab === 'home' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <Home size={20} className={activeTab === 'home' ? 'stroke-[2.5px]' : ''} />
            <span className="text-[9px] font-bold">Home</span>
          </button>


          {/* Botão ESTOQUE */}
          <button 
            onClick={() => navigate('/app/aluno/estoque')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all ${
              activeTab === 'estoque' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <PackageCheck size={20} className={activeTab === 'estoque' ? 'stroke-[2.5px]' : ''} />
            <span className="text-[9px] font-bold">Estoque</span>
          </button>

          {/* Botão CIRURGIAS */}
          <button 
            onClick={() => navigate('/app/aluno/cirurgias')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all ${
              activeTab === 'cirurgias' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <Scissors size={20} className={activeTab === 'cirurgias' ? 'stroke-[2.5px]' : ''} />
            <span className="text-[9px] font-bold">Cirurgias</span>
          </button>

          {/* Botão AGENDA CORRIGIDO E ATIVADO */}
          <button 
            onClick={() => navigate('/app/aluno/agenda')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all ${
              activeTab === 'agenda' ? 'text-[#F9A814] scale-105 font-bold' : 'hover:text-white/80'
            }`}
          >
            <CalendarDays size={20} className={activeTab === 'agenda' ? 'stroke-[2.5px]' : ''} />
            <span className="text-[9px] font-bold">Agenda</span>
          </button>

        </div>

      </div>
    </div>
  );
}