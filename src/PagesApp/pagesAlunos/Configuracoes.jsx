import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';

export default function Configuracoes() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [usuario, setUsuario] = useState({ nome: 'Usuário', perfil: 'Aluno' });

  // Busca as informações do usuário salvas no localStorage durante o Login
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        setUsuario(dados);
      } catch (err) {
        console.error('Erro ao ler dados do usuário:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    // Limpa a sessão no navegador
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Redireciona para a tela de login
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      
      {/* TOPO FIXO - Azul com Título e Botão Voltar */}
      <div className="bg-[#3B44A8] pt-12 pb-6 px-6 text-white flex items-center justify-between shadow-md rounded-b-[24px] shrink-0 select-none">
        <button 
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-xl font-bold tracking-wide mr-8">Configurações</h1>
        
        {/* Espaçador invisível para centralizar o título */}
        <div className="w-6"></div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 bg-white px-6 pt-6 space-y-6 overflow-y-auto pb-4">
        
        {/* Bloco do Perfil do Usuário Dinâmico */}
        <div className="flex items-center gap-4 py-2 border-b border-gray-100 select-none">
          {/* Avatar Genérico */}
          <div className="w-14 h-14 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div>
            <h3 className="font-extrabold text-gray-950 text-base leading-tight">
              {usuario.nome || usuario.name || 'Usuário'}
            </h3>
            <p className="text-gray-500 text-xs font-semibold capitalize">
              {usuario.perfil || usuario.role || 'Aluno'}
            </p>
          </div>
        </div>

        {/* Botão Sair do Sistema (Laranja) */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-4 bg-[#F9A814] hover:bg-[#e0940f] active:scale-[0.98] rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={20} className="rotate-180" />
          Sair do sistema
        </button>

      </div>

      {/* MODAL DE CONFIRMAÇÃO DE LOGOUT */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-[300px] rounded-[24px] p-6 text-center shadow-2xl flex flex-col items-center space-y-4">
            
            {/* Ícone Estilizado da Porta Saindo */}
            <div className="w-20 h-20 bg-transparent flex items-center justify-center text-[#3B44A8]">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            {/* Textos */}
            <div className="space-y-1">
              <h4 className="text-[#3B44A8] font-extrabold text-sm">Tem certeza que deseja sair?</h4>
              <p className="text-gray-500 text-[11px] font-semibold leading-relaxed px-2">
                Você precisará fazer login novamente para acessar sua conta.
              </p>
            </div>

            {/* Botões do Modal */}
            <div className="w-full flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-[#00009C] hover:bg-[#00007A] active:scale-95 text-white font-bold rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Sair
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}