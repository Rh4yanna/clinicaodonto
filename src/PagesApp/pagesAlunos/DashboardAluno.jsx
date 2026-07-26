import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Calendar, ChevronRight } from 'lucide-react';

export default function DashboardAluno() {
  const navigate = useNavigate();
  const [dataAtual, setDataAtual] = useState('');

  useEffect(() => {
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
    setDataAtual(obterDataFormatada());
  }, []);

  const cirurgiasHoje = [
    {
      horario: "08:30",
      paciente: "Kauan Ferreira",
      procedimento: "Exodontia - 36",
      professor: "Prof. Dr. Carlos Eduardo",
      local: "Centro Cirúrgico"
    },
    {
      horario: "15:30",
      paciente: "Nome do paciente",
      procedimento: "Extração de siso",
      professor: "Prof. Dra. Ana Maria",
      local: "Centro Cirúrgico"
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* TOPO FIXO - Dashboard */}
      <div className="bg-[#3B44A8] pt-10 pb-6 px-6 text-white flex items-center justify-between shadow-md rounded-b-[24px] shrink-0">
        <button 
          onClick={() => navigate('/app/aluno/configuracoes')}
          className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95"
        >
          <Settings size={22} />
        </button>
        
        <div className="text-center select-none">
          <h1 className="text-lg font-bold tracking-wide">Dashboard</h1>
          <p className="text-[#F9A814] text-[10px] font-semibold uppercase tracking-wider">Aluno</p>
        </div>

        <button className="p-1 hover:bg-white/10 rounded-lg transition active:scale-95 relative">
          <Bell size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* CONTEÚDO ROLÁVEL - Dashboard */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        
        {/* Saudação */}
        <div className="select-none">
          <h2 className="text-gray-900 text-2xl font-extrabold leading-tight">Olá, Kauan</h2>
          <p className="text-gray-500 text-xs font-medium">Bem-vindo de volta!</p>
        </div>

        {/* Seletor de Data */}
        <div className="w-full border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm bg-white select-none">
          <span className="text-[#3B44A8] font-bold text-xs">{dataAtual}</span>
          <Calendar className="text-[#3B44A8]" size={18} />
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-2 gap-3 select-none">
          {/* Consultas */}
          <div className="bg-white border border-gray-150 rounded-2xl p-4 text-center shadow-sm">
            <span className="block text-gray-900 font-extrabold text-xs leading-tight">Consultas do dia</span>
            <span className="block text-3xl font-extrabold text-[#3B44A8] my-1.5">16</span>
            <span className="block text-[10px] font-semibold text-gray-800">Confirmadas</span>
          </div>

          {/* Card de Cirurgias */}
          <button 
            onClick={() => navigate('/app/aluno/cirurgias')}
            className="bg-white border border-gray-150 rounded-2xl p-4 text-center shadow-sm hover:border-[#3B44A8]/30 transition text-left block w-full"
          >
            <span className="block text-gray-900 font-extrabold text-xs leading-tight text-center">Cirurgias do dia</span>
            <span className="block text-3xl font-extrabold text-[#3B44A8] my-1.5 text-center">2</span>
            <span className="block text-[10px] font-semibold text-gray-800 text-center">Confirmadas</span>
          </button>
        </div>

        {/* Próximos Atendimentos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[#3B44A8] font-extrabold text-sm">Próximos atendimentos</h3>
            <button className="text-[#3B44A8] text-xs font-bold hover:underline">Ver agenda</button>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer">
              <div className="text-gray-500 font-medium text-xs w-10 pr-1 text-center">08:30</div>
              <div className="w-[1px] h-8 bg-gray-200 mr-3"></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-950 text-xs truncate">Kauan Ferreira</h4>
                <p className="text-gray-800 text-[11px] font-semibold">Clareamento Dental</p>
                <p className="text-gray-400 text-[9px] font-medium">Dentística</p>
              </div>
              <div className="ml-2">
                <span className="inline-block bg-[#DCE0F5] text-[#3B44A8] text-[8px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                  Centro Cirúrgico
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cirurgias de Hoje */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[#3B44A8] font-extrabold text-sm">Cirurgias de hoje</h3>
            <button 
              onClick={() => navigate('/app/aluno/cirurgias')}
              className="text-[#3B44A8] text-xs font-bold hover:underline"
            >
              Ver agenda
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            {cirurgiasHoje.map((cirurgia, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate('/app/aluno/cirurgias')}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="text-gray-500 font-medium text-xs w-10 pr-1 text-center">{cirurgia.horario}</div>
                <div className="w-[1px] h-10 bg-gray-200 mr-3"></div>
                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-950 text-xs truncate">{cirurgia.paciente}</h4>
                    <p className="text-[#3B44A8] text-[11px] font-semibold">{cirurgia.procedimento}</p>
                    <p className="text-gray-500 text-[9px] font-medium leading-none mt-0.5">{cirurgia.professor}</p>
                  </div>
                </div>
                <div className="pl-2 text-[#3B44A8]"><ChevronRight size={18} /></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}