import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import JsBarcode from 'jsbarcode';
import api from '../Services/api';
import { useAuth } from '../context/auth';
import './etiquetas.css';

export default function PreVisualizacaoEtiqueta({ area }) {
  const { state: dados } = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [quantidade, setQuantidade] = useState(() => Math.min(100, Math.max(1, Number(dados?.quantidade) || 1)));
  const [qrCode, setQrCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [erro, setErro] = useState('');
  const [solicitada, setSolicitada] = useState(false);
  const materialId = dados?.material?.id;
  const codigo = dados?.material?.codigo_barras;
  const incluirQR = dados?.incluirQR;
  const incluirBarra = dados?.incluirBarra;

  useEffect(() => {
    let cancelado = false;
    setErro('');
    setQrCode('');
    setBarcode('');
    if (incluirQR && materialId) {
      api.get(`/materiais/${materialId}/qrcode`).then(({ data }) => {
        if (cancelado) return;
        if (!data.qr_code) throw new Error('QR indisponível');
        setQrCode(data.qr_code);
      }).catch(() => {
        if (!cancelado) setErro('Não foi possível gerar o QR Code. Volte e tente novamente.');
      });
    }
    if (incluirBarra) {
      try {
        if (!codigo) throw new Error('Código ausente');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svg, String(codigo), { format: 'CODE128', height: 32, width: 1.5, fontSize: 12, margin: 6 });
        setBarcode(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.outerHTML)}`);
      } catch {
        setErro('O material não possui um código de barras válido. Corrija o cadastro ou desmarque essa opção.');
      }
    }
    return () => { cancelado = true; };
  }, [materialId, codigo, incluirQR, incluirBarra]);

  if (!materialId) return <Navigate to={`/app/${area}/estoque/materiais`} replace />;
  const pronta = !erro && (!incluirQR || qrCode) && (!incluirBarra || barcode);
  const dimensoes = dados.modelo?.match(/(\d+)mm\s*x\s*(\d+)mm/);
  const tamanho = { width: `${dimensoes?.[1] || 50}mm`, minHeight: `${dimensoes?.[2] || 30}mm` };
  const etiqueta = (
    <article className="etiqueta" style={tamanho}>
      <strong>{dados.material.nome}</strong>
      <div>Lote: {dados.lote || 'Não informado'}</div>
      <div>Validade: {dados.validade || 'Não informada'}</div>
      <div className="etiqueta-codigos">
        {incluirQR && qrCode && <img src={qrCode} alt="QR Code do material" className="etiqueta-qr" />}
        {incluirBarra && barcode && <img src={barcode} alt={`Código de barras ${codigo}`} className="etiqueta-barra" />}
      </div>
      <small>{dados.localizacao}</small>
    </article>
  );

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F8F9FD] p-5 space-y-5">
      <button onClick={() => navigate(-1)} className="text-[#3B44A8] p-2">← Voltar</button>
      <h1 className="text-xl font-bold text-[#3B44A8]">Pré-visualização da etiqueta</h1>
      {erro && <p role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl">{erro}</p>}
      {!pronta && !erro && <p role="status">Gerando os códigos da etiqueta…</p>}
      <div className="overflow-x-auto rounded-xl border bg-white p-3">{etiqueta}</div>
      <label className="block text-sm font-semibold">Quantidade de etiquetas
        <input aria-label="Quantidade de etiquetas" type="number" min="1" max="100" value={quantidade}
          onChange={e => setQuantidade(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
          className="mt-2 block w-full rounded-xl border p-3" />
      </label>
      <p className="text-sm text-gray-600">Na impressão, use escala de 100% e confira o tamanho do papel. A confirmação depende da sua impressora.</p>
      <button disabled={!pronta} onClick={() => { setSolicitada(true); window.print(); }}
        className="w-full rounded-xl bg-[#3B44A8] p-3 text-white font-bold disabled:opacity-50">Imprimir etiquetas</button>
      {solicitada && <button className="w-full rounded-xl bg-[#F9A814] p-3 font-bold" onClick={() => navigate(`/app/${area}/estoque/impressao-concluida`, {
        state: { id: crypto.randomUUID(), nome: dados.material.nome, lote: dados.lote, validade: dados.validade,
          quantidadeImpressa: quantidade, dataHora: new Date().toLocaleString('pt-BR'), usuario: usuario?.nome,
          configuracaoEtiqueta: { ...dados, quantidade } },
      })}>Confirmar que as etiquetas foram impressas</button>}
      {createPortal(<div className="etiquetas-impressao">{Array.from({ length: quantidade }, (_, index) => <div key={index}>{etiqueta}</div>)}</div>, document.body)}
    </div>
  );
}

PreVisualizacaoEtiqueta.propTypes = { area: PropTypes.oneOf(['aluno', 'professor', 'coordenador']).isRequired };
