import { useState } from "react";
import { useFacturacion } from "../../context/FacturacionContext";
import { useNavigate } from "react-router-dom";

function PrefacturacionPage() {
  const navigate = useNavigate();

  const { obtenerRegistrosPrefacturacion, generarFacturas } = useFacturacion();

  const [year, setYear] = useState("");
  const [mes, setMes] = useState("");
  const [buscarCliente, setBuscarCliente] = useState("");
  const [registros, setRegistros] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
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
      await generarFacturas(seleccionados, year, mes);
      alert("Facturación generada exitosamente.");
      navigate("/facturacion");
    } catch (error) {
      console.error("Error generando facturación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
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

        <input
          type="text"
          placeholder="Buscar cliente..."
          value={buscarCliente}
          onChange={(e) => setBuscarCliente(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
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
        registros.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.length === registros.length}
                      onChange={handleSeleccionarTodos}
                      className="w-4 h-4"
                    />
                  </th>
                  <th
                    className="p-3 text-left cursor-pointer hover:underline"
                    onClick={() => setOrdenAscendente(!ordenAscendente)}
                  >
                    Cliente
                  </th>
                  <th className="p-3 text-left">Producto</th>
                  <th className="p-3 text-left">Dirección</th>
                  <th className="p-3 text-left">Valor</th>
                </tr>
              </thead>
              <tbody>
                {registros
                  .filter((r) =>
                    r.nombreCliente
                      .toLowerCase()
                      .includes(buscarCliente.toLowerCase())
                  )
                  .sort((a, b) => {
                    if (ordenAscendente) {
                      return a.nombreCliente.localeCompare(b.nombreCliente);
                    } else {
                      return b.nombreCliente.localeCompare(a.nombreCliente);
                    }
                  })
                  .map((registro) => (
                    <tr
                      key={registro.idSuscripcion}
                      className="border-t border-gray-700 hover:bg-gray-800"
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(
                            registro.idSuscripcion
                          )}
                          onChange={() =>
                            handleSeleccionar(registro.idSuscripcion)
                          }
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="p-3">{registro.nombreCliente}</td>
                      <td className="p-3">{registro.nombreProducto}</td>
                      <td className="p-3">{registro.direccionServicio}</td>
                      <td className="p-3">
                        ${registro.valor.toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Resumen y botón */}
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
