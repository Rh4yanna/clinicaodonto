import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Stethoscope, Users, Box, PackageCheck } from 'lucide-react';

export default function LayoutProfessor() {
  const navigate = useNavigate();
  const location = useLocation();

  const obterAbaAtiva = () => {
    const path = location.pathname;
    if (path === '/app/professor' || path === '/app/professor/' || path.startsWith('/app/professor/dashboard')) return 'home';
    if (path.startsWith('/app/professor/agenda')) return 'agenda';
    if (path.startsWith('/app/professor/cirurgias')) return 'cirurgias';
    if (path.startsWith('/app/professor/pacientes')) return 'pacientes';
    if (path.startsWith('/app/professor/cme')) return 'cme';
    if (path.startsWith('/app/professor/estoque')) return 'estoque';
    return '';
  };

  const activeTab = obterAbaAtiva();

  return (
    /* Fundo cinza escuro para destaque da tela */
    <div className="w-screen h-screen bg-[#1E1E24] flex items-center justify-center p-2 sm:p-4 font-sans overflow-hidden select-none">
      
      {/* Moldura Principal do Celular */}
      <div className="w-full max-w-[390px] h-full max-h-[820px] bg-[#3B44A8] rounded-[36px] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
        
        {/* Renderiza o Dashboard (que já inclui o topo azul e a área branca) */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Outlet />
        </div>

        {/* BOTTOM NAV FIXA */}
        <div className="h-[68px] bg-[#3B44A8] px-2 py-2 flex items-center justify-between shrink-0 z-20 border-t border-white/10 rounded-b-[36px]">
          
          <button 
            onClick={() => navigate('/app/professor/dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-all cursor-pointer ${
              activeTab === 'home' ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
            }`}
          >
            <Home size={18} />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          <button 
            onClick={() => navigate('/app/professor/agenda')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-all cursor-pointer ${
              activeTab === 'agenda' ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
            }`}
          >
            <Calendar size={18} />
            <span className="text-[9px] font-bold">Agenda</span>
          </button>

          <button 
            onClick={() => navigate('/app/professor/cirurgias')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-all cursor-pointer ${
              activeTab === 'cirurgias' ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
            }`}
          >
            <Stethoscope size={18} />
            <span className="text-[9px] font-bold">Cirurgias</span>
          </button>

          <button 
            onClick={() => navigate('/app/professor/pacientes')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-all cursor-pointer ${
              activeTab === 'pacientes' ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
            }`}
          >
            <Users size={18} />
            <span className="text-[9px] font-bold">Pacientes</span>
          </button>

          <button 
            onClick={() => navigate('/app/professor/cme')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-all cursor-pointer ${
              activeTab === 'cme' ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
            }`}
          >
            <Box size={18} />
            <span className="text-[9px] font-bold">CME</span>
          </button>

          <button 
            onClick={() => navigate('/app/professor/estoque')}
            className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-all cursor-pointer ${
              activeTab === 'estoque' ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
            }`}
          >
            <PackageCheck size={18} />
            <span className="text-[9px] font-bold">Estoque</span>
          </button>

        </div>

      </div>
    </div>
  );
}