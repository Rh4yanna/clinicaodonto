import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import api from '../Services/api';
import FormularioSaude from './FormularioSaude';
import { useAuth } from '../context/auth';

export default function AlergiasMedicamentos({ pacienteId }) {
  const { usuario } = useAuth();
  const somenteAdicionar = !['professor', 'coordenador'].includes(usuario?.perfil);
  const [dados, setDados] = useState(null);
  const [edicao, setEdicao] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const carregar = useCallback(async () => {
    if (!pacienteId) return;
    try {
      const res = await api.get(`/pacientes/${pacienteId}/saude`);
      setDados(res.data); setErro('');
    } catch { setErro('Não foi possível carregar alergias e medicamentos.'); }
  }, [pacienteId]);
  useEffect(() => { carregar(); }, [carregar]);
  const salvar = async e => {
    e.preventDefault();
    if (salvando) return;
    setSalvando(true); setErro('');
    try {
      const res = await api.put(`/pacientes/${pacienteId}/saude`, edicao);
      setDados(res.data); setEdicao(null);
    } catch (err) { setErro(err.response?.data?.message || 'Não foi possível salvar.'); }
    finally { setSalvando(false); }
  };
  return <section className="bg-white border rounded-xl p-4 space-y-3" aria-label="Alergias e medicamentos">
    <h3 className="font-bold text-[#3B44A8]">Alergias e medicamentos</h3>
    {erro && <p role="alert" className="text-red-600 text-sm">{erro} <button type="button" onClick={() => { setEdicao(null); carregar(); }} className="underline">Recarregar</button></p>}
    {!dados && !erro && <p>Carregando...</p>}
    {edicao ? <form onSubmit={salvar} className="space-y-3"><FormularioSaude somenteAdicionar={somenteAdicionar} valor={edicao} onChange={setEdicao} /><div className="flex gap-4"><button disabled={salvando} className="bg-[#3B44A8] text-white p-3 rounded-xl">{salvando ? 'Salvando...' : 'Salvar informações de saúde'}</button><button type="button" disabled={salvando} onClick={() => setEdicao(null)}>Cancelar</button></div></form> : dados && <>
      <p className="text-sm"><strong>Alergias: </strong>{dados.alergias?.length ? dados.alergias.map(a => `${a.substancia}${a.gravidade ? ` (${a.gravidade})` : ''}`).join('; ') : dados.alergias_status === 'nenhum' ? 'Não possui alergias conhecidas.' : 'Ainda não informado.'}</p>
      <p className="text-sm"><strong>Medicamentos: </strong>{dados.medicamentos?.length ? dados.medicamentos.map(m => `${m.nome_medicamento}${m.dosagem ? ` — ${m.dosagem}` : ''}`).join('; ') : dados.medicamentos_status === 'nenhum' ? 'Não utiliza medicamentos.' : 'Ainda não informado.'}</p>
      <button type="button" onClick={() => setEdicao(structuredClone(dados))} className="text-sm text-[#3B44A8] underline">Editar alergias e medicamentos</button>
    </>}
  </section>;
}
AlergiasMedicamentos.propTypes = { pacienteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) };
