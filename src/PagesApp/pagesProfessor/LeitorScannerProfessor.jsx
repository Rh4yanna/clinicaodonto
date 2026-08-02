import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, History, Keyboard, Barcode } from 'lucide-react';

export default function LeitorScannerProfessor() {
  const navigate = useNavigate();
  const location = useLocation();

  // Define a aba inicial com base no botão que o usuário clicou na tela anterior
  const [abaAtiva, setAbaAtiva] = useState('qrcode');

  useEffect(() => {
    if (location.state?.modo) {
      setAbaAtiva(location.state.modo);
    }
  }, [location.state]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      
      {/* HEADER FIXO DINÂMICO */}
      <div className="bg-[#3B44A8] pt-12 pb-6 px-6 text-white flex items-center justify-between shadow-md rounded-b-[24px] shrink-0 select-none">
        <button 
          type="button"
          onClick={() => navigate('/app/professor/estoque')}
          className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide mr-8">
          {abaAtiva === 'qrcode' ? 'Leitura de QR-Code' : 'Leitura de Código de Barras'}
        </h1>
        <div className="w-6"></div>
      </div>

      {/* ABAS DE SELEÇÃO (TOP TABS) */}
      <div className="flex border-b border-gray-200 select-none shrink-0 mx-6 mt-4">
        <button
          type="button"
          onClick={() => setAbaAtiva('qrcode')}
          className={`flex-1 text-center py-3 font-bold text-xs transition-all border-b-2 ${
            abaAtiva === 'qrcode'
              ? 'text-[#3B44A8] border-[#F9A814]'
              : 'text-gray-400 border-transparent'
          }`}
        >
          QR-Code
        </button>
        <button
          type="button"
          onClick={() => setAbaAtiva('barras')}
          className={`flex-1 text-center py-3 font-bold text-xs transition-all border-b-2 ${
            abaAtiva === 'barras'
              ? 'text-[#3B44A8] border-[#F9A814]'
              : 'text-gray-400 border-transparent'
          }`}
        >
          Código de Barras
        </button>
      </div>

      {/* CONTEÚDO PRINCIPAL - ÁREA DA CÂMERA */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center justify-start space-y-6 pb-24">
        
        {/* CONTAINER DA CÂMERA COM BORDAS ENQUADRADAS */}
        <div className="relative w-full max-w-[320px] flex items-center justify-center pt-2">
          
          {/* Caixa do Scanner (Muda o formato baseado na aba ativa) */}
          <div className={`w-full bg-gray-200/80 rounded-2xl relative transition-all duration-300 ${
            abaAtiva === 'qrcode' ? 'aspect-square' : 'aspect-[16/8]'
          }`}>
            
            {/* O efeito de "Camera ao vivo" simulado por enquanto */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold text-xs text-center p-4">
              [ Câmera ativa para leitura ]
            </div>

            {/* Cantoneiras de Foco Amarelas */}
            {/* Top-Left */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#F9A814] rounded-tl-lg"></div>
            {/* Top-Right */}
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#F9A814] rounded-tr-lg"></div>
            {/* Bottom-Left */}
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#F9A814] rounded-bl-lg"></div>
            {/* Bottom-Right */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#F9A814] rounded-br-lg"></div>
          </div>
        </div>

        {/* Mensagem Instrutiva */}
        <p className="text-[#3B44A8] text-xs font-bold text-center select-none">
          Posicione o {abaAtiva === 'qrcode' ? 'QR-Code' : 'Código de Barras'} dentro da área
        </p>

        {/* BOTÕES DE AÇÃO INFERIORES */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[340px] pt-2">
          {/* Botão Histórico */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 rounded-xl font-bold text-[#3B44A8] text-xs shadow-md transition-all"
          >
            <History size={16} />
            Histórico
          </button>

          {/* Botão Digitar Código */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 rounded-xl font-bold text-[#3B44A8] text-xs shadow-md transition-all"
          >
            {abaAtiva === 'qrcode' ? <Keyboard size={16} /> : <Barcode size={16} />}
            Digitar Código
          </button>
        </div>

      </div>
    </div>
  );
}