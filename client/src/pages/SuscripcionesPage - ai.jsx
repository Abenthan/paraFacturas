import { useClientes } from "../context/ClientesContext";
import { useSuscripciones } from "../context/SuscripcionesContext";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Suscripciones() {
  const params = useParams();
  const { getCliente } = useClientes();
  const { getSuscripciones, suscripciones } = useSuscripciones();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar cliente y suscripciones en paralelo
  useEffect(() => {
    async function loadData() {
      if (params.id) {
        try {
          const [clienteData] = await Promise.all([
            getCliente(params.id),
            getSuscripciones(params.id),
          ]);

          if (clienteData) {
            setCliente(clienteData);
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando información del cliente...
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        No se encontró el cliente solicitado.
      </div>
    );
  }

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

        <p className="text-gray-300">Suscripciones de:</p>
        <h2 className="text-2xl font-bold text-white mb-4">
          {cliente.nombreCliente}
        </h2>

        {/* Tabla de suscripciones */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Dirección de Servicio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suscripciones && suscripciones.length > 0 ? (
                suscripciones.map((suscripcion) => (
                  <tr
                    key={suscripcion.id}
                    className="border-b border-zinc-700 hover:bg-zinc-700"
                  >
                    <td className="px-4 py-3">{suscripcion.producto}</td>
                    <td className="px-4 py-3">
                      {suscripcion.direccionServicio}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          suscripcion.estado === "Activa"
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {suscripcion.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/editarSuscripcion/${suscripcion.id}`}
                        className="text-blue-400 hover:text-blue-300 mr-2"
                      >
                        Editar
                      </Link>
                      <button className="text-red-400 hover:text-red-300">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-center text-gray-400"
                  >
                    No hay suscripciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Suscripciones;
