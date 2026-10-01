import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import api from '../Services/api';
import AlergiasMedicamentos from './AlergiasMedicamentos';
import HistoricoPaciente from './HistoricoPaciente';
import DocumentosPaciente from './DocumentosPaciente';

export default function ProntuarioPaciente() {
  const location = useLocation(), navigate = useNavigate(), params = useParams();
  const { usuario } = useAuth();
  const pacienteId = params.id || new URLSearchParams(location.search).get('id') || location.state?.paciente?.id;
  const [paciente, setPaciente] = useState(null);
  const [erro, setErro] = useState('');
  const [aba, setAba] = useState('resumo');
  const [edicao, setEdicao] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [versaoHistorico, setVersaoHistorico] = useState(0);
  const clinico = ['aluno', 'professor', 'coordenador'].includes(usuario?.perfil);
  const carregar = useCallback(async () => {
    if (!pacienteId) { setErro('Selecione um paciente na listagem ou na agenda.'); return; }
    try { const res = await api.get(`/pacientes/${pacienteId}`); setPaciente(res.data); setErro(''); }
    catch { setErro('Não foi possível carregar os dados do paciente.'); }
  }, [pacienteId]);
  useEffect(() => { carregar(); }, [carregar]);
  const salvar = async e => {
    e.preventDefault(); if (salvando) return;
    setSalvando(true); setErro('');
    try { const res = await api.put(`/pacientes/${pacienteId}`, edicao); setPaciente(res.data); setEdicao(null); }
    catch (err) { setErro(err.response?.data?.message || 'Não foi possível salvar o cadastro.'); }
    finally { setSalvando(false); }
  };
  const registrar = async e => {
    e.preventDefault(); if (!descricao.trim() || salvando) return;
    setSalvando(true); setErro('');
    try { await api.post(`/pacientes/${pacienteId}/evolucoes`, { descricao: descricao.trim() }); setDescricao(''); setVersaoHistorico(v => v + 1); }
    catch (err) { setErro(err.response?.data?.message || 'Não foi possível registrar a evolução.'); }
    finally { setSalvando(false); }
  };
  return <div className="p-5 md:p-8 space-y-5 w-full">
    <div className="flex items-center justify-between gap-3"><button onClick={() => navigate(-1)} className="text-[#3B44A8]">← Voltar</button><h1 className="font-bold text-xl">Detalhes do paciente</h1></div>
    {erro && <p role="alert" className="bg-red-50 text-red-700 p-3 rounded-xl">{erro} {pacienteId && <button onClick={carregar} className="underline">Atualizar</button>}</p>}
    {!paciente && !erro && <p>Carregando paciente...</p>}
    {paciente && <>
      <header className="p-5 bg-white border rounded-2xl flex justify-between gap-3"><div><h2 className="font-bold text-xl">{paciente.nome}</h2><p className="text-sm">CPF: {paciente.cpf || 'Não informado'}</p></div><span className="text-sm">{paciente.ativo === false ? 'Inativo' : 'Ativo'}</span></header>
      <nav className="flex gap-4 border-b pb-3">{[['resumo', 'Resumo'], ['historico', 'Histórico'], ['documentos', 'Documentos']].map(([id, titulo]) => <button key={id} onClick={() => setAba(id)} aria-pressed={aba === id} className={aba === id ? 'font-bold text-[#3B44A8]' : 'text-gray-500'}>{titulo}</button>)}</nav>
      {aba === 'resumo' && <>
        <section className="bg-white border rounded-2xl p-4 space-y-3">
          <h3 className="font-bold">Informações pessoais</h3>
          {edicao ? <form onSubmit={salvar} className="space-y-3">{[['nome', 'Nome completo'], ['telefone', 'Telefone'], ['email', 'E-mail'], ['endereco', 'Endereço']].map(([campo, titulo]) => <label key={campo} className="block text-sm">{titulo}<input required={campo === 'nome'} type={campo === 'email' ? 'email' : 'text'} value={edicao[campo] || ''} onChange={e => setEdicao({ ...edicao, [campo]: e.target.value })} className="block w-full border rounded-lg p-2" /></label>)}<button disabled={salvando} className="bg-[#3B44A8] text-white p-3 rounded-xl">Salvar cadastro</button><button type="button" disabled={salvando} onClick={() => setEdicao(null)} className="ml-4">Cancelar</button></form> : <>
            <p className="text-sm">Nascimento: {paciente.data_nascimento ? new Date(`${paciente.data_nascimento.slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR') : 'Não informado'}</p>
            <p className="text-sm">Telefone: {paciente.telefone || 'Não informado'}</p><p className="text-sm">E-mail: {paciente.email || 'Não informado'}</p><p className="text-sm">Endereço: {paciente.endereco || 'Não informado'}</p>
            <button onClick={() => usuario?.perfil === 'recepcionista' ? navigate('/app/recepcao/pacientes/cadastro', { state: { pacienteEdicao: paciente } }) : setEdicao({ nome: paciente.nome, telefone: paciente.telefone, email: paciente.email, endereco: paciente.endereco })} className="text-[#3B44A8] underline text-sm">Editar cadastro</button>
          </>}
        </section>
        <AlergiasMedicamentos pacienteId={pacienteId} />
      </>}
      {aba === 'historico' && <>
        <HistoricoPaciente key={versaoHistorico} pacienteId={pacienteId} />
        {clinico && <form onSubmit={registrar} className="bg-white p-4 border rounded-xl space-y-3"><label className="block font-bold text-sm" htmlFor="evolucao">Registrar procedimento / evolução</label><textarea id="evolucao" required value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva o atendimento realizado, os procedimentos e as observações." className="w-full border rounded-lg p-3" /><button disabled={salvando} className="bg-[#3B44A8] text-white p-3 rounded-xl">Registrar evolução</button></form>}
      </>}
      {aba === 'documentos' && <DocumentosPaciente pacienteId={pacienteId} />}
    </>}
  </div>;
}
