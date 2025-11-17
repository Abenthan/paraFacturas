import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function ReconexionPage() {
  const { user } = useAuth();
  const {
    suscripcion,
    obtenerFacturaReconexion,
    insertarFacturaReconexion,
    reconexionSuscripcion,
  } = useSuscripciones();
  const navigate = useNavigate();

  const [factura, setFactura] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const idSuscripcion = suscripcion.idSuscripcion;

  useEffect(() => {
    //if (suscripcion.Estado !== "Suspendida" ) {
    //  setError("La suscripción no está suspendida. No se puede reconectar.");
    //  setLoading(false);
    //  return;
    //}

    const cargarDatos = async () => {
      try {
        const facturaObtenida = await obtenerFacturaReconexion(idSuscripcion);
        if (facturaObtenida) setFactura(facturaObtenida);
        console.log("Factura obtenida:", factura);
      } catch (err) {
        console.error("Error al reconectar:", err);
        setError("Error al procesar la solicitud de reconexión.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idSuscripcion, suscripcion]);

  const handleFacturar = async () => {
    const confirmFactura = window.confirm(
      "Se va a generar la factura de reconexión. ¿Desea continuar?"
    );
    if (!confirmFactura) return;

    const dataFactura = {
      idSuscripcion,
      usuarioId: user.id,
    };

    try {
      const respuesta = await insertarFacturaReconexion(dataFactura);
      if (respuesta) {
        setFactura(respuesta);
        console.log("respuesta:", respuesta);
        console.log("Factura:", factura);

        setMensaje("Factura generada correctamente.");
      }
    } catch (error) {
      console.error("Error al generar factura:", error);
      setError("No se pudo generar la factura. Intente nuevamente.");
    }
  };

  const handlePagar = () => {
    if (factura) {
      navigate(`/factura/${factura.idFactura}`);
    }
  };

  const handleReconectar = async () => {
    const confirmar = window.confirm("¿Desea reconectar el servicio?");
    if (!confirmar) return;

    const data = {
      idSuscripcion,
      usuarioId: user.id,
    };

    try {
      const respuesta = await reconexionSuscripcion(data);
      if (respuesta) {
        setMensaje("Servicio reconectado exitosamente.");
        setTimeout(() => {
          navigate(`/carteraSuscripcion/${idSuscripcion}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error al reconectar:", error);
      setError("No se pudo reconectar el servicio.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Cargando información...
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
        <h1 className="text-2xl font-bold mb-6">Reconexión del Servicio</h1>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-700 text-white p-3 rounded mb-4">{error}</div>
        )}
        {mensaje && (
          <div className="bg-green-700 text-white p-3 rounded mb-4">
            {mensaje}
          </div>
        )}

        {/* Datos de suscripción */}
        <div className="space-y-2 text-sm text-gray-300 mb-6">
          <p>
            <span className="text-white font-semibold">ID Suscripción:</span>{" "}
            {idSuscripcion}
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
          {suscripcion.Estado === "Suspencion" ? (
            <p className="text-yellow-400">
              <span className="text-white font-semibold">
                Estado de la suscripción:
              </span>{" "}
              {suscripcion.Estado}
            </p>
          ) : (
            <p>
              <span className="text-white font-semibold">
                Estado de la suscripción:
              </span>{" "}
              {suscripcion.Estado}
            </p>
          )}
        </div>

        {/* Botón generar factura */}
        <div className="mb-6">
          <button
            onClick={handleFacturar}
            disabled={factura}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              factura
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Generar Factura de Reconexión
          </button>
        </div>

        {/* Factura */}
        {factura ? (
          <div className="bg-zinc-700 p-4 rounded mb-6">
            <p className="text-lg mb-2 font-semibold text-white">
              Factura de Reconexión
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
              <p>
                <span className="text-white">Código:</span>{" "}
                {factura.codigoFactura}
              </p>
              <p>
                <span className="text-white">Fecha:</span>{" "}
                {factura.fechaFactura}
              </p>
              <p>
                <span className="text-white">Producto:</span>{" "}
                {factura.nombreProducto}
              </p>
              <p>
                <span className="text-white">Valor:</span> $
                {factura.valor.toLocaleString()}
              </p>
              <p>
                <span className="text-white">Estado de la factura: </span>
                {factura.estado === "Pendiente por pagar" ||
                factura.estado === "Pago Parcial" ? (
                  <span className="text-yellow-400">{factura.estado}</span>
                ) : (
                  <span className="text-green-400">{factura.estado}</span>
                )}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={handlePagar}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Ver factura / Pagar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-700 p-4 rounded mb-6 text-gray-400">
            No se ha generado una factura de reconexión.
          </div>
        )}

        {/* Botón reconectar */}
        <button
          onClick={handleReconectar}
          disabled={!factura}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            factura
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Reconectar el servicio
        </button>
      </div>
    </div>
  );
}

export default ReconexionPage;
