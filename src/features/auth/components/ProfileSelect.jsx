import { useState } from "react";
import {
  ChevronDown,
  GraduationCap,
  UserRound,
  BriefcaseMedical,
} from "lucide-react";

const perfis = [
  {
    value: "aluno",
    label: "Aluno",
    icon: GraduationCap,
  },
  {
    value: "professor",
    label: "Professor",
    icon: UserRound,
  },
  {
    value: "recepcao",
    label: "Recepção",
    icon: BriefcaseMedical,
  },
];

export default function ProfileSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const perfilSelecionado = perfis.find(
    (perfil) => perfil.value === value
  );

  return (
    <div className="relative w-full">
      {/* Campo */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full
          h-14
          bg-white
          border
          border-gray-300
          rounded-xl
          px-4
          flex
          items-center
          justify-between
          shadow-sm
        "
      >
        {perfilSelecionado ? (
          <div className="flex items-center gap-3">
            <div
              className="
                w-8
                h-8
                rounded-full
                bg-amber-500
                flex
                items-center
                justify-center
              "
            >
              <perfilSelecionado.icon
                size={18}
                className="text-blue-700"
              />
            </div>

            <span>{perfilSelecionado.label}</span>
          </div>
        ) : (
          <span className="text-gray-500">
            Selecione seu perfil de acesso
          </span>
        )}

        <ChevronDown
          size={20}
          className="text-amber-500"
        />
      </button>

      {/* Lista */}
      {open && (
        <div
          className="
            absolute
            z-50
            mt-1
            w-full
            bg-white
            border
            border-amber-500
            rounded-xl
            overflow-hidden
            shadow-lg
          "
        >
          {perfis.map((perfil) => {
            const Icon = perfil.icon;

            return (
              <button
                key={perfil.value}
                type="button"
                onClick={() => {
                  onChange(perfil.value);
                  setOpen(false);
                }}
                className="
                  w-full
                  px-4
                  py-3
                  flex
                  items-center
                  gap-3
                  hover:bg-gray-100
                  border-b
                  last:border-b-0
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-amber-500
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon
                    size={18}
                    className="text-blue-700"
                  />
                </div>

                <span>{perfil.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}