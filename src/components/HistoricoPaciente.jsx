import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../Services/api';

export default function HistoricoPaciente({ pacienteId }) {
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    if (!pacienteId) { setCarregando(false); return; }
    setCarregando(true);
    try { const res = await api.get(`/pacientes/${pacienteId}/historico`); setItens(res.data); setErro(''); }
    catch { setErro('Não foi possível carregar o histórico completo.'); }
    finally { setCarregando(false); }
  }, [pacienteId]);
  useEffect(() => { carregar(); }, [carregar]);
  return <section aria-label="Histórico completo" className="space-y-3 bg-white border rounded-2xl p-4">
    <div className="flex justify-between"><h3 className="font-bold text-[#3B44A8]">Histórico completo do paciente</h3><button onClick={carregar} className="text-xs underline">Atualizar histórico</button></div>
    <p className="text-xs text-gray-500">Consultas, cirurgias, procedimentos registrados nas evoluções e documentos, com o status de cada registro.</p>
    {erro && <p role="alert" className="text-red-600">{erro}</p>}
    {carregando ? <p>Carregando histórico...</p> : !erro && (itens.length ? itens.map(item => <article key={item.id} className="border-t pt-3 space-y-1">
      <p className="text-xs text-gray-500">{new Date(item.criado_em).toLocaleString('pt-BR')} · {item.tipo} · {item.status?.replaceAll('_', ' ')}</p>
      <h4 className="font-bold text-sm whitespace-pre-wrap">{item.descricao}</h4>
      {item.observacoes && <p className="text-sm whitespace-pre-wrap">{item.observacoes}</p>}
      <p className="text-xs text-gray-500">{[item.disciplina, item.responsavel].filter(Boolean).join(' · ')}</p>
    </article>) : <p className="text-sm text-gray-500">Nenhum registro no histórico.</p>)}
  </section>;
}
HistoricoPaciente.propTypes = { pacienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) };
