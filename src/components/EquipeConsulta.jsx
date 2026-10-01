import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/auth';
import api from '../Services/api';

export default function EquipeConsulta({ consultaId, responsavelId, status }) {
  const { usuario } = useAuth();
  const [aberto, setAberto] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const podeEditar = (usuario?.perfil === 'coordenador' || (usuario?.perfil === 'professor' && String(usuario.id) === String(responsavelId))) && !['realizada', 'cancelada', 'faltou'].includes(status);
  const abrir = async () => {
    setAberto(true); setCarregando(true); setErro(''); setSucesso('');
    try {
      const [usuarios, equipe] = await Promise.all([api.get('/usuarios/profissionais', { params: { ativo: 'true' } }), api.get(`/consultas/${consultaId}/alunos`)]);
      setAlunos(usuarios.data.filter(u => u.perfil === 'aluno' && u.ativo !== false));
      setSelecionados(equipe.data.map(a => a.id));
    } catch { setErro('Não foi possível carregar a equipe. Feche e tente novamente.'); }
    finally { setCarregando(false); }
  };
  const salvar = async () => {
    if (salvando) return;
    setSalvando(true); setErro('');
    try { await api.put(`/consultas/${consultaId}/alunos`, { alunos_ids: selecionados }); setSucesso('Alunos responsáveis atualizados.'); setAberto(false); }
    catch (err) { setErro(err.response?.data?.message || 'Não foi possível salvar a equipe.'); }
    finally { setSalvando(false); }
  };
  return <div onClick={e => e.stopPropagation()}>
    <button onClick={abrir} className="text-xs text-[#3B44A8] underline">{podeEditar ? 'Definir alunos responsáveis' : 'Ver alunos responsáveis'}</button>
    {sucesso && <p role="status" className="text-xs text-green-700">{sucesso}</p>}
    {aberto && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"><section role="dialog" aria-modal="true" aria-label="Alunos responsáveis" className="bg-white rounded-2xl p-5 w-full max-w-md space-y-4 text-gray-900">
      <h3 className="font-bold">Alunos responsáveis pelo atendimento</h3>
      {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}
      {carregando ? <p>Carregando alunos...</p> : <div className="max-h-64 overflow-y-auto space-y-2">{alunos.map(a => <label key={a.id} className="flex gap-2 text-sm"><input type="checkbox" disabled={!podeEditar || salvando || Boolean(erro)} checked={selecionados.includes(a.id)} onChange={e => setSelecionados(ids => e.target.checked ? [...ids, a.id] : ids.filter(id => id !== a.id))} />{a.nome}</label>)}</div>}
      <div className="flex gap-4">{podeEditar && <button disabled={salvando || carregando || Boolean(erro)} onClick={salvar} className="bg-[#3B44A8] text-white rounded-lg p-3 disabled:opacity-50">Salvar alunos</button>}<button disabled={salvando} onClick={() => setAberto(false)}>Fechar</button></div>
    </section></div>}
  </div>;
}
EquipeConsulta.propTypes = { consultaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, responsavelId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), status: PropTypes.string };
