import AuthLayout from "../../../layouts/AuthLayout";
import LoginForm from "../components/LoginForm";
import logoCampo from "../../../assets/images/logoCampo.png";

export default function Login() {
  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col bg-[#3F3DAB]">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-white px-6 pt-8 md:pt-10">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src={logoCampo}
              alt="Campo Real"
              className="w-64 md:w-[420px] h-auto"
            />
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            Clínica Odontológica
          </h1>

          <p className="text-lg md:text-2xl mt-2 text-center">
            Sistema Integrado
          </p>
        </div>

        {/* Área do formulário */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md md:max-w-lg">
            <LoginForm />
          </div>
        </div>

      </div>
    </AuthLayout>
  );
}