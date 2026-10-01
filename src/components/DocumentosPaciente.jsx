import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../Services/api';
import { useAuth } from '../context/auth';

export default function DocumentosPaciente({ pacienteId }) {
  const { usuario } = useAuth();
  const [docs, setDocs] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('todos');
  const filtrados = docs.filter(doc => doc.nome_arquivo.toLowerCase().includes(busca.toLowerCase()) && (tipo === 'todos' || (tipo === 'pdf' ? doc.tipo_arquivo === 'application/pdf' : doc.tipo_arquivo?.startsWith('image/'))));
  const carregar = useCallback(async () => {
    if (!pacienteId) { setCarregando(false); return; }
    try { const res = await api.get(`/pacientes/${pacienteId}/documentos`); setDocs(res.data); setErro(''); }
    catch { setErro('Não foi possível carregar os documentos.'); }
    finally { setCarregando(false); }
  }, [pacienteId]);
  useEffect(() => { carregar(); }, [carregar]);
  const enviar = async e => {
    const arquivo = e.target.files?.[0]; e.target.value = '';
    if (!arquivo || enviando) return;
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(arquivo.type) || arquivo.size > 8 * 1024 * 1024 || !arquivo.size) {
      setErro('Selecione um PDF, JPG ou PNG de até 8 MB, com conteúdo.'); return;
    }
    setEnviando(true); setErro('');
    try {
      const base64 = await new Promise((resolve, reject) => {
        const leitor = new FileReader(); leitor.onload = () => resolve(leitor.result.split(',')[1]); leitor.onerror = () => reject(new Error('Falha na leitura')); leitor.readAsDataURL(arquivo);
      });
      await api.post(`/pacientes/${pacienteId}/documentos`, { nome_arquivo: arquivo.name, tipo_arquivo: arquivo.type, conteudo_base64: base64 });
      await carregar();
    } catch (err) { setErro(err.response?.data?.message || 'Não foi possível importar o documento.'); }
    finally { setEnviando(false); }
  };
  const baixar = async doc => {
    try {
      const res = await api.get(`/pacientes/${pacienteId}/documentos/${doc.id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement('a'); link.href = url; link.download = doc.nome_arquivo; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setErro('Não foi possível baixar o documento.'); }
  };
  return <section aria-label="Documentos e exames" className="space-y-4 bg-white border rounded-2xl p-4">
    <h3 className="font-bold text-[#3B44A8]">Documentos e resultados de exames</h3>
    <div className="flex gap-3"><input aria-label="Buscar documento" placeholder="Buscar documento..." value={busca} onChange={e => setBusca(e.target.value)} className="min-w-0 w-full border rounded-lg p-2 text-sm" /><select aria-label="Tipo de documento" value={tipo} onChange={e => setTipo(e.target.value)} className="border rounded-lg p-2 text-sm"><option value="todos">Todos</option><option value="pdf">PDFs</option><option value="imagem">Imagens</option></select></div>
    {usuario?.perfil === 'recepcionista' && <label className="block space-y-2 text-sm"><span>Importar documento digitalizado (PDF, JPG ou PNG, até 8 MB)</span><input aria-label="Importar documento digitalizado" type="file" accept="application/pdf,image/jpeg,image/png" disabled={enviando || !pacienteId} onChange={enviar} className="block w-full" /></label>}
    {enviando && <p role="status">Importando documento...</p>}
    {erro && <p role="alert" className="text-red-600">{erro} <button onClick={carregar} className="underline">Atualizar documentos</button></p>}
    {carregando ? <p>Carregando documentos...</p> : !erro && docs.length === 0 && <p className="text-sm text-gray-500">Nenhum documento importado.</p>}
    {!carregando && !erro && docs.length > 0 && filtrados.length === 0 && <p className="text-sm text-gray-500">Nenhum documento corresponde aos filtros.</p>}
    {filtrados.map(doc => <div key={doc.id} className="border-t pt-3 flex justify-between gap-3 text-sm"><div className="min-w-0"><span className="break-all">{doc.nome_arquivo}</span>{doc.criado_em && <p className="text-xs text-gray-500">{new Date(doc.criado_em).toLocaleDateString('pt-BR')}</p>}</div><button onClick={() => baixar(doc)} className="text-[#3B44A8] underline shrink-0">Baixar documento</button></div>)}
  </section>;
}
DocumentosPaciente.propTypes = { pacienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) };
