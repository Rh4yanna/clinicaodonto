import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Briefcase, Bell, ClipboardList } from 'lucide-react';
import api from './Services/api';

import logoOdonto from './assets/images/odontologia-branca-scaled.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [perfil, setPerfil] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const perfis = [
    { id: 'aluno', label: 'Aluno', icon: GraduationCap },
    { id: 'professor', label: 'Professor', icon: Briefcase },
    { id: 'recepcao', label: 'Recepção', icon: Bell },
    { id: 'coordenador', label: 'Coordenador', icon: ClipboardList },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!perfil) {
      setErro('Por favor, selecione seu perfil de acesso.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const response = await api.post('/auth/login', {
        email,
        senha,
        perfil
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data?.usuario) {
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }

      if (perfil === 'aluno') {
        navigate('/app/aluno');
      } else if (perfil === 'professor') {
        navigate('/app/professor');
      } else if (perfil === 'recepcao') {
        navigate('/app/recepcao'); 
      } else if (perfil === 'coordenador') {
        navigate('/app/coordenador');
      }
    } catch (err) {
      console.error('Erro ao realizar login:', err);
      const mensagemErro = err.response?.data?.message || 'E-mail ou senha inválidos. Tente novamente!';
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#3B44A8] flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] bg-[#3B44A8] flex flex-col justify-between shadow-2xl overflow-hidden sm:rounded-[32px] border border-[#4853c5]/30">
        
        {/* Topo Logo */}
        <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6 text-center select-none">
          <div className="w-full max-w-[340px] flex items-center justify-center">
            <img 
              src={logoOdonto} 
              alt="Centro Universitário Campo Real - Odontologia" 
              className="w-full h-auto object-contain max-h-[180px]"
            />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-wide mt-4">
            Clínica Odontológica
          </h1>
          <p className="text-white/80 text-sm font-light mt-1">
            Sistema Integrado
          </p>
        </div>

        {/* Card Branco */}
        <div className="bg-white flex-1 rounded-t-[36px] px-6 pt-8 pb-8 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            <div>
              <h2 className="text-gray-950 text-xl font-bold">Bem-vindo(a)!</h2>
              <p className="text-gray-500 text-xs mt-1">Faça login para continuar</p>
            </div>

            {erro && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
                {erro}
              </div>
            )}

            {/* Layout dos botões de perfil em 2 colunas (2x2) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                Perfil de Acesso
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {perfis.map((p) => {
                  const Icon = p.icon;
                  const isSelected = perfil === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPerfil(p.id);
                        setErro('');
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-[#3B44A8] bg-[#3B44A8]/5 text-[#3B44A8] shadow-sm font-bold'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? 'text-[#3B44A8]' : 'text-gray-500'} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input E-mail */}
            <div className="space-y-1 pt-1">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#3B44A8] focus:ring-1 focus:ring-[#3B44A8] placeholder-gray-400 transition"
                required
              />
            </div>

            {/* Input Senha */}
            <div className="relative space-y-1">
              <input
                type={showSenha ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#3B44A8] focus:ring-1 focus:ring-[#3B44A8] placeholder-gray-400 pr-12 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Link Esqueci Minha Senha */}
            <div className="text-center pt-1">
              <Link to="/recuperar-senha" className="text-[#3B44A8] text-xs font-semibold hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </form>

          {/* Botão Entrar */}
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={!perfil || carregando}
              className={`w-full py-3.5 rounded-xl font-bold text-center text-white transition-all shadow-md ${
                perfil && !carregando
                  ? 'bg-[#F9A814] hover:bg-[#e0940f] active:scale-[0.98]' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}