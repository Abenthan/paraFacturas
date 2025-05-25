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

  // Referencia al bloque que se imprimirá/convertirá en PDF
  const printRef = useRef();

  // Cargar datos de la factura al montarse
  useEffect(() => {
    const cargarFactura = async () => {
      try {
        const data = await obtenerFactura(id);
        setFactura(data.factura);
        setPagos(data.pagos || []);
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
  const saldoPendiente = factura ? factura.valor - totalPagado : 0;

  // Determinar si el botón "Pagar" está habilitado
  const puedePagar =
    factura?.estado === "Pendiente por pagar" ||
    factura?.estado === "Pago Parcial";

  // Hook para imprimir o guardar como PDF el contenido referenciado
  const handleImprimirPDF = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Factura-${factura?.codigoFactura || "sin-codigo"}`,
    onAfterPrint: () => console.log("PDF generado"),
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
        {/* enlace para ir estado de cuenta del cliente */}
        <Link
          to={`/estadoCuentaCliente/${factura.idCliente}`}
          className="text-blue-400 hover:text-blue-300 text-sm"         >
          ← Estado de Cuenta del Cliente
        </Link>

        <div className="flex gap-4">
          {/* Botón para imprimir o guardar PDF */}
          <button
            onClick={handleImprimirPDF}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Imprimir / Guardar PDF
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
        ref={printRef}
        className="bg-white text-black p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      >
        {/* Cabecera de la factura */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">
            Factura #{factura.codigoFactura}
          </h2>
          <p>
            Periodo: {factura.year}/{factura.mes.toString().padStart(2, "0")}
          </p>
        </div>

        {/* Datos principales */}
        <div className="mb-4">
          <p>
            <strong>Cliente:</strong> {factura.nombreCliente}
          </p>
          <p><strong>Suscripcion # </strong> {factura.idSuscripcion}</p>
          <p>
            <strong>Producto:</strong> {factura.nombreProducto}
          </p>
          <p>
            <strong>Dirección Servicio:</strong> {factura.direccionServicio}
          </p>
          <p>
            <strong>Estado:</strong> {factura.estado}
          </p>
        </div>

        {/* Totales y saldos */}
        <div className="mb-4">
          <p>
            <strong>Valor Total:</strong> ${factura.valor.toLocaleString()}
          </p>
          <p>
            <strong>Total Pagado:</strong> ${totalPagado.toLocaleString()}
          </p>
          <p>
            <strong>Saldo Pendiente:</strong> ${saldoPendiente.toLocaleString()}
          </p>
        </div>

        {/* Tabla de pagos */}
        {pagos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Pagos realizados</h3>
            <table className="min-w-full border border-gray-400">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-2 border border-gray-400">
                    Fecha
                  </th>
                  <th className="text-left p-2 border border-gray-400">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.idPagos}>
                    <td className="p-2 border border-gray-400">
                      {new Date(pago.fechaPago).toLocaleDateString()}
                    </td>
                    <td className="p-2 border border-gray-400">
                      ${pago.valorPago.toLocaleString()}
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
