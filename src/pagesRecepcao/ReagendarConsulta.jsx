import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, ChevronRight, Info } from 'lucide-react';

export default function ReagendarConsulta() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 select-none">
      <div className="flex items-center gap-4 text-[#3B44A8]">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black">Reagendar Consulta</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
            <User size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Nome do paciente</h3>
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100">Ativo</span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">012.123.456-89</p>
          </div>
        </div>
        <button className="text-[#3B44A8] text-xs font-bold flex items-center gap-0.5 hover:underline">
          Ver histórico <ChevronRight size={14} />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Consulta atual</label>
          <div className="bg-[#E4E6F4] border border-blue-100 rounded-2xl p-4 relative">
            <span className="absolute right-4 top-4 bg-[#B7BCED] text-[#3B44A8] text-[10px] font-black px-2 py-0.5 rounded-full">Agendada</span>
            <div className="flex gap-4 text-[#3B44A8] font-black text-sm mb-2">
              <span>25/05/2026</span>
              <span>09:30</span>
            </div>
            <div className="text-[11px] text-gray-700 font-bold space-y-0.5">
              <p>Avaliação</p>
              <p className="text-gray-500 font-medium">Profissional responsável: João Ricardo</p>
              <p className="text-gray-500 font-medium">Aluno: Ana Maria</p>
              <p className="text-gray-500 font-medium">Periodontia</p>
              <p className="text-gray-500 font-medium">Consultório 04</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Nova data e horário</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input type="text" placeholder="dd/mm/aaaa" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
              <Calendar size={18} className="absolute right-3 top-3.5 text-gray-400" />
            </div>
            <div className="relative">
              <input type="text" placeholder="00:00" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
              <Clock size={18} className="absolute right-3 top-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Motivo da alteração</label>
          <input type="text" placeholder="Adicione o motivo" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8]" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-black text-[#3B44A8]">Observações</label>
          <textarea rows="2" placeholder="Adicione observações (opcional)" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#3B44A8] resize-none" />
        </div>

        <div className="bg-[#E4E6F4] border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-[#3B44A8]">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p className="text-[11px] font-bold leading-tight">O paciente será notificado sobre a alteração do agendamento.</p>
        </div>

        <button className="w-full bg-[#F9A814] text-white font-black text-sm p-4 rounded-xl shadow-md hover:bg-orange-500 transition-colors">
          Confirmar reagendamento
        </button>
      </div>
    </div>
  );
}