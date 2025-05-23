import { useClientes } from "../../context/ClientesContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ClientesPage() {
  const { getClientes, clientes, setCliente } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        await getClientes();
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter((clienteDatos) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      clienteDatos.numeroId.toLowerCase().includes(searchLower) ||
      clienteDatos.nombreCliente.toLowerCase().includes(searchLower)
    );
  });

  const handleVer = (clienteDatos) => {
    setCliente(clienteDatos);
    navigate(`/cliente/${clienteDatos.idCliente}`);
  };

  const handleSuscripciones = (clienteDatos) => {
    setCliente(clienteDatos);
    navigate(`/suscripciones/${clienteDatos.idCliente}`);
  };
  const handleCuenta = (clienteDatos) => {
    setCliente(clienteDatos);
    navigate(`/estadoCuentaCliente/${clienteDatos.idCliente}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-2/3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Clientes
            </h1>
            <p className="text-gray-400">Gestión de clientes registrados</p>
          </div>

          <div className="w-full sm:w-1/3 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 border border-zinc-700 transition duration-200"
            />

            <Link
              to="/nuevoCliente"
              className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Cliente
            </Link>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700">
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredClientes.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {searchTerm
                ? "No se encontraron clientes"
                : "No hay clientes registrados"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Identificación
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {filteredClientes.map((clienteDatos) => (
                    <tr
                      key={clienteDatos.idCliente}
                      className="hover:bg-zinc-700/30 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {clienteDatos.numeroId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {clienteDatos.nombreCliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {clienteDatos.telefono}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleVer(clienteDatos)}
                            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition duration-200 flex items-center"
                          >
                            Ver
                          </button>
                          <span className="text-gray-500">|</span>
                          <button
                            onClick={() => handleSuscripciones(clienteDatos)}
                            className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer transition duration-200 flex items-center"
                          >
                            Suscripciones
                          </button>
                          <span className="text-gray-500">|</span>
                          <button
                            onClick={() => handleCuenta(clienteDatos)}
                            className="text-green-600 hover:text-green-300 hover:underline cursor-pointer transition duration-200 flex items-center"
                          >
                            Estado de cuenta
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientesPage;
