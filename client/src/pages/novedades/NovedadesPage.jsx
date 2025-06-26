import { getNovedadesRequest } from "../../api/novedadesApi.js";
import { useEffect, useState, useRef } from "react";

function NovedadesPage() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orden, setOrden] = useState({ campo: "idNovedad", direccion: "asc" });
  const [filtros, setFiltros] = useState({
    suscripcion_id: "",
    nombreCliente: "",
  });

  const tablaRef = useRef();

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const response = await getNovedadesRequest();
        setNovedades(response.data);
      } catch (error) {
        console.error("Error fetching novedades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNovedades();
  }, []);

  const cambiarOrden = (campo) => {
    const nuevaDireccion =
      orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ campo, direccion: nuevaDireccion });
  };

  const filtrarNovedades = () => {
    return novedades
      .filter((n) =>
        (!filtros.suscripcion_id || n.suscripcion_id.toString().includes(filtros.suscripcion_id)) &&
        (!filtros.nombreCliente ||
          n.nombreCliente.toLowerCase().includes(filtros.nombreCliente.toLowerCase()))
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

  const novedadesFiltradas = filtrarNovedades();



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Cargando novedades...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-6xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Historial de Novedades</h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por ID suscripción"
            value={filtros.suscripcion_id}
            onChange={(e) => setFiltros({ ...filtros, suscripcion_id: e.target.value })}
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Buscar por nombre de cliente"
            value={filtros.nombreCliente}
            onChange={(e) => setFiltros({ ...filtros, nombreCliente: e.target.value })}
            className="px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("idNovedad")}>
                  ID {orden.campo === "idNovedad" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("novedad")}>
                  Novedad {orden.campo === "novedad" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("fechaNovedad")}>
                  Fecha {orden.campo === "fechaNovedad" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("suscripcion_id")}>
                  Suscripción {orden.campo === "suscripcion_id" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("nombreCliente")}>
                  Cliente {orden.campo === "nombreCliente" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {novedadesFiltradas.map((n) => (
                <tr key={n.idNovedad} className="border-b border-zinc-700 hover:bg-zinc-700">
                  <td className="px-4 py-2">{n.idNovedad}</td>
                  <td className="px-4 py-2">{n.novedad}</td>
                  <td className="px-4 py-2">
                    {new Date(n.fechaNovedad).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-4 py-2">{n.suscripcion_id}</td>
                  <td className="px-4 py-2">{n.nombreCliente}</td>
                  <td className="px-4 py-2">{n.descripcionNovedad}</td>
                </tr>
              ))}
              {novedadesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-400">
                    No se encontraron novedades con los filtros aplicados.
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

export default NovedadesPage;
