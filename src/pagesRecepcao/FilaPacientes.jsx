import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, UserCheck } from 'lucide-react';

export default function FilaPacientes() {
  const navigate = useNavigate();
  // Estado para controlar a sub-aba ativa na mesma tela
  const [abaAtiva, setAbaAtiva] = useState('aguardando'); // 'aguardando' ou 'atendimento'

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
            {abaAtiva === 'aguardando' ? 'Pacientes aguardando' : 'Pacientes em atendimento'}
          </h1>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL EXPANDIDO */}
      <div className="p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
        
        {/* BOTÕES DE ALTERNÂNCIA (TABS) - Idêntico ao design */}
        <div className="bg-gray-100 p-1.5 rounded-2xl inline-flex items-center gap-1.5 select-none border border-gray-200">
          <button
            onClick={() => setAbaAtiva('aguardando')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
              abaAtiva === 'aguardando'
                ? 'bg-[#3B44A8] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Aguardando
          </button>
          <button
            onClick={() => setAbaAtiva('atendimento')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all ${
              abaAtiva === 'atendimento'
                ? 'bg-[#3B44A8] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            Em atendimento
          </button>
        </div>

        {/* CONTEÚDOS DINÂMICOS BASEADOS NA ABA SELECIONADA */}
        {abaAtiva === 'aguardando' ? (
          /* ================= TELA: PACIENTES AGUARDANDO ================= */
          <div className="space-y-6">
            
            {/* Cards de Métricas Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <span className="block text-3xl font-black text-[#3B44A8]">3</span>
                  <span className="block text-xs font-bold text-gray-500 mt-1">Total de pacientes na fila</span>
                </div>
                <div className="p-3 bg-blue-50 text-[#3B44A8] rounded-xl">
                  <Users size={22} />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#3B44A8]">20</span>
                    <span className="text-sm font-bold text-[#3B44A8]">min</span>
                  </div>
                  <span className="block text-xs font-bold text-gray-500 mt-1">Tempo médio de espera</span>
                </div>
                <div className="p-3 bg-amber-50 text-[#F9A814] rounded-xl">
                  <Clock size={22} />
                </div>
              </div>
            </div>

            {/* Lista da Fila de Espera */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {[
                { hora: "08:30", nome: "Kauan Ferreira", proc: "Clareamento Dental", esp: "Dentística", tempo: "30 min de espera" },
                { hora: "08:50", nome: "Nome do paciente", proc: "Restauração", esp: "Dentística", tempo: "10 min de espera" },
                { hora: "08:50", nome: "Nome do paciente", proc: "Tratamento de Canal", esp: "Ortodontia", tempo: "Aguardando" }
              ].map((p, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-gray-500 font-black text-xs w-12 text-center bg-gray-50 py-1.5 rounded-lg border border-gray-200">{p.hora}</div>
                    <div className="w-[1px] h-8 bg-gray-200 mx-4"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-950 text-sm truncate">{p.nome}</h4>
                      <p className="text-gray-600 text-xs font-medium mt-0.5">{p.proc} • <span className="text-gray-400 text-[11px]">{p.esp}</span></p>
                    </div>
                  </div>
                  
                  <div className="ml-4 select-none">
                    <span className={`inline-block text-[11px] font-bold px-3 py-1.5 rounded-full border ${
                      p.tempo === 'Aguardando' 
                        ? 'bg-blue-50 text-[#3B44A8] border-blue-100' 
                        : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                      {p.tempo}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* ================= TELA: PACIENTES EM ATENDIMENTO ================= */
          <div className="space-y-4">
            
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {[
                { hora: "08:15", nome: "Nome do paciente", proc: "Clareamento Dental", esp: "Dentística", sala: "Consultório 01", prof: "Prof. Dr. João" },
                { hora: "08:25", nome: "Nome do paciente", proc: "Extração de siso", esp: "Cirurgia Bucal", sala: "Sala de Cirurgia", prof: "Dr(a). Ana" }
              ].map((p, idx) => (
                <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                  
                  {/* Dados do Paciente */}
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-gray-500 font-black text-xs w-12 text-center bg-gray-50 py-1.5 rounded-lg border border-gray-200">{p.hora}</div>
                    <div className="w-[1px] h-8 bg-gray-200 mx-4"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-950 text-sm truncate">{p.nome}</h4>
                      <p className="text-gray-600 text-xs font-medium mt-0.5">{p.proc} • <span className="text-gray-400 text-[11px]">{p.esp}</span></p>
                    </div>
                  </div>

                  {/* Localização / Alocação Profissional (Direita) */}
                  <div className="flex items-center gap-3 bg-gray-50/80 border border-gray-200 p-3 rounded-xl min-w-[200px] sm:text-right sm:justify-end">
                    <div className="shrink-0 sm:order-2 p-2 bg-[#3B44A8]/10 text-[#3B44A8] rounded-lg">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-gray-400 uppercase tracking-wider">Local</span>
                      <span className="block text-xs font-bold text-gray-900">{p.sala}</span>
                      <span className="block text-[10px] font-medium text-gray-500 mt-0.5">{p.prof}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}