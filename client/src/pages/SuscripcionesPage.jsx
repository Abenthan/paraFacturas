import { useClientes } from "../context/ClientesContext";
import { useSuscripciones } from "../context/SuscripcionesContext";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Suscripciones() {
  const params = useParams();
  const { getCliente } = useClientes();
  const [cliente, setCliente] = useState(null);
  const { getSuscripciones } = useSuscripciones();

  useEffect(() => {
    async function loadCliente() {
      if (params.id) {
        const clienteData = await getCliente(params.id);
        if (clienteData) {
          setCliente(clienteData);
        }
      }
    }
    loadCliente();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {/* Enlaces superiores */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to={`/cliente/${params.id}`}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Volver al cliente
          </Link>
          <Link
            to={`/crearSuscripcion/${params.id}`}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            + Crear Suscripción
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Suscripciones</h1>

        {cliente && (
          <p className="text-gray-300 mb-4">
            Cliente: <span className="font-semibold text-white">{cliente.nombreCliente}</span>
          </p>
        )}

        {/* Tabla de suscripciones */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Fecha de inicio</th>
                <th className="px-4 py-3">Fecha de fin</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí puedes mapear las suscripciones del cliente */}
              {/* Ejemplo de fila estática: */}
              <tr className="border-b border-zinc-700 hover:bg-zinc-700">
                <td className="px-4 py-2">Servicio Básico</td>
                <td className="px-4 py-2">2025-01-01</td>
                <td className="px-4 py-2">2025-12-31</td>
                <td className="px-4 py-2">Activo</td>
                <td className="px-4 py-2">
                  <Link to="#" className="text-blue-400 hover:text-blue-300">Editar</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Suscripciones;
