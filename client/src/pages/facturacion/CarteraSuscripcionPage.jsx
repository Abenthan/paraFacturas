import { useParams, Link, useNavigate } from "react-router-dom";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useFacturacion } from "../../context/FacturacionContext";
import { useEffect, useState } from "react";

function CarteraSuscripcionPage() {
  const { id: suscripcionId } = useParams();
  const navigate = useNavigate();
  const { suscripcion, getSuscripcion } = useSuscripciones();
  const { getCarteraSuscripcion } = useFacturacion();
  const [facturas, setFacturas] = useState([]);
  const [mostrarTramites, setMostrarTramites] = useState(false);

  // Cargar datos de la suscripción
  useEffect(() => {
    async function fetchData() {
      try {
        await getSuscripcion(suscripcionId);
        const cartera = await getCarteraSuscripcion(suscripcionId);
        setFacturas(cartera);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    }
    fetchData();
  }, [suscripcionId]);

  if (!suscripcion) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Cargando información de la suscripción...
      </div>
    );
  }

  // Validaciones de trámites
  const puedeSuspender =
    suscripcion.Estado === "Activo" && facturas.length >= 2;

  const puedeReconectar = suscripcion.Estado === "Suspendida";

  const puedeRetirar = facturas.length === 0;

  const tramites = [
    {
      nombre: "Editar",
      path: `/suscripcion/${suscripcionId}`,
      permitido: true,
    },
    {
      nombre: "Suspensión",
      path: `/suspenderSuscripcion/${suscripcionId}`,
      permitido: puedeSuspender,
      mensaje:
        "Solo se puede suspender si hay 2 o más facturas y la suscripción está activa.",
    },
    {
      nombre: "Reconexion",
      path: `/suscripciones/reconexion`,
      permitido: puedeReconectar,
      mensaje:
        "Solo se puede reconectar si la suscripción está en suspensión y no hay facturas pendientes por suscrición.",
    },
    {
      nombre: "Retiro",
      path: `/retiroSuscripcion/${suscripcionId}`,
      permitido: puedeRetirar,
      mensaje: "Solo se puede retirar si no hay facturas pendientes.",
    },
  ];

  const handleTramite = (t) => {
    if (t.permitido) {
      navigate(t.path);
    } else {
      alert(t.mensaje);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-5xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {/* Botón de regreso */}
        <div className="mb-4">
          <Link
            to={`/cliente/${suscripcion.cliente_id}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← ver cliente
          </Link>
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Estado de cuenta de la suscripción #{suscripcionId}
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
          <button
            onClick={() => setMostrarTramites(!mostrarTramites)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Trámites
          </button>

          {mostrarTramites && (
            <div className="mt-4 bg-zinc-700 p-4 rounded-lg space-y-2">
              {tramites.map((t) => (
                <button
                  key={t.nombre}
                  onClick={() => handleTramite(t)}
                  className={`block w-full text-left px-4 py-2 rounded-md ${
                    t.permitido
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-600 cursor-not-allowed opacity-60"
                  } text-white`}
                >
                  {t.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabla de facturas */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Código Factura</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Valor Factura</th>
                <th className="px-4 py-3">Total Pagado</th>
                <th className="px-4 py-3">Saldo Pendiente</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => {
                const saldo = factura.valorFactura - factura.totalPagado;
                return (
                  <tr
                    key={factura.idFactura}
                    className="border-b border-zinc-700 hover:bg-zinc-700"
                  >
                    <td className="px-4 py-2">{factura.codigoFactura}</td>
                    <td className="px-4 py-2">
                      {factura.fechaFactura &&
                        new Date(factura.fechaFactura).toLocaleDateString(
                          "es-CO"
                        )}
                    </td>
                    <td className="px-4 py-2">
                      ${factura.valorFactura.toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-2">
                      ${factura.totalPagado.toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-2 text-yellow-300 font-semibold">
                      ${saldo.toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        to={`/factura/${factura.idFactura}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Pagar
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {facturas.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-400">
                    No hay facturas pendientes para esta suscripción.
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

export default CarteraSuscripcionPage;
