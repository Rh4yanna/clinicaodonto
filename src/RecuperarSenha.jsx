import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, HelpCircle } from 'lucide-react';

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Solicitação de recuperação para:", email);
    // Aqui viria a chamada para a API
  };

  return (
    <div className="min-h-screen w-full bg-[#3B44A8] flex items-center justify-center p-0 sm:p-4 font-sans">
      
      {/* Container principal - Mantém a proporção de celular do Login */}
      <div className="w-full max-w-[420px] min-h-screen sm:min-h-[820px] bg-[#3B44A8] flex flex-col justify-between shadow-2xl overflow-hidden sm:rounded-[32px] border border-[#4853c5]/30">
        
        {/* Topo - Azul com Título e Botão Voltar */}
        <div className="relative flex items-center justify-center pt-14 pb-8 px-6 text-center select-none">
          <button 
            onClick={() => navigate('/login')}
            className="absolute left-6 top-14 text-white hover:opacity-80 transition active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Recuperar senha
          </h1>
        </div>

        {/* Formulário - Card Branco Arredondado */}
        <div className="bg-white flex-1 rounded-t-[36px] px-8 pt-10 pb-8 flex flex-col justify-between">
          
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col items-center">
            
            {/* Ícone do Cadeado Circular */}
            <div className="relative w-28 h-28 bg-[#DCE0F5] rounded-full flex items-center justify-center mb-2">
              {/* Corpo do Cadeado */}
              <div className="w-10 h-8 border-2 border-[#3B44A8] rounded-md relative mt-4 bg-transparent flex items-center justify-center">
                {/* Fechadura */}
                <div className="w-1.5 h-1.5 bg-[#3B44A8] rounded-full"></div>
                <div className="w-0.5 h-2.5 bg-[#3B44A8] -mt-0.5"></div>
              </div>
              {/* Alça do Cadeado */}
              <div className="absolute top-[34px] w-7 h-8 border-2 border-b-0 border-[#3B44A8] rounded-t-full"></div>
              {/* Seta Circular de Reset (Amarela) */}
              <div className="absolute bottom-6 right-6 bg-[#DCE0F5] p-0.5 rounded-full">
                <svg className="w-5 h-5 text-[#F9A814]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                </svg>
              </div>
            </div>

            {/* Títulos de Cabeçalho */}
            <div className="text-center space-y-2">
              <h2 className="text-[#3B44A8] text-xl font-bold">Recuperar sua senha</h2>
              <p className="text-gray-900 text-sm font-normal max-w-[280px] mx-auto leading-relaxed">
                Informe seu e-mail institucional para receber as instruções de recuperação.
              </p>
            </div>

            {/* Input E-mail Institucional */}
            <div className="w-full pt-2">
              <input
                type="email"
                placeholder="E-mail Institucional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm focus:outline-none focus:border-[#3B44A8] focus:ring-1 focus:ring-[#3B44A8] placeholder-gray-400 shadow-sm transition"
                required
              />
            </div>

            {/* Box Informativo Lilás */}
            <div className="w-full bg-[#DCE0F5] p-3.5 rounded-xl flex items-start gap-3 border border-[#3B44A8]/10">
              <Info className="text-[#3B44A8] shrink-0 mt-0.5" size={20} />
              <div className="text-xs text-[#3B44A8] leading-tight">
                <strong className="block font-bold mb-0.5">Importante</strong>
                Enviaremos um link de redefinição de senha para seu e-mail institucional cadastrado no sistema.
              </div>
            </div>

            {/* Botão Enviar Instruções */}
            <button
              type="submit"
              className="w-full py-4 bg-[#F9A814] hover:bg-[#e0940f] active:scale-[0.98] rounded-xl font-bold text-center text-white transition-all shadow-md mt-2"
            >
              Enviar instruções
            </button>

            {/* Divisor "ou" */}
            <div className="w-full flex items-center justify-center gap-4 py-2">
              <div className="h-[1px] bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-xs">ou</span>
              <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            {/* Voltar para o login */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#3B44A8] text-sm font-semibold hover:underline"
            >
              Voltar para o login
            </button>

            {/* Alerta Amarelo de Ajuda na Base */}
            <div className="w-full bg-[#FCECD1] p-4 rounded-xl flex flex-col gap-1 border border-[#F9A814]/10 text-left mt-4 shadow-sm">
              <span className="text-[#3B44A8] text-xs font-bold">Não recebeu o e-mail?</span>
              <p className="text-gray-800 text-[11px] leading-relaxed">
                Verifique sua caixa de spam ou lixo eletrônico.<br />
                Caso o problema persista, entre em contato com o suporte.
              </p>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}