import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function TrasladoPage() {
  const { user } = useAuth();
  const { suscripcion, insertarFacturaTraslado } = useSuscripciones();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [factura, setFactura] = useState(null);

  const idSuscripcion = suscripcion.idSuscripcion;

  const handleFacturar = async () => {
    const confirmFactura = window.confirm(
      "Se va a generar la factura de reconexión. ¿Desea continuar?"
    );

    if (!confirmFactura) return;

    const dataFactura = {
      idSuscripcion,
      usuarioId: user.id,
      nuevaDireccion,
    };
    try {
      const response = await insertarFacturaTraslado(dataFactura);
      console.log("Respuesta de la factura:", response);
      if (response) {
        setFactura(response);
        setSuccessMessage(response.message || "Factura generada con éxito.");
      }
    } catch (error) {
      console.error("Error al generar factura:", error);
      setError("No se pudo generar la factura. Intente nuevamente.");
    }
  };

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
        <h1 className="text-2xl font-bold mb-6">
          Traslado, cambio de dirección
        </h1>

        {/* Mensajes de éxito y error */}
        {successMessage && (
          <div className="bg-green-700 text-white p-4 rounded mb-4">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-700 text-white p-4 rounded mb-4">{error}</div>
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
              Dirección del servicio actual:
            </span>{" "}
            {suscripcion.direccionServicio}
          </p>
          {suscripcion.Estado === "Suspendida" ? (
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

        {/* Nueva direccion del servicio */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Nueva dirección del servicio:
          </label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            placeholder="Ingrese la nueva dirección"
            onChange={(e) => setNuevaDireccion(e.target.value)}
          />
        </div>

        {/* ver factura */}
        {factura ? (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Factura Generada:</h2>
            <table className="w-full text-sm text-left text-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Codigo Factura
                  </th>
                  <th className="px-4 py-2 border-b border-gray-700">Fecha</th>
                  <th className="px-4 py-2 border-b border-gray-700">
                    Producto
                  </th>
                  <th className="px-4 py-2 border-b border-gray-700">Valor</th>
                  <th className="px-4 py-2 border-b border-gray-700"> </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {factura.codigoFactura}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {factura.fechaFactura}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {factura.producto}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {factura.valor}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    <Link
                      to={`/factura/${factura.idFactura}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                    >
                      Ver Factura
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          // Botón para generar factura
          <div className="mb-6">
            <button
              onClick={handleFacturar}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Generar Factura de Traslado y guardar cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrasladoPage;
