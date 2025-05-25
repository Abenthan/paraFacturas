import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SuspenderSuscripcionPage() {
  const { idSuscripcion } = useParams();
  const { user } = useAuth();
  const usuarioId = user.id;
  const { getSuscripcion, suspenderSuscripcion, suscripcion } =
    useSuscripciones();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    try {
      const fetchSuscripcion = async () => {
        await getSuscripcion(idSuscripcion);
      };
      fetchSuscripcion();
    } catch (error) {
      console.error("Error fetching suscripcion:", error);
    }
  }, [idSuscripcion]);

  if (!suscripcion) {
    return <div>Cargando...</div>;
  }

  const handleSuspender = async () => {
    // confirmacion
    const confirmSuspension = window.confirm(
      "¿Estás seguro de que deseas suspender esta suscripción?"
    );

    if (!confirmSuspension) return;

    try {
      // Llamar a la función de suspenderSuscripcion y pasar el idSuscripcion y usuarioId
      const res = await suspenderSuscripcion(idSuscripcion, usuarioId);
      if (res.status === 200) {
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          setSuccessMessage(null);
          navigate(`/carteraSuscripcion/${idSuscripcion}`);
        }, 3000); // Ocultar el mensaje después de 3 segundos
      }
    } catch (error) {
      console.error("Error suspending subscription:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <Link
          to={`/carteraSuscripcion/${idSuscripcion}`}
          className="text-blue-500 underline"
        >
          Volver a la suscripción
        </Link>
      </div>
      {successMessage && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded">
          {successMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Suspender Suscripción</h1>
      <p className="mb-2">ID de Suscripción: {idSuscripcion}</p>
      <p className="mb-2">Cliente: {suscripcion.nombreCliente}</p>
      <p className="mb-2">Producto: {suscripcion.nombreProducto}</p>
      <p className="mb-2">
        Direccion del servicio: {suscripcion.direccionServicio}
      </p>
      <p className="mb-2">Estado: {suscripcion.Estado}</p>
      {/* Aquí puedes agregar más detalles de la suscripción */}

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleSuspender}
      >
        Suspender Suscripción
      </button>
    </div>
  );
}

export default SuspenderSuscripcionPage;
