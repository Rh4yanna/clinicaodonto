import { Outlet } from 'react-router-dom';

export default function LayoutProfessor() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      {/* Aqui as páginas filhas do professor (como o Dashboard) serão renderizadas */}
      <Outlet />
    </div>
  );
}