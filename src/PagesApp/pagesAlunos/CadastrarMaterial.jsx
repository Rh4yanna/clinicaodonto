import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Calendar, Image, Barcode, X } from 'lucide-react';

export default function CadastrarMaterial() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidade, setUnidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [estoqueIdeal, setEstoqueIdeal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [validade, setValidade] = useState('');
  
  // Estados para Imagem / Arquivo
  const [arquivo, setArquivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Gatilho para clicar no input escondido
  const handleAreaImagemClick = () => {
    fileInputRef.current?.click();
  };

  // Processa o arquivo selecionado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
      
      // Se for uma imagem, gera a URL de visualização prévia
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(''); // Caso seja PDF ou outro formato suportado
      }
    }
  };

  // Remove o arquivo selecionado
  const handleRemoverArquivo = (e) => {
    e.stopPropagation(); // Evita reabrir a janela de arquivos ao clicar no X
    setArquivo(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    // Lógica para salvar futuramente...
    console.log("Produto Salvo!", { nome, arquivo });
    navigate('/app/aluno/estoque'); 
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      
      {/* TOPO FIXO - Novo material */}
      <div className="bg-[#3B44A8] pt-12 pb-6 px-6 text-white flex items-center justify-between shadow-md rounded-b-[24px] shrink-0 select-none">
        <button 
          type="button"
          onClick={() => navigate('/app/aluno/estoque')}
          className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-wide mr-8">Novo material</h1>
        <div className="w-6"></div>
      </div>

      {/* CONTEÚDO ROLÁVEL - FORMULÁRIO */}
      <form onSubmit={handleSalvar} className="flex-1 overflow-y-auto px-6 py-5 space-y-6 pb-24">
        
        {/* SEÇÃO: Informações básicas */}
        <div className="space-y-4">
          <h2 className="text-[#3B44A8] font-bold text-sm tracking-wide">Informações básicas</h2>
          
          {/* Nome do produto */}
          <div className="space-y-1">
            <label className="text-gray-700 text-xs font-bold block">
              Nome do produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Digite o nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition"
              required
            />
          </div>

          {/* Código de barras */}
          <div className="space-y-1">
            <label className="text-gray-700 text-xs font-bold block">
              Código de barras <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Digite ou escaneie o código"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition"
                required
              />
              <Barcode className="absolute right-4 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-1">
            <label className="text-gray-700 text-xs font-bold block">
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-500 focus:outline-none focus:border-[#3B44A8] shadow-sm transition appearance-none font-medium"
                required
              >
                <option value="">Selecione</option>
                <option value="cirurgia">Cirurgia</option>
                <option value="dentistica">Dentística</option>
                <option value="periodontia">Periodontia</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* SEÇÃO: Unidade e estoque */}
        <div className="space-y-4">
          <h2 className="text-[#3B44A8] font-bold text-sm tracking-wide">Unidade e estoque</h2>
          
          {/* Unidade de medida */}
          <div className="space-y-1">
            <label className="text-gray-700 text-xs font-bold block">
              Unidade de medida <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-500 focus:outline-none focus:border-[#3B44A8] shadow-sm transition appearance-none font-medium"
                required
              >
                <option value="">Selecione</option>
                <option value="un">Unidade (Un)</option>
                <option value="cx">Caixa (Cx)</option>
                <option value="pct">Pacote (Pct)</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Estoque Mínimo e Ideal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-700 text-xs font-bold block">
                Estoque mínimo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Digite a quantidade"
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-700 text-xs font-bold block">
                Estoque ideal <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Digite a quantidade"
                value={estoqueIdeal}
                onChange={(e) => setEstoqueIdeal(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition"
                required
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO: Detalhes do produto */}
        <div className="space-y-4">
          <h2 className="text-[#3B44A8] font-bold text-sm tracking-wide">Detalhes do produto</h2>
          
          {/* Descrição */}
          <div className="space-y-1">
            <label className="text-gray-700 text-xs font-bold block">Descrição</label>
            <textarea
              placeholder="Descreva o produto"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition resize-none"
            />
          </div>

          {/* Fabricante/marca */}
          <div className="space-y-1">
            <label className="text-gray-700 text-xs font-bold block">Fabricante/marca</label>
            <input
              type="text"
              placeholder="Digite o nome do fabricante"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition"
            />
          </div>

          {/* Data de validade */}
          <div className="space-y-1 w-1/2 pr-1.5">
            <label className="text-gray-700 text-xs font-bold block">Data de validade</label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3B44A8] shadow-sm transition"
              />
              <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* INPUT DE ARQUIVO ESCONDIDO */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf, image/jpeg, image/png"
          className="hidden"
        />

        {/* ÁREA DE ADICIONAR IMAGEM (Borda tracejada dinâmica) */}
        <div 
          onClick={handleAreaImagemClick}
          className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center select-none transition cursor-pointer relative overflow-hidden ${
            arquivo ? 'border-green-500 bg-green-50/10' : 'border-gray-300 bg-gray-50/30 hover:bg-gray-50'
          }`}
        >
          {arquivo ? (
            <div className="w-full flex flex-col items-center justify-center space-y-2">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
              ) : (
                <Image className="text-green-600" size={24} />
              )}
              <div className="text-xs font-bold text-gray-900 max-w-[250px] truncate">
                {arquivo.name}
              </div>
              <button
                type="button"
                onClick={handleRemoverArquivo}
                className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition mt-1"
              >
                <X size={12} /> Remover arquivo
              </button>
            </div>
          ) : (
            <>
              <Image className="text-gray-400 mb-2" size={24} />
              <span className="text-gray-950 font-bold text-xs block">Adicionar imagem</span>
              <span className="text-gray-400 text-[9px] font-semibold mt-0.5">
                Formatos aceitos: PDF, JPG, PNG • Tamanho máximo: 10MB
              </span>
            </>
          )}
        </div>

        {/* BOTÃO SALVAR PRODUTO (Laranja) */}
        <button
          type="submit"
          className="w-full py-4 bg-[#F9A814] hover:bg-[#e0940f] active:scale-[0.98] rounded-xl font-bold text-white text-xs transition-all shadow-md mt-4"
        >
          Salvar produto
        </button>

      </form>
    </div>
  );
}