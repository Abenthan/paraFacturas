import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SuscripcionesPage() {
  const { getSuscripciones, suscripciones } = useSuscripciones();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState({ campo: "idSuscripcion", direccion: "asc" });
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        await getSuscripciones();
      } catch (error) {
        console.error("Error al obtener suscripciones:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cambiarOrden = (campo) => {
    const nuevaDireccion =
      orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ campo, direccion: nuevaDireccion });
  };

  const filtrarSuscripciones = () => {
    return suscripciones
      .filter((s) =>
        !filtro ||
        s.idSuscripcion.toString().includes(filtro) ||
        s.nombreCliente.toLowerCase().includes(filtro.toLowerCase())
      )
      .sort((a, b) => {
        let valorA = a[orden.campo];
        let valorB = b[orden.campo];
        if (typeof valorA === "string") valorA = valorA.toLowerCase();
        if (typeof valorB === "string") valorB = valorB.toLowerCase();
        if (valorA < valorB) return orden.direccion === "asc" ? -1 : 1;
        if (valorA > valorB) return orden.direccion === "asc" ? 1 : -1;
        return 0;
      });
  };

  const suscripcionesFiltradas = filtrarSuscripciones();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Cargando suscripciones...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-6xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold shrink-0">Suscripciones</h1>
          <input
            type="text"
            placeholder="Buscar por ID o nombre de cliente"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => navigate("/suscripciones/imprimir")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm shrink-0"
          >
            Imprimir
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => cambiarOrden("idSuscripcion")}
                >
                  ID {orden.campo === "idSuscripcion" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => cambiarOrden("nombreCliente")}
                >
                  Cliente {orden.campo === "nombreCliente" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Dirección del servicio</th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => cambiarOrden("Estado")}
                >
                  Estado {orden.campo === "Estado" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {suscripcionesFiltradas.map((s) => (
                <tr key={s.idSuscripcion} className="border-b border-zinc-700 hover:bg-zinc-700">
                  <td className="px-4 py-2">{s.idSuscripcion}</td>
                  <td className="px-4 py-2">{s.nombreCliente}</td>
                  <td className="px-4 py-2">{s.nombreProducto}</td>
                  <td className="px-4 py-2">{s.direccionServicio}</td>
                  <td className="px-4 py-2">{s.Estado}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/carteraSuscripcion/${s.idSuscripcion}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
              {suscripcionesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No se encontraron suscripciones con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuscripcionesPage;
