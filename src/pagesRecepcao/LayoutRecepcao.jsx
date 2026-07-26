import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, LogOut } from 'lucide-react';

export default function LayoutRecepcao() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = location.pathname.includes('/app/recepcao/dashboard')
    ? 'home'
    : location.pathname.includes('/app/recepcao/pacientes')
    ? 'pacientes'
    : location.pathname.includes('/app/recepcao/agenda')
    ? 'agenda'
    : 'home';

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans">
      
      {/* SIDEBAR VERTICAL WEB */}
      <aside className="w-64 bg-[#3B44A8] flex flex-col justify-between text-white shrink-0 shadow-xl z-40 select-none">
        <div>
          {/* Logo / Título do Sistema */}
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-black tracking-wider uppercase text-[#F9A814]">Recepção</h2>
            <p className="text-white/60 text-xs font-light">Clínica Odontológica</p>
          </div>

          {/* Links de Navegação */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => navigate('/app/recepcao/dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                activeTab === 'home'
                  ? 'bg-[#F9A814] text-white shadow-md scale-[1.02]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home size={18} />
              <span>Início</span>
            </button>

            <button
              onClick={() => navigate('/app/recepcao/pacientes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                activeTab === 'pacientes'
                  ? 'bg-[#F9A814] text-white shadow-md scale-[1.02]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users size={18} />
              <span>Pacientes</span>
            </button>

            <button
              onClick={() => navigate('/app/recepcao/agenda')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                activeTab === 'agenda'
                  ? 'bg-[#F9A814] text-white shadow-md scale-[1.02]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Calendar size={18} />
              <span>Agenda Geral</span>
            </button>
          </nav>
        </div>

        {/* Botão de Sair no Rodapé da Sidebar */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-200 hover:bg-red-500/20 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL EXPANSÍVEL */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 pb-8">
        <Outlet />
      </main>
    </div>
  );
}