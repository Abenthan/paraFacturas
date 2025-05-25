import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SuspenderSuscripcionPage() {
  const { idSuscripcion } = useParams();
  const { user } = useAuth();
  const usuarioId = user.id;
  const { getSuscripcion, suspenderSuscripcion, suscripcion } =
    useSuscripciones();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos de la suscripción
  useEffect(() => {
    async function fetch() {
      try {
        await getSuscripcion(idSuscripcion);
      } catch (error) {
        console.error("Error al cargar la suscripción:", error);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [idSuscripcion]);

  const handleSuspender = async () => {
    const confirmar = window.confirm("¿Estás seguro de suspender esta suscripción?");
    if (!confirmar) return;

    try {
      const res = await suspenderSuscripcion(idSuscripcion, usuarioId);
      if (res.status === 200) {
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          setSuccessMessage(null);
          navigate(`/carteraSuscripcion/${idSuscripcion}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Error al suspender:", error);
    }
  };

  if (loading || !suscripcion) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Cargando información de la suscripción...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-3xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {/* Volver */}
        <div className="mb-4">
          <Link
            to={`/carteraSuscripcion/${idSuscripcion}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Volver a la suscripción
          </Link>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-4">Suspender Suscripción</h1>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-700 text-white p-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Información de la suscripción */}
        <div className="space-y-2 text-sm text-gray-300 mb-6">
          <p><span className="text-white font-semibold">ID de Suscripción:</span> {idSuscripcion}</p>
          <p><span className="text-white font-semibold">Cliente:</span> {suscripcion.nombreCliente}</p>
          <p><span className="text-white font-semibold">Producto:</span> {suscripcion.nombreProducto}</p>
          <p><span className="text-white font-semibold">Dirección del servicio:</span> {suscripcion.direccionServicio}</p>
          <p><span className="text-white font-semibold">Estado actual:</span> {suscripcion.Estado}</p>
        </div>

        {/* Botón de suspensión */}
        <button
          onClick={handleSuspender}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Confirmar suspensión de esta suscripción
        </button>
      </div>
    </div>
  );
}

export default SuspenderSuscripcionPage;
