import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClientesProvider } from "./context/ClientesContext";
import { ProductosProvider } from "./context/ProductosContext";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import NuevoClientePage from "./pages/NuevoClientePage";
import ClientesPage from "./pages/ClientesPage";
import ClientePage from "./pages/ClientePage";
import ProductosPage from "./pages/ProductosPage";

function App() {
  return (
    <AuthProvider>
      <ClientesProvider>
        <ProductosProvider>
          <BrowserRouter>
            <Navbar />

            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/nuevoCliente" element={<NuevoClientePage />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/cliente/:id" element={<ClientePage />} />
              <Route path="/productos" element={<ProductosPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProductosProvider>
      </ClientesProvider>
    </AuthProvider>
  );
}

export default App;
