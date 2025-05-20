import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFacturacion } from "../../context/FacturacionContext";

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
    codigoFactura: "",
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
      filtros.codigoFactura.trim() === ""
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
      setSeleccionados(pagos.map((p) => p.idPagos));
    }
  };

  // Navegar a la vista detallada del pago
  const handleVerPago = (idPago) => {
    navigate(`/pago/${idPago}`);
  };

  // Total acumulado de los seleccionados
  const totalSeleccionado = pagos
    .filter((p) => seleccionados.includes(p.idPagos))
    .reduce((sum, p) => sum + p.valorPago, 0);

  // Generar título de filtro para impresión
  const generarTituloFiltro = () => {
    const partes = [];
    if (filtros.fechaDesde && filtros.fechaHasta) {
      partes.push(`Desde ${filtros.fechaDesde} hasta ${filtros.fechaHasta}`);
    }
    if (filtros.cliente) {
      partes.push(`Cliente: ${filtros.cliente}`);
    }
    if (filtros.codigoFactura) {
      partes.push(`Factura: ${filtros.codigoFactura}`);
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
          <label className="block mb-1 text-sm">Código Factura:</label>
          <input
            type="text"
            placeholder="Código Factura"
            value={filtros.codigoFactura}
            onChange={(e) =>
              setFiltros({ ...filtros, codigoFactura: e.target.value })
            }
            className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={cargarPagos}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
          <button
            onClick={() => window.print()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Imprimir
          </button>
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
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Código Factura</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-center print:hidden">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr
                  key={pago.idPagos}
                  className={`border-t border-gray-700 print:border-black ${
                    seleccionados.includes(pago.idPagos) ? "bg-gray-800" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(pago.idPagos)}
                      onChange={() => toggleSeleccion(pago.idPagos)}
                    />
                  </td>
                  <td className="p-3">{pago.nombreCliente}</td>
                  <td className="p-3">{pago.codigoFactura}</td>
                  <td className="p-3">
                    {new Date(pago.fechaPago).toLocaleDateString()}
                  </td>
                  <td className="p-3">${pago.valorPago.toLocaleString()}</td>
                  <td className="p-3 text-center print:hidden">
                    <button
                      onClick={() => handleVerPago(pago.idPagos)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {pagos.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">
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
