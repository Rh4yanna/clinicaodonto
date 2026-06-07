import AuthLayout from "../../../layouts/AuthLayout";
import RecuperarSenhaForm from "../components/RecuperarSenhaForm";
import logoCampo from "../../../assets/images/logoCampo.png";

export default function RecuperarSenha() {
  return (
    <AuthLayout>
      <div className="min-h-screen bg-[#3F3DAB] flex flex-col">

        <div className="flex justify-center pt-8">
          <img
            src={logoCampo}
            alt="Campo Real"
            className="w-64 md:w-96"
          />
        </div>

        <div className="flex-1 flex justify-center items-center px-4 py-8">
          <div className="w-full max-w-md">
            <RecuperarSenhaForm />
          </div>
        </div>

      </div>
    </AuthLayout>
  );
}