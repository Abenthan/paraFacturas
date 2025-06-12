import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFacturacion } from "../../context/FacturacionContext";
import { useNavigate } from "react-router-dom";

function PrefacturacionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { obtenerRegistrosPrefacturacion, generarFacturas } = useFacturacion();

  const [year, setYear] = useState("");
  const [mes, setMes] = useState("");
  const [buscarCliente, setBuscarCliente] = useState("");
  const [registros, setRegistros] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [orden, setOrden] = useState({ campo: "nombreCliente", asc: true });
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const data = await obtenerRegistrosPrefacturacion(year, mes);
      setRegistros(data);
      setSeleccionados([]);
    } catch (error) {
      console.error("Error buscando registros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarTodos = () => {
    if (seleccionados.length === registros.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(registros.map((r) => r.idSuscripcion));
    }
  };

  const handleSeleccionar = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((sid) => sid !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const handleFacturar = async () => {
    if (seleccionados.length === 0) {
      alert("Debe seleccionar al menos un registro.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de generar facturas para ${seleccionados.length} registros?`
    );
    if (!confirmacion) return;

    setLoading(true);
    try {
      await generarFacturas(seleccionados, year, mes, user.id);
      alert("Facturación generada exitosamente.");
      navigate("/facturacion");
    } catch (error) {
      console.error("Error generando facturación:", error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true,
    }));
  };

  const registrosFiltrados = registros
    .filter((r) =>
      r.nombreCliente.toLowerCase().includes(buscarCliente.toLowerCase()) ||
      r.idSuscripcion.toString().includes(buscarCliente)
    )
    .sort((a, b) => {
      const aVal = a[orden.campo]?.toString().toLowerCase() ?? "";
      const bVal = b[orden.campo]?.toString().toLowerCase() ?? "";
      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Generar Facturación del Mes
      </h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Seleccione Año</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Seleccione Mes</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={String(i + 1).padStart(2, "0")}>
              {new Date(0, i).toLocaleString("es-CO", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por cliente o suscripción..."
          value={buscarCliente}
          onChange={(e) => setBuscarCliente(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 w-64"
        />

        <button
          onClick={handleBuscar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Buscar registros
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center text-xl text-white">Cargando...</div>
      ) : (
        registrosFiltrados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white text-sm">
              <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.length === registrosFiltrados.length}
                      onChange={handleSeleccionarTodos}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="p-3">ID</th>
                  <th
                    className="p-3 cursor-pointer hover:underline"
                    onClick={() => cambiarOrden("nombreCliente")}
                  >
                    Cliente {orden.campo === "nombreCliente" && (orden.asc ? "▲" : "▼")}
                  </th>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Dirección</th>
                  <th className="p-3">Valor</th>
                  <th
                    className="p-3 cursor-pointer hover:underline"
                    onClick={() => cambiarOrden("Estado")}
                  >
                    Estado {orden.campo === "Estado" && (orden.asc ? "▲" : "▼")}
                  </th>
                  <th
                    className="p-3 cursor-pointer hover:underline"
                    onClick={() => cambiarOrden("novedad")}
                  >
                    Novedad {orden.campo === "novedad" && (orden.asc ? "▲" : "▼")}
                  </th>
                  <th className="p-3">Fecha Novedad</th>
                  <th className="p-3">Saldo Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {registrosFiltrados.map((registro) => (
                  <tr
                    key={registro.idSuscripcion}
                    className="border-t border-gray-700 hover:bg-gray-800"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(registro.idSuscripcion)}
                        onChange={() => handleSeleccionar(registro.idSuscripcion)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="p-3">{registro.idSuscripcion}</td>
                    <td className="p-3">{registro.nombreCliente}</td>
                    <td className="p-3">{registro.nombreProducto}</td>
                    <td className="p-3">{registro.direccionServicio}</td>
                    <td className="p-3">${registro.valor.toLocaleString("es-CO")}</td>
                    <td className="p-3">{registro.Estado}</td>
                    <td className="p-3">
                      {registro.novedad ? (
                        <a
                          href={`/suscripciones/novedades/${registro.idSuscripcion}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {registro.novedad}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">{registro.fecha_novedad || "-"}</td>
                    <td className="p-3 text-yellow-300 font-semibold">
                      ${registro.saldoPendiente?.toLocaleString("es-CO") || "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
              <p className="text-lg font-semibold text-white">
                Registros seleccionados: {seleccionados.length}
              </p>
              <button
                onClick={handleFacturar}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Facturar seleccionados
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default PrefacturacionPage;
