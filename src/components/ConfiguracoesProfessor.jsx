import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function ConfiguracoesProfessor() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="flex-1 min-h-0 overflow-y-auto bg-white p-6 space-y-6">
    <button onClick={() => navigate('/app/professor/dashboard')} className="p-2 text-[#3B44A8]">← Voltar</button>
    <h1 className="text-xl font-bold text-[#3B44A8]">Minha conta</h1>
    <div className="rounded-xl border p-4 space-y-2">
      <p className="font-bold">{usuario?.nome}</p>
      <p className="text-sm break-all">{usuario?.email}</p>
      <p className="text-sm text-gray-500">Professor</p>
    </div>
    <button onClick={() => { logout(); navigate('/login', { replace: true }); }}
      className="w-full rounded-xl bg-[#F9A814] p-4 font-bold">Sair do sistema</button>
  </div>;
}
