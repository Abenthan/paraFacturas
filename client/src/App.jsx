import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClientesProvider } from "./context/ClientesContext";
import { ProductosProvider } from "./context/ProductosContext";
import { SuscripcionesProvider } from "./context/SuscripcionesContext";
import { FacturacionProvider } from "./context/FacturacionContext.jsx";

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
import SuscripcionPage from "./pages/SuscripcionPage";
import CrearSuscripcionPage from "./pages/CrearSuscripcionPage";
import FacturacionPage from "./pages/FacturacionPage.jsx";
import PrefacturacionPage from "./pages/PrefacturacionPage.jsx";
import FacturasPage from "./pages/FacturasPage.jsx";
import FacturaPage from "./pages/FacturaPage.jsx";
import PagarFacturaPage from "./pages/PagarFacturaPage.jsx";
import PagosPage from "./pages/PagosPage.jsx";
import PagoPage from "./pages/PagoPage.jsx";
import Impresion from "./pages/Impresion.jsx";

function App() {
  return (
    <AuthProvider>
      <ClientesProvider>
        <ProductosProvider>
          <SuscripcionesProvider>
            <FacturacionProvider>
              <BrowserRouter>
                <Navbar />

                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/facturacion" element={<FacturacionPage />} />
                  <Route
                    path="/prefacturacion"
                    element={<PrefacturacionPage />}
                  />
                  <Route path="/facturas" element={<FacturasPage />} />
                  <Route path="/factura/:id" element={<FacturaPage />} />
                  <Route
                    path="/pagarFactura/:id"
                    element={<PagarFacturaPage />}
                  />
                  <Route path="/pagos" element={<PagosPage />} />
                  <Route path="/pago/:id" element={<PagoPage />} />
                  <Route path="/impresion" element={<Impresion />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />

                    <Route
                      path="/nuevoCliente"
                      element={<NuevoClientePage />}
                    />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/clientes" element={<ClientesPage />} />
                    <Route path="/cliente/:id" element={<ClientePage />} />
                    <Route path="/productos" element={<ProductosPage />} />
                    <Route
                      path="/suscripciones/:id"
                      element={<SuscripcionesPage />}
                    />
                    <Route
                      path="/crearSuscripcion/:id"
                      element={<CrearSuscripcionPage />}
                    />
                    <Route
                      path="/suscripcion/:id"
                      element={<SuscripcionPage />}
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </FacturacionProvider>
          </SuscripcionesProvider>
        </ProductosProvider>
      </ClientesProvider>
    </AuthProvider>
  );
}

export default App;
