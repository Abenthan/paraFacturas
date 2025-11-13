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
import NuevoClientePage from "./pages/clientes/NuevoClientePage";
import ClientesPage from "./pages/clientes/ClientesPage";
import ClientePage from "./pages/clientes/ClientePage";
import ProductosPage from "./pages/productos/ProductosPage.jsx";
import CrearProductoPage from "./pages/productos/CrearProductoPage.jsx";
import ProductoPage from "./pages/productos/ProductoPage.jsx";
import SuscripcionesPage from "./pages/suscripciones/SuscripcionesPage.jsx";
import SuscripcionesClientePage from "./pages/suscripciones/SuscripcionesClientePage";
import SuscripcionPage from "./pages/suscripciones/SuscripcionPage";
import CrearSuscripcionPage from "./pages/suscripciones/CrearSuscripcionPage";
import SuspenderSuscripcionPage from "./pages/suscripciones/SuspenderSuscripcionPage.jsx";
import ReconexionPage from "./pages/suscripciones/ReconexionPage.jsx";
import RetiroSuscripcionPage from "./pages/suscripciones/RetiroSuscripcionPage.jsx";
import ReactivacionPage from "./pages/suscripciones/ReactivacionPage.jsx";
import TrasladoPage from "./pages/suscripciones/TrasladoPage.jsx";
import NovedadesPage from "./pages/novedades/NovedadesPage.jsx";
import NovedadesSuscripcionPage from "./pages/novedades/NovedadesSuscripcionPage.jsx";
import FacturacionPage from "./pages/facturacion/FacturacionPage.jsx";
import PrefacturacionPage from "./pages/facturacion/PrefacturacionPage.jsx";
import FacturasPage from "./pages/facturacion/FacturasPage.jsx";
import ImprimirFacturacionPage from "./pages/facturacion/ImprimirFacturacionPage.jsx";
import FacturaPage from "./pages/facturacion/FacturaPage.jsx";
import PagarFacturaPage from "./pages/facturacion/PagarFacturaPage.jsx";
import PagosPage from "./pages/facturacion/PagosPage.jsx";
import PagoPage from "./pages/facturacion/PagoPage.jsx";
import CarteraPage from "./pages/facturacion/CarteraPage.jsx";
import CarteraSuscripcionPage from "./pages/facturacion/CarteraSuscripcionPage.jsx";
import EstadoCuentaCliente from "./pages/facturacion/EstadoCuentaClientePage.jsx";

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

                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/nuevoCliente" element={<NuevoClientePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/clientes" element={<ClientesPage />} />
                    <Route path="/cliente/:id" element={<ClientePage />} />
                    <Route path="/productos" element={<ProductosPage />} />
                    <Route path="/crearProducto" element={<CrearProductoPage />} />
                    <Route path="/producto/:id" element={<ProductoPage />} />
                    <Route path="/suscripciones" element={<SuscripcionesPage />} />
                    <Route path="/suscripcionesCliente/:id" element={<SuscripcionesClientePage />} />
                    <Route path="/crearSuscripcion/:id" element={<CrearSuscripcionPage />} />
                    <Route path="/suscripcion/:id" element={<SuscripcionPage />} />
                    <Route path="/suspenderSuscripcion/:idSuscripcion" element={<SuspenderSuscripcionPage />} />
                    <Route path="/suscripciones/reconexion" element={<ReconexionPage />} />
                    <Route path="/suscripciones/retiro" element={<RetiroSuscripcionPage />} />
                    <Route path="/suscripciones/reactivar" element={<ReactivacionPage />} />
                    <Route path="/suscripciones/traslado" element={<TrasladoPage />} />
                    <Route path="/suscripciones/novedades/:idSuscripcion" element={<NovedadesSuscripcionPage />} />
                    <Route path="/novedades" element={<NovedadesPage />} />
                    <Route path="/facturacion" element={<FacturacionPage />} />
                    <Route path="/prefacturacion" element={<PrefacturacionPage />} />
                    <Route path="/facturas" element={<FacturasPage />} />
                    <Route path="/facturas/imprimir" element={<ImprimirFacturacionPage />} />
                    <Route path="/factura/:id" element={<FacturaPage />} />
                    <Route path="/pagarFactura/:id" element={<PagarFacturaPage />} />
                    <Route path="/pagos" element={<PagosPage />} />
                    <Route path="/pago/:id" element={<PagoPage />} />
                    <Route path="/cartera" element={<CarteraPage />} />
                    <Route path="/estadoCuentaCliente/:id" element={<EstadoCuentaCliente />} />
                    <Route path="/carteraSuscripcion/:id" element={<CarteraSuscripcionPage />} />


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
