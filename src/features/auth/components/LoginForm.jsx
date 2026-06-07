import { useState } from "react";
import { Link } from "react-router-dom";

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

    if (!email || !senha || !perfil) {
      alert("Preencha todos os campos.");
      return;
    }

    console.log({
      email,
      senha,
      perfil,
    });

    // Futuramente:
    // authService.login({ email, senha, perfil });
  };

  return (
    <div
      className="
        bg-[#F5F5F5]
        rounded-t-[40px]
        md:rounded-[32px]
        shadow-lg
        p-8
        w-full
      "
    >
      {/* Título */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        Bem-vindo(a)!
      </h2>

      <p className="text-gray-600 mb-8">
        Faça login para continuar
      </p>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* E-mail */}
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Senha */}
        <PasswordInput
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {/* Perfil */}
        <ProfileSelect
          value={perfil}
          onChange={setPerfil}
        />

        {/* Esqueci senha */}
        <div className="text-center">
          <Link
            to="/recuperar-senha"
            className="
              text-blue-600
              text-sm
              hover:underline
            "
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Botão */}
        <Button
          type="submit"
          className="
            w-full
            h-14
            bg-amber-500
            hover:bg-amber-600
            text-[#3F3DAB]
            font-bold
            text-xl
            rounded-xl
            transition-all
          "
        >
          Entrar
        </Button>
      </form>
    </div>
  );
}