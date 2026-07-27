import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Home,
  Users,
  Box,
  CheckCircle,
  Scissors
} from 'lucide-react';

export default function TelaMutiraoCirurgico() {
  const navigate = useNavigate();

  // Fila de atendimento simulada
  const [pacientes] = useState([
    {
      id: 1,
      nome: 'Kauan Ferreira',
      horario: '08:00',
      procedimento: 'Exodontia Simples',
      status: 'Concluída'
    },
    {
      id: 2,
      nome: 'Nome do paciente',
      horario: '08:30',
      procedimento: 'Exodontia Simples',
      status: 'Concluída'
    },
    {
      id: 3,
      nome: 'Nome do paciente',
      horario: '08:55',
      procedimento: 'Exodontia de Raiz',
      status: 'Em andamento'
    },
    {
      id: 4,
      nome: 'Nome do paciente',
      horario: '10:00',
      procedimento: 'Extração de Siso',
      status: 'Em andamento'
    },
    {
      id: 5,
      nome: 'Nome do paciente',
      horario: '10:40',
      procedimento: 'Extração de Terceiro Molares',
      status: 'Pendente'
    }
  ]);

  // Função para renderizar as Badges de Status
  const renderBadge = (status) => {
    switch (status) {
      case 'Concluída':
        return (
          <span className="bg-[#C2E7C3] text-[#2E7D32] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            Concluída
          </span>
        );
      case 'Em andamento':
        return (
          <span className="bg-[#FFE0B2] text-[#E65100] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            Em andamento
          </span>
        );
      case 'Pendente':
        return (
          <span className="bg-[#F8BBD0] text-[#C2185B] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            Pendente
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#3B42B2] text-white flex flex-col justify-between font-sans m-0 p-0 overflow-x-hidden">
      
      {/* Topo / Header */}
      <div className="pt-6 pb-4 px-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer active:scale-95"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-medium tracking-wide text-center flex-1 pr-8">
          Mutirão Cirúrgico
        </h1>
      </div>

      {/* Corpo Principal (Fundo Branco Arredondado) */}
      <div className="bg-white text-slate-800 rounded-t-[32px] px-4 pt-5 pb-6 flex-1 flex flex-col space-y-4">
        
        {/* Card do Mutirão Principal */}
        <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="font-bold text-[#3B42B2] text-base leading-tight">
              Mutirão de Exodontia
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>01/07/2026 • 08:00 - 16:00</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>RealClin Guarapuava</span>
            </div>
          </div>
          <span className="bg-[#C2E7C3] text-[#2E7D32] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
            Em andamento
          </span>
        </div>

        {/* Cards de Resumo (4 colunas) */}
        <div className="grid grid-cols-4 gap-1.5 py-1">
          {/* Pacientes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 text-center shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-800 leading-tight">
              Pacientes
            </p>
            <p className="text-xl font-black text-[#3B42B2] my-0.5">20</p>
            <p className="text-[9px] text-slate-400 font-medium truncate">Confirmados</p>
          </div>

          {/* Realizadas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 text-center shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-800 leading-tight">
              Realizadas
            </p>
            <p className="text-xl font-black text-[#3B42B2] my-0.5">8</p>
            <p className="text-[9px] text-slate-400 font-medium truncate">Concluídas</p>
          </div>

          {/* Em andamento */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 text-center shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-800 leading-tight">
              Em andamento
            </p>
            <p className="text-xl font-black text-[#3B42B2] my-0.5">4</p>
            <span className="h-3"></span>
          </div>

          {/* Pendentes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 text-center shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-bold text-slate-800 leading-tight">
              Pendentes
            </p>
            <p className="text-xl font-black text-red-600 my-0.5">3</p>
            <span className="h-3"></span>
          </div>
        </div>

        {/* Header da Fila */}
        <div className="flex justify-between items-center pt-1">
          <h2 className="font-bold text-[#3B42B2] text-sm">
            Fila de atendimento
          </h2>
          <button className="text-xs text-[#3B42B2] font-semibold hover:underline cursor-pointer">
            Ver todos
          </button>
        </div>

        {/* Lista da Fila de Atendimento */}
        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm divide-y divide-slate-100 overflow-hidden flex-1">
          {pacientes.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('/app/professor/cirurgias/detalhes')}
              className="p-3 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer gap-2 active:bg-slate-100"
            >
              {/* Avatar Placeholder */}
              <div className="pr-1">
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex flex-col items-center justify-center overflow-hidden bg-slate-50">
                  <div className="w-4 h-4 rounded-full border border-slate-800 mb-0.5" />
                  <div className="w-7 h-3.5 rounded-t-full border border-slate-800" />
                </div>
              </div>

              {/* Dados do Paciente */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                  {item.nome}
                </h4>
                <p className="text-xs font-semibold text-slate-500 my-0.5">
                  {item.horario}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {item.procedimento}
                </p>
              </div>

              {/* Badge de Status */}
              <div>
                {renderBadge(item.status)}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-[#3B42B2] px-2 py-3 flex items-center justify-around border-t border-white/10 sticky bottom-0 z-10">
        <button 
          onClick={() => navigate('/app/professor')} 
          className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Agenda</span>
        </button>

        <button 
          onClick={() => navigate('/app/professor/cirurgias')}
          className="flex flex-col items-center gap-1 text-amber-400 font-bold cursor-pointer"
        >
          <Scissors className="w-5 h-5 text-amber-400 rotate-90" />
          <span className="text-[10px]">Cirurgias</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Pacientes</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <CheckCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">CME</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
          <Box className="w-5 h-5" />
          <span className="text-[10px] font-medium">Estoque</span>
        </button>
      </div>

    </div>
  );
}