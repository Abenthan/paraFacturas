import { useClientes } from "../context/ClientesContext";
import { useEffect, useState } from "react";

function ClientesPage() {
  const { getClientes, clientes } = useClientes();
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  // Obtener los clientes al cargar la página
  useEffect(() => {
    getClientes();
  }, []);

  // Filtrar clientes según el término de búsqueda
  const filteredClientes = clientes.filter((cliente) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.codigo.toLowerCase().includes(searchLower) ||
      cliente.numeroId.toLowerCase().includes(searchLower) ||
      cliente.nombreCliente.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Barra de búsqueda */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Buscar por código, identificación o nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de clientes */}
      <div className="max-w-4xl mx-auto bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-700">
            <tr>
              <th className="px-4 py-3 text-left text-white">Código</th>
              <th className="px-4 py-3 text-left text-white">Identificación</th>
              <th className="px-4 py-3 text-left text-white">Nombre del Cliente</th>
              <th className="px-4 py-3 text-left text-white">Teléfono</th>
              <th className="px-4 py-3 text-left text-white">Dirección</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr
                key={cliente.idCliente}
                className="border-b border-zinc-700 hover:bg-zinc-700 transition duration-300"
              >
                <td className="px-4 py-3 text-white">{cliente.codigo}</td>
                <td className="px-4 py-3 text-white">{cliente.numeroId}</td>
                <td className="px-4 py-3 text-white">{cliente.nombreCliente}</td>
                <td className="px-4 py-3 text-white">{cliente.telefono}</td>
                <td className="px-4 py-3 text-white">{cliente.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientesPage;