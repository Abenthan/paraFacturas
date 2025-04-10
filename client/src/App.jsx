import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClientesProvider } from "./context/ClientesContext";
import { ProductosProvider } from "./context/ProductosContext";
import { SuscripcionesProvider } from "./context/SuscripcionesContext";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import NuevoClientePage from "./pages/NuevoClientePage";
import ClientesPage from "./pages/ClientesPage";
import ClientePage from "./pages/ClientePage";
import ProductosPage from "./pages/ProductosPage";
import SuscripcionesPage from "./pages/SuscripcionesPage";

function App() {
  return (
    <AuthProvider>
      <ClientesProvider>
        <ProductosProvider>
          <SuscripcionesProvider>
            <BrowserRouter>
              <Navbar />

              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/nuevoCliente" element={<NuevoClientePage />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/cliente/:id" element={<ClientePage />} />
                <Route path="/productos" element={<ProductosPage />} />
                <Route path="/suscripciones/:id" element={<SuscripcionesPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<HomePage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SuscripcionesProvider>
        </ProductosProvider>
      </ClientesProvider>
    </AuthProvider>
  );
}

export default App;
