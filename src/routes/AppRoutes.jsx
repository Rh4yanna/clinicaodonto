import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />
    </Routes>
  );
}
