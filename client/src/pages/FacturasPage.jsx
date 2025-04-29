import { useState } from "react";
import { useFacturacion } from "../context/FacturacionContext"; 
import { useNavigate } from "react-router-dom";

function FacturasPage() {
  const navigate = useNavigate();

  // Obtenemos la función del context que consulta facturas con filtros
  const { obtenerFacturas } = useFacturacion();

  // Estados para los filtros
  const [year, setYear] = useState("");
  const [mes, setMes] = useState("");
  const [estado, setEstado] = useState("");
  const [buscarCliente, setBuscarCliente] = useState("");

  // Estado para la lista de facturas y el loading
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ejecuta la búsqueda de facturas con filtros aplicados
  const handleBuscar = async () => {
    setLoading(true);
    try {
      const data = await obtenerFacturas({ 
        year: Number(year), // Convertimos a número para evitar errores con MySQL
        mes: Number(mes),
        estado,
        cliente: buscarCliente 
      });
      setFacturas(data);
    } catch (error) {
      console.error("Error buscando facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Redirecciona a la página de detalle de la factura
  const handleVerFactura = (idFactura) => {
    navigate(`/factura/${idFactura}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Facturas
      </h1>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center mb-8">
        {/* Selector de año */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Seleccione Año</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>

        {/* Selector de mes */}
        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        >
          <option value="">Seleccione Mes</option>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        {/* Selector de estado */}
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

        {/* Campo para buscar por nombre de cliente */}
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={buscarCliente}
          onChange={(e) => setBuscarCliente(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
        />

        {/* Botón para aplicar los filtros */}
        <button
          onClick={handleBuscar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Buscar Facturas
        </button>
      </div>

      {/* Tabla de resultados o mensajes */}
      {loading ? (
        <div className="text-center text-xl text-white">Cargando...</div>
      ) : (
        facturas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white">
              <thead className="bg-gray-800">
                <tr>
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
                  <tr
                    key={factura.idFactura}
                    className="border-t border-gray-700 hover:bg-gray-800"
                  >
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
          <div className="text-center text-xl text-white">
            No se encontraron facturas.
          </div>
        )
      )}
    </div>
  );
}

export default FacturasPage;

