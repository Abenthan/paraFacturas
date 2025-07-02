import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFacturacion } from "../../context/FacturacionContext";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function FacturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerFactura } = useFacturacion();

  const [factura, setFactura] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saldoPendiente, setSaldoPendiente] = useState(0);

  const idProductoSuscripcion = 1;

  // Referencia al bloque que se imprimirá/convertirá en PDF
  const contentRef = useRef();

  // Cargar datos de la factura al montarse
  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const data = await obtenerFactura(id);
        setFactura(data.factura);
        setPagos(data.pagos || []);
        setSaldoPendiente(data.saldoPendienteAnterior || 0);
        console.log("Factura", data.factura);
      } catch (error) {
        console.error("Error cargando factura:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarFactura();
  }, [id, obtenerFactura]);

  // Cálculos de totales
  const totalPagado = pagos.reduce((sum, p) => sum + p.valorPago, 0);
  const saldoTotal = factura
    ? factura.valor - totalPagado + Number(saldoPendiente)
    : 0;

  // Determinar si el botón "Pagar" está habilitado
  const puedePagar =
    factura?.estado === "Pendiente por pagar" ||
    factura?.estado === "Pago Parcial";

  // Hook para imprimir o guardar como PDF el contenido referenciado
  const handleImprimirPDF = useReactToPrint({
    contentRef,
    documentTitle: `Factura-${factura?.codigoFactura || "sin-codigo"}`,
    onPrintError: (error) => {
      console.error("Error al imprimir:", error);
    },
  });

  if (loading) {
    return (
      <div className="text-white text-center mt-8 text-xl">
        Cargando factura...
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="text-red-500 text-center mt-8 text-xl">
        Factura no encontrada
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-white">
      {/* Encabezado con botones */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to={`/Cliente/${factura.idCliente}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Cliente
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link
            to={`/carteraSuscripcion/${factura.idSuscripcion}`}
            className="text-green-500 hover:text-green-300 text-sm"
          >
            Suscripción
          </Link>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Botón para imprimir o guardar PDF */}
          <button
            onClick={handleImprimirPDF}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 w-full justify-center md:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clipRule="evenodd"
              />
            </svg>
            Imprimir
          </button>
          {/* Botón Pagar, condicionado por estado */}
          <button
            onClick={() =>
              puedePagar && navigate(`/pagarFactura/${factura.idFactura}`)
            }
            disabled={!puedePagar}
            className={`${
              puedePagar
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed"
            } px-4 py-2 rounded-lg text-white`}
          >
            Pagar
          </button>
        </div>
      </div>

      {/* Zona imprimible */}
      <div
        ref={contentRef}
        className="bg-white text-black p-8 rounded-lg shadow-md max-w-2xl mx-auto border border-gray-300"
      >
        {/* Encabezado */}
        <div className="text-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold tracking-wide mb-1 text-gray-800">
            FACTURA
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Código:</strong> {factura.codigoFactura}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Fecha de facturación:</strong>{" "}
            {new Date(factura.fechaFactura).toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Información del cliente */}
        <div className="mb-6 space-y-1 text-sm text-gray-700">
          <p>
            <strong>Cliente:</strong> {factura.nombreCliente}
          </p>
          <p>
            <strong>Suscripción:</strong> #{factura.idSuscripcion}
          </p>
          <p>
            <strong>Dirección del servicio:</strong> {factura.direccionServicio}
          </p>
          <p>
            <strong>Estado de la factura:</strong> {factura.estado}
          </p>
        </div>

        {/* Totales */}
        <div className="my-6 text-sm">
          Descripción Factura:
          <table className="w-full border border-gray-400 text-left text-sm">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">
                  {factura.nombreProducto}
                  {factura.producto_id === idProductoSuscripcion && (
                    <span>
                      , periodo:{" "}
                      {new Date(
                        `${factura.year}-${factura.mes}-01`
                      ).toLocaleDateString("es-ES", { month: "long" })}
                      /{factura.year}
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2 text-right">
                  ${factura.valor.toLocaleString("es-CO")}
                </td>
              </tr>

              {/* fila Pagos Realizados */}
              {totalPagado > 0 && (
                <tr>
                  <td className="border px-4 py-2 font-medium">
                    Pagos realizados a la factura
                  </td>
                  <td className="border px-4 py-2 text-right">
                    ${totalPagado.toLocaleString("es-CO")}
                  </td>
                </tr>
              )}

              {/* fila Saldo pendiente */}
              {saldoPendiente > 0 && (
                <tr>
                  <td className="border px-4 py-2 font-medium">
                    Saldo pendiente anterior
                  </td>
                  <td className="border px-4 py-2 text-right">
                    $
                    {(saldoPendiente).toLocaleString(
                      "es-CO"
                    )}
                  </td>
                </tr>
              )}

              {/* fila Total a pagar */}
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-bold">Total a pagar</td>
                <td className="border px-4 py-2 text-right font-bold">
                  ${saldoTotal.toLocaleString("es-CO")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagos realizados */}
        {pagos.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Pagos realizados
            </h3>
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border border-gray-300 text-left">
                    Fecha
                  </th>
                  <th className="p-2 border border-gray-300 text-left">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.idPagos}>
                    <td className="p-2 border border-gray-200">
                      {new Date(pago.fechaPago).toLocaleDateString("es-CO")}
                    </td>
                    <td className="p-2 border border-gray-200">
                      ${pago.valorPago.toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacturaPage;
