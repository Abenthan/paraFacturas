import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function RetiroSuscripcionPage() {
  const { user } = useAuth();
  const { suscripcion, retirarSuscripcion } = useSuscripciones();
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState("");

  const handleRetirar = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas retirar esta suscripción? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;
    const data = {
      idSuscripcion: suscripcion.idSuscripcion,
      usuarioId: user.id,
    };
    try {
      const respuestaRetiro = await retirarSuscripcion(data);
      if (respuestaRetiro.status === 200) {
        setMensajeExito("Suscripción retirada exitosamente.");
        // Redirigir al cliente después de un breve mensaje de éxito
        setTimeout(() => {
          navigate(`/carteraSuscripcion/${suscripcion.idSuscripcion}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error al retirar la suscripción:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {/* Botón de regreso */}
        <div className="mb-4">
          <Link
            to={`/carteraSuscripcion/${suscripcion.idSuscripcion}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Volver a la suscripción
          </Link>
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          {mensajeExito && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-4">
              {mensajeExito}
            </div>
          )}

          <h1 className="text-2xl font-bold mb-1">
            Retiro de la suscripción #{suscripcion.idSuscripcion}
          </h1>
          <p className="text-gray-300">
            Cliente:{" "}
            <span className="text-white font-semibold">
              {suscripcion.nombreCliente}
            </span>
          </p>
          <p className="text-gray-300">
            Producto:{" "}
            <span className="text-white font-semibold">
              {suscripcion.nombreProducto}
            </span>
          </p>
          <p className="text-gray-300">
            Dirección del servicio:{" "}
            <span className="text-white font-semibold">
              {suscripcion.direccionServicio}
            </span>
          </p>
          <p className="text-gray-300">
            Estado de la suscripción:{" "}
            <span className="text-white font-semibold">
              {suscripcion.Estado}
            </span>
          </p>
        </div>

        {/* Botón Tramites */}
        <div className="mb-6">
          {suscripcion.length === 0 ? (
            <p className="text-red-500">No hay suscripciones disponibles.</p>
          ) : (
            <button
              onClick={handleRetirar}
              className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Retirar Suscripción
            </button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-gray-400">
          <p>
            Para retirar una suscripción, asegúrese de que no haya facturas
            pendientes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RetiroSuscripcionPage;
