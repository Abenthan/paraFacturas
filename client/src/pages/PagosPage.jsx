import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFacturacion } from "../context/FacturacionContext";

function PagosPage() {
  const { obtenerPagos } = useFacturacion(); // Debes tener esta función en tu contexto
  const navigate = useNavigate();

  const [pagos, setPagos] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    cliente: "",
    codigoFactura: "",
  });
  const [seleccionados, setSeleccionados] = useState([]);

  // Cargar pagos filtrados
  const cargarPagos = async () => {
    try {
      const data = await obtenerPagos(filtros);
      setPagos(data);
      setSeleccionados([]);
    } catch (error) {
      console.error("Error al cargar pagos:", error);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const toggleSeleccion = (idPago) => {
    setSeleccionados((prev) =>
      prev.includes(idPago)
        ? prev.filter((id) => id !== idPago)
        : [...prev, idPago]
    );
  };

  const totalSeleccionado = pagos
    .filter((p) => seleccionados.includes(p.idPagos))
    .reduce((sum, p) => sum + p.valorPago, 0);

  const handleVerPago = (idPago) => {
    navigate(`/pago/${idPago}`);
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Pagos Registrados</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
          className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          placeholder="Desde"
        />
        <input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
          className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
          placeholder="Hasta"
        />
        <input
          type="text"
          placeholder="Cliente"
          value={filtros.cliente}
          onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
          className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Código Factura"
          value={filtros.codigoFactura}
          onChange={(e) => setFiltros({ ...filtros, codigoFactura: e.target.value })}
          className="bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded"
        />
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 border border-gray-700 rounded shadow">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Código Factura</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Valor</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, index) => (
              <tr
                key={pago.idPagos}
                className={`border-t border-gray-700 ${
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
                <td className="p-3">{pago.codigoFactura}</td>
                <td className="p-3">{new Date(pago.fechaPago).toLocaleDateString()}</td>
                <td className="p-3">${pago.valorPago.toLocaleString()}</td>
                <td className="p-3 text-center">
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
                <td colSpan="5" className="text-center text-gray-400 py-4">
                  No se encontraron pagos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totales seleccionados */}
      {seleccionados.length > 0 && (
        <div className="mt-4 text-right text-lg font-semibold text-white">
          Total seleccionado: ${totalSeleccionado.toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default PagosPage;
