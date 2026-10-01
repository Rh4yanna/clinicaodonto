import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '../Services/api';
import { chaveDia, consultaConfirmada, consultaPendente } from '../utils/agenda';

export default function AgendaGeral() {
  const navigate = useNavigate();
  const location = useLocation();
  const consultaNotificada = new URLSearchParams(location.search).get('consulta');
  const [mes, setMes] = useState(new Date());
  const [dia, setDia] = useState(new Date());
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    if (!consultaNotificada) return;
    api.get(`/consultas/${consultaNotificada}`).then(res => {
      const data = new Date(res.data.data_hora); setDia(data); setMes(data);
    }).catch(() => setErro('Não foi possível abrir a consulta da notificação.'));
  }, [consultaNotificada]);
  const carregar = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([api.get('/consultas'), api.get('/pacientes')]);
      const nomes = Object.fromEntries(p.data.map(paciente => [paciente.id, paciente.nome]));
      setConsultas(c.data.map(item => ({ ...item, nome: nomes[item.paciente_id] || 'Paciente sem nome' }))
        .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)));
      setErro('');
    } catch { setErro('Não foi possível atualizar a agenda. Tente novamente.'); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => {
    carregar();
    const intervalo = setInterval(carregar, 30000);
    window.addEventListener('focus', carregar);
    return () => { clearInterval(intervalo); window.removeEventListener('focus', carregar); };
  }, [carregar]);
  const selecionarDia = (data) => { setDia(data); setMes(new Date(data.getFullYear(), data.getMonth(), 1)); };
  const mudarDia = (delta) => selecionarDia(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate() + delta));
  const doDia = consultas.filter(c => chaveDia(c.data_hora) === chaveDia(dia));
  const hora = c => new Date(c.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const grupos = [['Confirmados', doDia.filter(c => consultaConfirmada(c.status))], ['Não confirmados', doDia.filter(c => consultaPendente(c.status))], ['Cancelamentos e faltas', doDia.filter(c => ['cancelada', 'faltou'].includes(c.status))]];
  return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
    <div className="flex justify-between items-center gap-3">
      <h1 className="text-xl font-black text-[#3B44A8]">Agenda geral</h1>
      <button onClick={() => navigate('/app/recepcao/agenda/novo-agendamento')} className="flex gap-2 items-center bg-[#F9A814] text-white rounded-xl p-3 font-bold"><Plus size={18} /> Agendar consulta</button>
    </div>
    {erro && <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-xl">{erro} <button onClick={carregar} className="underline">Atualizar</button></div>}
    {carregando && <p role="status">Carregando consultas...</p>}
    <section aria-label="Calendário mensal" className="bg-white border rounded-2xl p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-5">
        <button aria-label="Mês anterior" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}><ChevronLeft /></button>
        <h2 className="font-bold capitalize">{mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button aria-label="Próximo mês" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}><ChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 min-w-[700px]">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <span key={d} className="text-center text-xs font-bold p-2">{d}</span>)}
        {Array.from({ length: new Date(mes.getFullYear(), mes.getMonth(), 1).getDay() }, (_, i) => <div key={`vazio-${i}`} />)}
        {Array.from({ length: new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate() }, (_, i) => {
          const data = new Date(mes.getFullYear(), mes.getMonth(), i + 1);
          const itens = consultas.filter(c => chaveDia(c.data_hora) === chaveDia(data) && c.status !== 'cancelada');
          return <button key={i} aria-label={data.toLocaleDateString('pt-BR')} aria-pressed={chaveDia(data) === chaveDia(dia)} onClick={() => selecionarDia(data)} className={`min-h-28 p-2 border rounded-lg text-left flex flex-col gap-1 ${chaveDia(data) === chaveDia(dia) ? 'bg-blue-50 border-[#3B44A8]' : 'border-gray-100 hover:bg-gray-50'}`}>
            <span className="font-bold text-[#3B44A8]">{i + 1}</span>
            {itens.map(c => <span key={c.id} className="text-[11px] break-words"><strong>{hora(c)}</strong> {c.nome}</span>)}
          </button>;
        })}
      </div>
    </section>
    <div className="flex justify-center items-center gap-5">
      <button aria-label="Dia anterior" onClick={() => mudarDia(-1)}><ChevronLeft /></button>
      <h2 className="font-bold text-[#3B44A8] text-center">{dia.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</h2>
      <button aria-label="Próximo dia" onClick={() => mudarDia(1)}><ChevronRight /></button>
      <button onClick={() => selecionarDia(new Date())} className="text-xs underline">Hoje</button>
    </div>
    <div className="grid md:grid-cols-2 gap-5">
      {grupos.map(([titulo, itens], idx) => (idx < 2 || itens.length > 0) && <section key={titulo} aria-label={titulo} className="bg-white border rounded-2xl p-4">
        <h3 className="font-bold mb-3">{titulo} ({itens.length})</h3>
        {!carregando && !erro && itens.length === 0 && <p className="text-sm text-gray-500">Nenhum paciente nesta lista.</p>}
        {itens.map(c => <div key={c.id} className="border-t py-3 space-y-2">
          <p className="text-sm"><strong>{hora(c)}</strong> — {c.nome}</p>
          <p className="text-xs text-gray-500">{c.queixa_principal || 'Consulta'} · {c.disciplina || 'Sem disciplina'} · {c.status.replaceAll('_', ' ')}</p>
          <div className="flex gap-3 text-xs text-[#3B44A8]">
            <button onClick={() => navigate('/app/recepcao/pacientes/detalhes', { state: { paciente: { id: c.paciente_id } } })}>Ver paciente</button>
            {!['cancelada', 'realizada', 'faltou'].includes(c.status) && <>
              <button onClick={() => navigate('/app/recepcao/agenda/reagendar', { state: { agendamento: c } })}>Reagendar</button>
              <button onClick={() => navigate('/app/recepcao/agenda/cancelar', { state: { agendamento: c } })}>Cancelar</button>
            </>}
          </div>
        </div>)}
      </section>)}
    </div>
  </div>;
}
