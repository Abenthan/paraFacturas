import { useState, useEffect } from "react";
import { useFacturacion } from "../../context/FacturacionContext";
import { useNavigate, Link } from "react-router-dom";

function CarteraPage() {
  const { obtenerCartera } = useFacturacion();
  const navigate = useNavigate();

  // Filtros de búsqueda
  const [estadoSuscripcion, setEstadoSuscripcion] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [idSuscripcion, setIdSuscripcion] = useState("");

  // Datos y estado de la UI
  const [cartera, setCartera] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Obtener datos desde el backend
  const obtenerDatos = async (filtros = {}) => {
    setLoading(true);
    try {
      const data = await obtenerCartera(filtros);
      setCartera(data);
    } catch (error) {
      console.error("Error obteniendo cartera:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    obtenerDatos();
  }, []);

  // Aplicar filtros manualmente
  const handleFiltrar = () => {
    obtenerDatos({
      estado: estadoSuscripcion,
      cliente: nombreCliente,
      idSuscripcion,
    });
  };

 // Ordenamiento de columnas
  const handleSort = (campo) => {
    if (campo === sortBy) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(campo);
      setSortAsc(true);
    }
  };

  // Ordenar datos en frontend
  const sortedData = [...cartera].sort((a, b) => {
    if (!sortBy) return 0;
    const x = a[sortBy];
    const y = b[sortBy];
    if (typeof x === "number") return sortAsc ? x - y : y - x;
    return sortAsc ? x.localeCompare(y) : y.localeCompare(x);
  });

  // Calcular total de la cartera (solo saldo pendiente)
  const totalCartera = cartera.reduce((acc, item) => acc + Number(item.saldoPendiente), 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Cartera</h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center mb-8">
        <select
          value={estadoSuscripcion}
          onChange={(e) => setEstadoSuscripcion(e.target.value)}
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
          placeholder="Nombre del cliente..."
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        />

        <input
          type="text"
          placeholder="ID Suscripción..."
          value={idSuscripcion}
          onChange={(e) => setIdSuscripcion(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        />

        <button
          onClick={handleFiltrar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Filtrar
        </button>
      </div>

      {/* Tabla de resultados */}
      {loading ? (
        <div className="text-center text-xl text-white">Cargando...</div>
      ) : cartera.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white">
            <thead className="bg-gray-800">
              <tr>
                {[
                  { label: "Número de Suscripcion", campo: "idSuscripcion" },
                  { label: "Cliente", campo: "nombreCliente" },
                  { label: "Producto", campo: "nombreProducto" },
                  { label: "Dirección", campo: "direccionServicio" },
                  { label: "Estado", campo: "estadoSuscripcion" },
                  { label: "Total Facturado", campo: "totalFacturado" },
                  { label: "Total Pagado", campo: "totalPagado" },
                  { label: "Saldo", campo: "saldoPendiente" },
                  { label: "Cant. Facturas", campo: "cantidadFacturas" },
                  { label: "Ver", campo: null },
                ].map(({ label, campo }) => (
                  <th
                    key={label}
                    onClick={() => campo && handleSort(campo)}
                    className={`p-3 text-left ${campo ? "cursor-pointer hover:underline" : ""}`}
                  >
                    {label} {campo === sortBy ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.idSuscripcion} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{item.idSuscripcion}</td>
                  <td className="p-3">{item.nombreCliente}</td>
                  <td className="p-3">{item.nombreProducto}</td>
                  <td className="p-3">{item.direccionServicio}</td>
                  <td className="p-3">{item.estadoSuscripcion}</td>
                  <td className="p-3">${Number(item.totalFacturado).toLocaleString()}</td>
                  <td className="p-3">${Number(item.totalPagado).toLocaleString()}</td>
                  <td className="p-3">${Number(item.saldoPendiente).toLocaleString()}</td>
                  <td className="p-3">{item.cantidadFacturas}</td>
                  <td className="p-3">
                    <Link
                      to={`/carteraSuscripcion/${item.idSuscripcion}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-800 font-bold">
                <td colSpan={7} className="p-3 text-right">Total cartera:</td>
                <td className="p-3">${totalCartera.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-xl text-white">No hay suscripciones con facturas pendientes.</div>
      )}
    </div>
  );
}

export default CarteraPage;
