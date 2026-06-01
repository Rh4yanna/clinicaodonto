import AuthLayout from "../../../layouts/AuthLayout";
import LoginForm from "../components/LoginForm";

// Importe sua logo quando adicionar na pasta assets/images
// import logoCampoReal from "../../../assets/images/logo-campo-real.png";

export default function Login() {
  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col bg-[#3F3DAB]">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-white pt-10 pb-8 px-6">
          
          {/* Logo */}
          {/* Quando adicionar a imagem, substituir a div abaixo pelo img */}
          
          {/* 
          <img
            src={logoCampoReal}
            alt="Campo Real"
            className="w-72 mb-6"
          />
          */}

          <div className="mb-6 text-center">
            <h1 className="text-5xl font-serif font-bold">
              CAMPO REAL
            </h1>

            <p className="text-lg">
              Centro Universitário
            </p>
          </div>

          <h2 className="text-4xl font-bold text-center">
            Clínica Odontológica
          </h2>

          <p className="text-xl mt-2 text-center">
            Sistema Integrado
          </p>
        </div>

        {/* Formulário */}
        <div className="flex-1">
          <LoginForm />
        </div>

      </div>
    </AuthLayout>
  );
}