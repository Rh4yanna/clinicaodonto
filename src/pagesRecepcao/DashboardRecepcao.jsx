import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Bell, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function DashboardRecepcao() {
  const navigate = useNavigate();
  const [dataAtual, setDataAtual] = useState('');

  const obterDataFormatada = () => {
    const data = new Date();
    const opcoesMêsAno = { day: 'numeric', month: 'long', year: 'numeric' };
    const dataFormatada = data.toLocaleDateString('pt-BR', opcoesMêsAno);
    const partes = dataFormatada.split(' de ');
    if (partes[1]) {
      partes[1] = partes[1].charAt(0).toUpperCase() + partes[1].slice(1);
    }
    return `Hoje, ${partes.join(' de ')}`;
  };

  useEffect(() => {
    setDataAtual(obterDataFormatada());
  }, []);

  return (
    <div className="flex flex-col w-full min-h-full">
      
      {/* BARRA SUPERIOR (HEADER WEB) */}
      <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-gray-950">Painel de Controle</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Caixa de Data Estilizada */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2.5 text-xs text-[#3B44A8] font-bold shadow-sm">
            <CalendarIcon size={16} className="text-[#F9A814]" />
            <span>{dataAtual}</span>
          </div>

          {/* Notificações */}
          <button className="p-2.5 bg-gray-50 text-gray-600 hover:text-[#3B44A8] hover:bg-gray-100 rounded-xl transition relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* CONTAINER DAS INFORMAÇÕES */}
      <div className="p-8 space-y-8 max-w-7xl w-full mx-auto">
        
        {/* Boas-Vindas */}
        <div className="select-none">
          <h2 className="text-gray-900 text-3xl font-black tracking-tight leading-none">Olá, Kauan</h2>
          <p className="text-gray-500 text-sm font-medium mt-1.5">Gerenciamento e fluxo da recepção da clínica.</p>
        </div>

        {/* CONSULTAS DO DIA - ESTILO DOS ALUNOS */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm select-none">
          <h3 className="text-gray-900 font-extrabold text-sm mb-4 tracking-wide uppercase">Consultas do Dia</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-3xl font-black text-green-600">16</span>
                <span className="block text-xs font-bold text-gray-500 mt-0.5">Confirmadas</span>
              </div>
              <div className="p-3 bg-green-500 text-white rounded-xl">
                <CheckCircle2 size={24} />
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-3xl font-black text-amber-600">5</span>
                <span className="block text-xs font-bold text-gray-500 mt-0.5">Pendentes</span>
              </div>
              <div className="p-3 bg-amber-500 text-white rounded-xl">
                <AlertCircle size={24} />
              </div>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-3xl font-black text-red-600">2</span>
                <span className="block text-xs font-bold text-gray-500 mt-0.5">Faltas</span>
              </div>
              <div className="p-3 bg-red-500 text-white rounded-xl">
                <XCircle size={24} />
              </div>
            </div>

          </div>
        </section>

        {/* LAYOUT WEB EM GRID DUPLO PARA FILAS E CONFIRMAÇÕES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna: Pacientes Aguardando */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-gray-900 font-black text-base">Pacientes Aguardando</h3>
              {/* CORRIGIDO: Agora vai para 'fila-completa', mantendo o menu lateral focado em "Início" */}
              <button 
                onClick={() => navigate('/app/recepcao/fila-completa')} 
                className="text-[#3B44A8] text-xs font-bold hover:underline"
              >
                Ver fila completa
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {[
                { hora: "08:30", nome: "Kauan Ferreira", proc: "Clareamento Dental", esp: "Dentística" },
                { hora: "08:50", nome: "Nome do paciente", proc: "Restauração", esp: "Dentística" },
                { hora: "08:50", nome: "Nome do paciente", proc: "Tratamento de Canal", esp: "Ortodontia" }
              ].map((p, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-[#3B44A8] font-black text-xs w-12 text-center bg-gray-50 py-1.5 rounded-lg border border-gray-200">{p.hora}</div>
                    <div className="w-[1px] h-8 bg-gray-200 mx-4"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-950 text-xs truncate">{p.nome}</h4>
                      <p className="text-gray-600 text-[11px] font-medium mt-0.5">{p.proc} • <span className="text-gray-400 text-[10px]">{p.esp}</span></p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Aguardando
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna: Confirmações Pendentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-gray-900 font-black text-base">Confirmações Pendentes</h3>
              <button 
                onClick={() => navigate('/app/recepcao/status-consultas', { state: { abaInicial: 'pendentes' } })} 
                className="text-[#3B44A8] text-xs font-bold hover:underline"
              >
                Ver todas
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
              {[
                { hora: "08:50", nome: "Nome do paciente", proc: "Avaliação", esp: "Odontopediatria" },
                { hora: "09:15", nome: "Outro Paciente Teste", proc: "Consulta Inicial", esp: "Periodontia" }
              ].map((p, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="text-[#3B44A8] font-black text-xs w-12 text-center bg-gray-50 py-1.5 rounded-lg border border-gray-200">{p.hora}</div>
                    <div className="w-[1px] h-8 bg-gray-200 mx-4"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-950 text-xs truncate">{p.nome}</h4>
                      <p className="text-gray-600 text-[11px] font-medium mt-0.5">{p.proc} • <span className="text-gray-400 text-[10px]">{p.esp}</span></p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Pendente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}