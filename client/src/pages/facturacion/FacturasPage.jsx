import { useState } from "react";
import { useFacturacion } from "../../context/FacturacionContext"; 
import { useNavigate } from "react-router-dom";

function FacturasPage() {
  const navigate = useNavigate();
  const { obtenerFacturas } = useFacturacion();

  // Filtros
  const [year, setYear] = useState("");
  const [mes, setMes] = useState("");
  const [estado, setEstado] = useState("");
  const [buscarCliente, setBuscarCliente] = useState("");
  const [codigoFactura, setCodigoFactura] = useState("");

  // Resultados
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const data = await obtenerFacturas({ 
        year: Number(year),
        mes: Number(mes),
        estado,
        cliente: buscarCliente,
        codigoFactura
      });
      setFacturas(data);
    } catch (error) {
      console.error("Error buscando facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerFactura = (idFactura) => {
    navigate(`/factura/${idFactura}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Facturas</h1>

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
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ].map((m, i) => (
            <option key={i} value={(i + 1).toString().padStart(2, "0")}>{m}</option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
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
          placeholder="Buscar cliente..."
          value={buscarCliente}
          onChange={(e) => setBuscarCliente(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        />

        <input
          type="text"
          placeholder="Código de factura..."
          value={codigoFactura}
          onChange={(e) => setCodigoFactura(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        />

        <button
          onClick={handleBuscar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Buscar Facturas
        </button>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center text-xl text-white">Cargando...</div>
      ) : facturas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Dirección</th>
                <th className="p-3 text-left">Valor</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.idFactura} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{factura.codigoFactura}</td>
                  <td className="p-3">{factura.nombreCliente}</td>
                  <td className="p-3">{factura.nombreProducto}</td>
                  <td className="p-3">{factura.direccionServicio}</td>
                  <td className="p-3">${factura.valor.toLocaleString()}</td>
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
          </table>
        </div>
      ) : (
        <div className="text-center text-xl text-white">No se encontraron facturas.</div>
      )}
    </div>
  );
}

export default FacturasPage;
