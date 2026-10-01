import { useNavigateClinico as useNavigate } from '../../hooks/useAreaClinica';
import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Home, Calendar, Stethoscope, Users, Box, PackageCheck } from 'lucide-react';

// Configuração centralizada da Bottom Navigation
const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, path: '/app/coordenador/dashboard' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, path: '/app/coordenador/agenda' },
  { id: 'cirurgias', label: 'Cirurgias', icon: Stethoscope, path: '/app/coordenador/cirurgias' },
  { id: 'pacientes', label: 'Pacientes', icon: Users, path: '/app/coordenador/pacientes' },
  { id: 'cme', label: 'CME', icon: Box, path: '/app/coordenador/cme' },
  { id: 'estoque', label: 'Estoque', icon: PackageCheck, path: '/app/coordenador/estoque' },
];

export default function LayoutCoordenador() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determina reativamente a aba ativa com base no pathname atual
  const activeTab = useMemo(() => {
    const path = location.pathname.replace('/app/professor', '/app/coordenador');
    if (path === '/app/coordenador' || path === '/app/coordenador/' || path.startsWith('/app/coordenador/dashboard')) {
      return 'home';
    }
    const match = NAV_ITEMS.find((item) => item.id !== 'home' && path.startsWith(item.path));
    return match ? match.id : '';
  }, [location.pathname]);

  return (
    /* Layout responsivo */
    <div className="clinical-shell font-sans">
      
      {/* Container de Simulação do Dispositivo Móvel */}
      <div className="clinical-frame">
        
        {/* Viewport Renderizador das Páginas (`<Outlet />`) */}
        <main className="clinical-content">
          <Outlet />
        </main>

        {/* BARRA DE NAVEGAÇÃO INFERIOR FIXA */}
        <nav 
          aria-label="Navegação principal"
          className="clinical-navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-colors cursor-pointer ${
                  isActive ? 'text-[#F9A814] font-bold' : 'text-white/80 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}