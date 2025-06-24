import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ReactivacionPage() {
  const { user } = useAuth();
  const { suscripcion, reactivarSuscripcion } = useSuscripciones();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleReactivacion = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas reactivar esta suscripción? \nSe generará una factura por el reinicio del servicio."
    );
    if (confirmar) {
      const data = {
        idSuscripcion: suscripcion.idSuscripcion,
        usuarioId: user.id,
      };
      try {
        const respuestaReactivacion = await reactivarSuscripcion(data);
        if (respuestaReactivacion.status === 200) {
          setMensaje(respuestaReactivacion.message);
          setError("");
          // Redirigir a la página de carteraSuscripcion después de 2 segundos
          setTimeout(() => {
            navigate(`/carteraSuscripcion/${suscripcion.idSuscripcion}`);
          }, 2000);
        } else {
          setError(respuestaReactivacion.message);
          setMensaje("");
        }
      } catch (err) {
        setError("Error al reactivar la suscripción. Inténtalo de nuevo.");
        setMensaje("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {suscripcion?.idSuscripcion ? (
          <div>
            <Link
              to={`/carteraSuscripcion/${suscripcion.idSuscripcion}`}
              className="text-blue-400 hover:text-blue-300 text-sm mb-4"
            >
              ← ir a la suscripcion
            </Link>
            {/* Título */}
            <h1 className="text-2xl font-bold mb-4">Reactivar Suscripción</h1>

            {/* Mensajes */}
            {error && (
              <div className="bg-red-700 text-white p-3 rounded mb-4">
                {error}
              </div>
            )}
            {mensaje && (
              <div className="bg-green-700 text-white p-3 rounded mb-4">
                {mensaje}
              </div>
            )}
            {/* Datos de suscripción */}
            <div className="space-y-2 text-sm text-gray-300 mb-6">
              <p>
                <span className="text-white font-semibold">
                  ID Suscripción:
                </span>{" "}
                {suscripcion.idSuscripcion}
              </p>
              <p>
                <span className="text-white font-semibold">Cliente:</span>{" "}
                {suscripcion.nombreCliente}
              </p>
              <p>
                <span className="text-white font-semibold">Producto:</span>{" "}
                {suscripcion.nombreProducto}
              </p>
              <p>
                <span className="text-white font-semibold">
                  Dirección del servicio:
                </span>{" "}
                {suscripcion.direccionServicio}
              </p>
              <p>
                <span className="text-white font-semibold">Estado:</span>{" "}
                {suscripcion.Estado}
              </p>
            </div>

            <p className="mb-4 text-gray-100">
              <strong className="block mb-2 text-lg font-medium text-white">
                ¿Deseas reactivar tu suscripción?
              </strong>
              Al confirmar, se generará automáticamente una factura por el
              reinicio del servicio.
              <br />
              ¿Quieres continuar con el proceso?
            </p>

            {/* Boton Reactivacion */}
            <button
              onClick={() => {
                handleReactivacion();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Reactivar Suscripción
            </button>
          </div>
        ) : (
          <div>
            <Link
              to="/suscripciones"
              className="text-blue-400 hover:text-blue-300 text-sm mb-4"
            >
              ← ir a suscripciones
            </Link>
            <p className="m-4 p-4">No hay una suscripción activa.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReactivacionPage;
