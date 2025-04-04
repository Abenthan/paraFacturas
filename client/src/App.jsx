import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClientesProvider } from "./context/ClientesContext";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import NuevoClientePage from "./pages/NuevoClientePage";
import ClientesPage from "./pages/ClientesPage";

function App() {
  return (
    <AuthProvider>
      <ClientesProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/nuevoCliente" element={<NuevoClientePage />} />
            <Route path="/clientes" element={<ClientesPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ClientesProvider>
    </AuthProvider>
  );
}

export default App;
