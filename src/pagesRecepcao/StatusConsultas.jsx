import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';

export default function StatusConsultas() {
  const navigate = useNavigate();
  const location = useLocation();

  // Captura se o dashboard enviou alguma aba preferencial, senão assume 'confirmadas'
  const abaInicial = location.state?.abaInicial || 'confirmadas';
  const [abaAtiva, setAbaAtiva] = useState(abaInicial); // 'confirmadas', 'pendentes', 'faltas'

  return (
    <div className="flex flex-col w-full min-h-full">
      
      {/* HEADER WEB COM BOTÃO VOLTAR */}
      <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/app/recepcao/dashboard')}
            className="p-2 bg-gray-50 text-[#3B44A8] hover:bg-gray-100 rounded-xl transition active:scale-95 border border-gray-200"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-black text-gray-950">
            {abaAtiva === 'confirmadas' && 'Confirmados'}
            {abaAtiva === 'pendentes' && 'Confirmações pendentes'}
            {abaAtiva === 'faltas' && 'Faltas'}
          </h1>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
        
        {/* FILTROS / ABAS (TABS) */}
        <div className="bg-gray-100 p-1.5 rounded-2xl inline-flex items-center gap-1.5 select-none border border-gray-200">
          <button
            onClick={() => setAbaAtiva('confirmadas')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
              abaAtiva === 'confirmadas'
                ? 'bg-[#3B44A8] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Confirmadas
          </button>
          <button
            onClick={() => setAbaAtiva('pendentes')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
              abaAtiva === 'pendentes'
                ? 'bg-[#3B44A8] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setAbaAtiva('faltas')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
              abaAtiva === 'faltas'
                ? 'bg-[#3B44A8] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Faltas
          </button>
        </div>

        {/* BANNER INFORMATIVO DINÂMICO */}
        {abaAtiva === 'confirmadas' && (
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 text-blue-800">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Atendimentos confirmados pelos pacientes.</p>
            </div>
          </div>
        )}

        {abaAtiva === 'pendentes' && (
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3 text-purple-900">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <Bell size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black">Aguardando confirmação</h4>
              <p className="text-[11px] font-medium text-purple-700 mt-0.5">Entre em contato com os pacientes para confirmar os atendimentos agendados.</p>
            </div>
          </div>
        )}

        {abaAtiva === 'faltas' && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-900">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold">Pacientes que não compareceram ao atendimento.</p>
            </div>
          </div>
        )}

        {/* RENDERIZAÇÃO DA LISTA BASEADA NA ABA */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
          {abaAtiva === 'confirmadas' && (
            [
              { data: "20/06/2026", hora: "09:30", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística" },
              { data: "20/06/2026", hora: "11:00", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística" },
              { data: "20/06/2026", hora: "08:30", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística" },
              { data: "20/06/2026", hora: "08:30", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística" }
            ].map((p, idx) => <ItemLista key={idx} paciente={p} />)
          )}

          {abaAtiva === 'pendentes' && (
            [
              { data: "20/06/2026", hora: "08:30", nome: "Rhaya Borges", proc: "Clareamento Dental", esp: "Dentística" },
              { data: "20/06/2026", hora: "08:30", nome: "Rhaya Borges", proc: "Clareamento Dental", esp: "Dentística" },
              { data: "20/06/2026", hora: "08:30", nome: "Rhaya Borges", proc: "Clareamento Dental", esp: "Dentística" }
            ].map((p, idx) => <ItemLista key={idx} paciente={p} />)
          )}

          {abaAtiva === 'faltas' && (
            [
              { data: "20/06/2026", hora: "09:30", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística" },
              { data: "20/06/2026", hora: "11:00", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística" }
            ].map((p, idx) => <ItemLista key={idx} paciente={p} />)
          )}
        </div>

        {abaAtiva === 'confirmadas' && (
          <div className="text-center pt-2">
            <button className="text-[#3B44A8] text-xs font-bold hover:underline">Ver mais</button>
          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponente interno para os itens da lista ficarem padronizados
function ItemLista({ paciente }) {
  return (
    <div className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition cursor-pointer group">
      <div className="flex items-center flex-1 min-w-0">
        {/* Data e Hora agrupados */}
        <div className="text-gray-500 font-bold text-[11px] w-20 text-center bg-gray-50 py-1 rounded-lg border border-gray-200 space-y-0.5 select-none">
          <div className="font-black text-gray-700">{paciente.data}</div>
          <div className="text-[10px] text-gray-400 font-medium">{paciente.hora}</div>
        </div>
        
        <div className="w-[1px] h-8 bg-gray-200 mx-4"></div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-950 text-sm truncate">{paciente.nome}</h4>
          <p className="text-gray-600 text-xs font-medium mt-0.5">
            {paciente.proc} • <span className="text-gray-400 text-[11px]">{paciente.esp}</span>
          </p>
        </div>
      </div>

      <div className="ml-4 text-gray-400 group-hover:text-[#3B44A8] transition-colors">
        <ChevronRight size={18} />
      </div>
    </div>
  );
}