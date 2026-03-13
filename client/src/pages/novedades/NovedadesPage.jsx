import { useState } from "react";
import { getNovedadesRequest } from "../../api/novedadesApi.js";

function NovedadesPage() {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [orden, setOrden] = useState({ campo: "idNovedad", direccion: "asc" });

  const [buscar, setBuscar] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const handleBuscar = async () => {
    // Validar que al menos un filtro esté configurado
    if (!buscar.trim() && !fechaDesde && !fechaHasta) {
      alert("Debe diligenciar al menos un campo de búsqueda.");
      return;
    }
    // Validar rango de fechas
    if ((fechaDesde && !fechaHasta) || (!fechaDesde && fechaHasta)) {
      alert("Debe diligenciar ambas fechas: Desde y Hasta, o dejar ambas vacías.");
      return;
    }

    setLoading(true);
    try {
      const filtros = {};
      if (buscar.trim()) filtros.buscar = buscar.trim();
      if (fechaDesde) filtros.fechaDesde = fechaDesde;
      if (fechaHasta) filtros.fechaHasta = fechaHasta;

      const response = await getNovedadesRequest(filtros);
      setNovedades(response.data);
    } catch (error) {
      if (error.response?.status === 204) {
        setNovedades([]);
      } else {
        console.error("Error fetching novedades:", error);
      }
    } finally {
      setLoading(false);
      setBuscado(true);
    }
  };

  const cambiarOrden = (campo) => {
    const nuevaDireccion =
      orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ campo, direccion: nuevaDireccion });
  };

  const novedadesOrdenadas = [...novedades].sort((a, b) => {
    let valorA = a[orden.campo];
    let valorB = b[orden.campo];
    if (typeof valorA === "string") valorA = valorA.toLowerCase();
    if (typeof valorB === "string") valorB = valorB.toLowerCase();
    if (valorA < valorB) return orden.direccion === "asc" ? -1 : 1;
    if (valorA > valorB) return orden.direccion === "asc" ? 1 : -1;
    return 0;
  });

  const indicador = (campo) =>
    orden.campo === campo ? (orden.direccion === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-6xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Historial de Novedades</h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block text-sm mb-1">Suscripción o Cliente:</label>
            <input
              type="text"
              placeholder="ID suscripción o nombre del cliente"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Desde:</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Hasta:</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-4 py-2 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleBuscar}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setBuscar("");
              setFechaDesde("");
              setFechaHasta("");
              setNovedades([]);
              setBuscado(false);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
          >
            Limpiar
          </button>
        </div>

        {/* Resultados */}
        {!buscado ? (
          <div className="text-center text-gray-400 py-10">
            Configure los filtros y presione Buscar para ver los resultados.
          </div>
        ) : loading ? (
          <div className="text-center text-gray-300 py-10">Cargando novedades...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
                <tr>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("idNovedad")}>
                    ID{indicador("idNovedad")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("novedad")}>
                    Novedad{indicador("novedad")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("fechaNovedad")}>
                    Fecha{indicador("fechaNovedad")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("suscripcion_id")}>
                    Suscripción{indicador("suscripcion_id")}
                  </th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => cambiarOrden("nombreCliente")}>
                    Cliente{indicador("nombreCliente")}
                  </th>
                  <th className="px-4 py-3">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {novedadesOrdenadas.map((n) => (
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
                {novedadesOrdenadas.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      No se encontraron novedades con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default NovedadesPage;
