import { useClientes } from "../context/ClientesContext";
import { useParams, Link } from "react-router-dom";

function ClientePage() {
  const { cliente } = useClientes();
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Enlaces de navegación */}

      {/* Enlace para volver al listado */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <Link
          to="/clientes"
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver al listado
        </Link>
        {/* Enlace para Suscripciones */}
        <div className="flex gap-4">
          <Link
            to={`/Suscripciones/${params.id}`}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Suscripciones
          </Link>

          {/* Enlace para Estado de cuenta */}
          <Link
            to={`/clientes/${params.id}/estado-cuenta`}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Estado de cuenta
          </Link>
        </div>
      </div>
      <p>Cliente:</p>
      <h2 className="text-2xl font-bold text-white mb-4">
        {cliente?.nombreCliente}
      </h2>
    </div>
  );
}

export default ClientePage;
