import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFacturacion } from "../../context/FacturacionContext";
import * as XLSX from "xlsx";

function PagosPage() {
  const { obtenerPagos } = useFacturacion(); // Función para consultar pagos desde el contexto
  const navigate = useNavigate();

  // Estado de la lista de pagos
  const [pagos, setPagos] = useState([]);

  // Filtros para la consulta
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    cliente: "",
    suscripcion: "",
    idPago: "",
  });

  // Estado para mostrar la tabla solo después de buscar
  const [buscado, setBuscado] = useState(false);

  // Lista de pagos seleccionados
  const [seleccionados, setSeleccionados] = useState([]);

  // Cargar pagos filtrados
  const cargarPagos = async () => {
    // Validar fechas: ambos campos deben estar vacíos o llenos
    const { fechaDesde, fechaHasta } = filtros;
    if ((fechaDesde && !fechaHasta) || (!fechaDesde && fechaHasta)) {
      alert(
        "Debe diligenciar ambas fechas: Desde y Hasta, o dejar ambas vacías."
      );
      return;
    }

    // validar que los campos no estén vacíos
    if (
      filtros.fechaDesde.trim() === "" &&
      filtros.fechaHasta.trim() === "" &&
      filtros.cliente.trim() === "" &&
      filtros.suscripcion.trim() === "" &&
      filtros.idPago.trim() === ""
    ) {
      alert("Debe diligenciar al menos un campo en el filtro de busqueda.");
      return;
    }

    try {
      const data = await obtenerPagos(filtros);
      setPagos(data);
      setSeleccionados([]);
      setBuscado(true);
    } catch (error) {
      console.error("Error al cargar pagos:", error);
    }
  };

  // Cambia selección individual
  const toggleSeleccion = (idPago) => {
    setSeleccionados((prev) =>
      prev.includes(idPago)
        ? prev.filter((id) => id !== idPago)
        : [...prev, idPago]
    );
  };

  // Selección general desde encabezado
  const todasSeleccionadas =
    pagos.length > 0 && seleccionados.length === pagos.length;

  const toggleSeleccionarTodas = () => {
    if (todasSeleccionadas) {
      setSeleccionados([]);
    } else {
      setSeleccionados(pagos.map((p) => p.idPago));
    }
  };

  // Navegar a la vista detallada del pago
  const handleVerPago = (idPago) => {
    console.log("Navegando al pago:", idPago);
    navigate(`/pago/${idPago}`);
  };

  // Total acumulado de los seleccionados
  const totalSeleccionado = pagos
    .filter((p) => seleccionados.includes(p.idPago))
    .reduce((sum, p) => sum + p.valorPago, 0);

  const handleImprimir = () => {
    localStorage.setItem("filtrosPagos", JSON.stringify(filtros));
    navigate("/pagos/imprimir");
  };

  const exportarExcel = () => {
    const datos = pagos.map((p) => ({
      "No. Recibo": p.idPago,
      Cliente: p.nombreCliente,
      Suscripción: p.suscripcion_id,
      Fecha: new Date(p.fechaPago).toLocaleDateString("es-CO"),
      Valor: p.valorPago,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    XLSX.writeFile(wb, "pagos.xlsx");
  };

  // Generar título de filtro para impresión
  const generarTituloFiltro = () => {
    const partes = [];
    if (filtros.fechaDesde && filtros.fechaHasta) {
      partes.push(`Desde ${filtros.fechaDesde} hasta ${filtros.fechaHasta}`);
    }
    if (filtros.cliente) {
      partes.push(`Cliente: ${filtros.cliente}`);
    }
    if (filtros.suscripcion) {
      partes.push(`Suscripcion: ${filtros.suscripcion}`);
    }
    return partes.length > 0 ? partes.join(" | ") : "Todos los pagos";
  };

  return (
    <div className="container mx-auto p-6 text-white print:text-black print:bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center print:hidden">
        Pagos Registrados
      </h1>

      {/* Filtros de búsqueda */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center print:hidden">
        <div>
          <label className="block mb-1 text-sm">Desde:</label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) =>
              setFiltros({ ...filtros, fechaDesde: e.target.value })
            }
            className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Hasta:</label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) =>
              setFiltros({ ...filtros, fechaHasta: e.target.value })
            }
            className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Cliente:</label>
          <input
            type="text"
            placeholder="Cliente"
            value={filtros.cliente}
            onChange={(e) =>
              setFiltros({ ...filtros, cliente: e.target.value })
            }
            className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Suscripción:</label>
          <input
            type="text"
            placeholder="Suscripción"
            value={filtros.suscripcion}
            onChange={(e) =>
              setFiltros({ ...filtros, suscripcion: e.target.value })
            }
            className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">No. Recibo:</label>
          <input
            type="number"
            placeholder="No. Recibo"
            value={filtros.idPago}
            onChange={(e) =>
              setFiltros({ ...filtros, idPago: e.target.value })
            }
            className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded w-32"
          />
        </div>

        <div className="flex items-end gap-2">
          {/* Buscar */}
          <div className="relative group">
            <button
              onClick={cargarPagos}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Buscar
            </span>
          </div>

          {/* Exportar a Excel */}
          <div className="relative group">
            <button
              onClick={exportarExcel}
              disabled={!buscado || pagos.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0-3.5-3.5M12 15l3.5-3.5M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
              </svg>
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Exportar a Excel
            </span>
          </div>

          {/* Imprimir */}
          <div className="relative group">
            <button
              onClick={handleImprimir}
              disabled={!buscado || pagos.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-2 0H8v4h8v-4z" />
              </svg>
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Imprimir
            </span>
          </div>
        </div>
      </div>

      {/* Informe de pagos */}
      {buscado && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-center print:text-left">
            {generarTituloFiltro()}
          </h2>

          <table className="min-w-full bg-gray-900 border border-gray-700 rounded shadow print:text-black print:bg-white print:border-black">
            <thead className="bg-gray-800 print:bg-white print:border-b print:border-black">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={todasSeleccionadas}
                    onChange={toggleSeleccionarTodas}
                  />
                </th>
                <th className="p-3 text-left">No. Recibo</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Suscripción</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-center print:hidden">Ver</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr
                  key={pago.idPago}
                  className={`border-t border-gray-700 print:border-black ${
                    seleccionados.includes(pago.idPago) ? "bg-gray-800" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(pago.idPago)}
                      onChange={() => toggleSeleccion(pago.idPago)}
                    />
                  </td>
                  <td className="p-3">{pago.idPago}</td>
                  <td className="p-3">{pago.nombreCliente}</td>
                  <td className="p-3">{pago.suscripcion_id}</td>
                  <td className="p-3">
                    {new Date(pago.fechaPago).toLocaleDateString()}
                  </td>
                  <td className="p-3">${pago.valorPago.toLocaleString()}</td>
                  <td className="p-3 text-center print:hidden">
                    <button
                      onClick={() => handleVerPago(pago.idPago)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-4">
                    No se encontraron pagos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total seleccionado */}
          {seleccionados.length > 0 && (
            <div className="mt-4 text-right text-lg font-semibold text-white print:text-black">
              Total seleccionado: ${totalSeleccionado.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PagosPage;
