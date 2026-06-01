import { useState } from "react";

import Input from "../../../components/atoms/Input/Input";
import PasswordInput from "../../../components/atoms/PasswordInput/PasswordInput";
import Button from "../../../components/atoms/Button/Button";

import ProfileSelect from "./ProfileSelect";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      email,
      senha,
      perfil,
    });
  };

  return (
    <div
      className="
        bg-white
        rounded-t-[40px]
        min-h-[60vh]
        px-8
        py-10
        shadow-lg
      "
    >
      <h2 className="text-3xl font-bold text-gray-900">
        Bem-vindo(a)!
      </h2>

      <p className="text-gray-500 mt-2 mb-8">
        Faça login para continuar
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <PasswordInput
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />

        <ProfileSelect
          value={perfil}
          onChange={(e) =>
            setPerfil(e.target.value)
          }
        />

        <div className="text-center">
          <button
            type="button"
            className="
              text-blue-500
              text-sm
              hover:underline
            "
          >
            Esqueci minha senha
          </button>
        </div>

        <Button type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
}