import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../../components/atoms/Input/Input";
import Button from "../../../components/atoms/Button/Button";

export default function RecuperarSenhaForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email);

    alert(
      "Instruções enviadas para o e-mail cadastrado."
    );
  };

  return (
    <div
      className="
        bg-[#F5F5F5]
        rounded-[32px]
        p-8
        shadow-lg
      "
    >
      <div className="text-center mb-8">

        <div
          className="
            w-32
            h-32
            mx-auto
            rounded-full
            bg-[#D7D6EB]
            flex
            items-center
            justify-center
            text-6xl
            mb-6
          "
        >
          🔒
        </div>

        <h2 className="text-3xl font-bold text-[#3F3DAB]">
          Recuperar sua senha
        </h2>

        <p className="mt-4 text-gray-700">
          Informe seu e-mail institucional para
          receber as instruções de recuperação.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          type="email"
          placeholder="E-mail Institucional"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <div
          className="
            bg-[#D7D6EB]
            rounded-xl
            p-4
            text-sm
          "
        >
          <strong>Importante</strong>

          <p>
            Enviaremos um link de redefinição
            para o e-mail cadastrado.
          </p>
        </div>

        <Button
          type="submit"
          className="
            w-full
            h-14
            bg-amber-500
            text-blue-700
            font-bold
            text-xl
            rounded-xl
          "
        >
          Enviar instruções
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="
              text-blue-700
              hover:underline
            "
          >
            Voltar para o login
          </Link>
        </div>

        <div
          className="
            bg-orange-100
            rounded-xl
            p-4
            text-sm
          "
        >
          <strong>
            Não recebeu o e-mail?
          </strong>

          <p>
            Verifique sua caixa de spam ou lixo
            eletrônico.
          </p>

          <p>
            Caso o problema persista, entre em
            contato com o suporte.
          </p>
        </div>
      </form>
    </div>
  );
}