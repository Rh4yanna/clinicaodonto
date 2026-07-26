import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ConcluirImpressaoEtiqueta() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera os dados vindos da impressão ou assume valores mockados do print por segurança
  const dados = location.state || {
    nome: 'Kit Cirúrgico 01',
    lote: '2026-05-15',
    validade: '15/04/2030',
    quantidadeImpressa: 10,
    dataHora: '15/05/2026 - 11:44',
    usuario: 'Pedro Guimarães'
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F9FD] font-sans pb-10">
      
      {/* HEADER AZUL */}
      <div className="bg-[#3B44A8] pt-12 pb-6 px-6 text-white flex items-center shadow-md rounded-b-[24px] shrink-0 select-none">
        <button 
          onClick={() => navigate('/app/aluno/estoque/materiais')} // Retorna para o início do estoque
          className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95 mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide flex-1 text-center mr-8">Impressão de etiquetas</h1>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        
        {/* CARD ALERT DE SUCESSO (ROXO CLARO) */}
        <div className="bg-[#DCE0F5] border border-[#C6CDEE] rounded-2xl p-4 flex items-center gap-4 shadow-sm">
          <CheckCircle2 className="text-[#3B44A8] shrink-0" size={28} strokeWidth={2} />
          <div className="flex flex-col">
            <span className="text-[#3B44A8] font-black text-sm">Impressão concluída!</span>
            <span className="text-[#555EBF] text-xs font-semibold">
              {dados.quantidadeImpressa} etiqueta(s) impressa(s) com sucesso.
            </span>
          </div>
        </div>

        {/* DETALHES DO RESUMO DA IMPRESSÃO */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-5">
          <h2 className="text-[#3B44A8] font-black text-base tracking-wide">Resumo da impressão</h2>
          
          {/* Grid de 3 colunas para a primeira linha */}
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500">
            <div>
              <span className="block text-gray-950 font-black mb-0.5">Material</span>
              <p className="truncate text-gray-700 font-medium">{dados.nome}</p>
            </div>
            <div>
              <span className="block text-gray-950 font-black mb-0.5">Lote</span>
              <p className="truncate text-gray-700 font-medium">{dados.lote}</p>
            </div>
            <div>
              <span className="block text-gray-950 font-black mb-0.5">Validade</span>
              <p className="truncate text-gray-700 font-medium">{dados.validade}</p>
            </div>
          </div>

          {/* Grid de 2 colunas para a segunda linha */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
            <div>
              <span className="block text-gray-950 font-black mb-0.5">Quantidade impressa</span>
              <p className="text-gray-700 font-medium">{dados.quantidadeImpressa} etiquetas</p>
            </div>
            <div>
              <span className="block text-gray-950 font-black mb-0.5">Data e hora</span>
              <p className="text-gray-700 font-medium">{dados.dataHora}</p>
            </div>
          </div>

          {/* Linha final para o usuário */}
          <div className="text-xs font-semibold text-gray-500 pt-1">
            <span className="block text-gray-950 font-black mb-0.5">Usuário</span>
            <p className="text-gray-700 font-medium">{dados.usuario}</p>
          </div>

        </div>

      </div>
    </div>
  );
}