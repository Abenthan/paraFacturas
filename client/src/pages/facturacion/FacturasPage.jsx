import { useState } from "react";
import { useFacturacion } from "../../context/FacturacionContext";
import { useNavigate } from "react-router-dom";

function FacturasPage() {
  const navigate = useNavigate();
  const { obtenerFacturas } = useFacturacion();

  const [year, setYear] = useState("");
  const [mes, setMes] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [buscar, setBuscar] = useState(""); // Campo de búsqueda unificado
  const [facturas, setFacturas] = useState([]);
  const [totales, setTotales] = useState({
    totalFacturasMes: 0,
    totalPendiente: 0,
    totalFacturacion: 0,
  });
  const [orden, setOrden] = useState({ campo: "nombreCliente", asc: true });
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const data = await obtenerFacturas({
        year: Number(year),
        mes: Number(mes),
      });
      setFacturas(data.facturas);
      setTotales(data.totales);
      console.log("Facturas obtenidas:", data.facturas);
    } catch (error) {
      console.error("Error buscando facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerFactura = (idFactura) => {
    navigate(`/factura/${idFactura}`);
  };

  const cambiarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  };

  const facturasFiltradas = facturas
    .filter((f) => {
      const busqueda = buscar.toLowerCase();
      return (
        f.nombreCliente.toLowerCase().includes(busqueda) ||
        f.codigoFactura.toLowerCase().includes(busqueda) ||
        f.suscripcion_id.toString().includes(busqueda)
      );
    })
    .filter((f) => {
      if (!estadoFiltro) return true;
      return f.estado === estadoFiltro;
    })
    .sort((a, b) => {
      const aVal = a[orden.campo]?.toString().toLowerCase() ?? "";
      const bVal = b[orden.campo]?.toString().toLowerCase() ?? "";
      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Facturas</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center mb-8">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Año</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Mes</option>
          {[
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ].map((m, i) => (
            <option key={i} value={(i + 1).toString().padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente por pagar">Pendiente por pagar</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Pago Parcial">Pago Parcial</option>
          <option value="Anulada">Anulada</option>
        </select>

        <input
          type="text"
          placeholder="Buscar cliente, código o suscripción..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 w-72"
        />

        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            onClick={handleBuscar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Buscar Facturas
          </button>

          {/* Botón imprimir */}
          <button
            onClick={() => navigate("/facturas/imprimir")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center text-xl text-white">Cargando...</div>
      ) : facturasFiltradas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white text-sm">
            <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Factura</th>
                <th
                  className="p-3 text-left cursor-pointer hover:underline"
                  onClick={() => cambiarOrden("suscripcion_id")}
                >
                  Suscripción{" "}
                  {orden.campo === "suscripcion_id" && (orden.asc ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:underline"
                  onClick={() => cambiarOrden("nombreCliente")}
                >
                  Cliente{" "}
                  {orden.campo === "nombreCliente" && (orden.asc ? "▲" : "▼")}
                </th>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Dirección</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3">Pendiente</th>
                <th className="p-3">Total a Pagar</th>
                <th
                  className="p-3 text-left cursor-pointer hover:underline"
                  onClick={() => cambiarOrden("estado")}
                >
                  Estado {orden.campo === "estado" && (orden.asc ? "▲" : "▼")}
                </th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.map((factura) => (
                <tr
                  key={factura.idFactura}
                  className="border-t border-gray-700 hover:bg-gray-800"
                >
                  <td className="p-3">{factura.codigoFactura}</td>
                  <td className="p-3">{factura.suscripcion_id}</td>
                  <td className="p-3">{factura.nombreCliente}</td>
                  <td className="p-3">{factura.nombreProducto}</td>
                  <td className="p-3">{factura.direccionServicio}</td>
                  <td className="p-3">
                    ${factura.valor.toLocaleString("es-CO")}
                  </td>
                  <td className="p-3 text-center">
                    ${Number(factura.valor_pendiente)?.toLocaleString("es-CO")}
                  </td>
                  <td className="p-3 text-center">
                    ${Number(factura.totalPagar)?.toLocaleString("es-CO")}
                  </td>
                  <td className="p-3">{factura.estado}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleVerFactura(factura.idFactura)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg transition"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Totales calculados en frontend */}
            <tfoot className="bg-gray-800 font-bold">
              <tr>
                <td colSpan="5" className="p-3 text-right">
                  Totales (vista filtrada):
                </td>
                <td className="p-3">
                  $
                  {facturasFiltradas
                    .reduce((acc, f) => acc + f.valor, 0)
                    .toLocaleString("es-CO")}
                </td>
                <td className="p-3">
                  $
                  {facturasFiltradas
                    .reduce((acc, f) => acc + (Number(f.valor_pendiente) || 0), 0)
                    .toLocaleString("es-CO")}
                </td>
                <td className="p-3">
                  $
                  {facturasFiltradas
                    .reduce((acc, f) => acc + (Number(f.totalPagar) || 0), 0)
                    .toLocaleString("es-CO")}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center text-xl text-white">
          No se encontraron facturas.
        </div>
      )}
    </div>
  );
}

export default FacturasPage;
