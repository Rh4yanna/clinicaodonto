import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import RecuperarSenha from "../features/auth/pages/RecuperarSenha";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/recuperar-senha"
        element={<RecuperarSenha />}
      />
    </Routes>
  );
}