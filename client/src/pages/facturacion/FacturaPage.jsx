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
        console.log("Factura cargada:", data.factura);
        console.log("Pagos asociados:", data.pagos);
        console.log("Saldo pendiente anterior:", data.saldoPendienteAnterior);
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
      {/* Encabezado con botones — no se imprime */}
      <div className="no-print flex justify-between items-center mb-6">
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
        className="bg-white text-black p-6 rounded-lg border border-gray-300 max-w-4xl mx-auto"
      >
        {/* ── ENCABEZADO: nombre de la asociación ── */}
        <div className="text-center mb-1.5">
          <div className="font-bold text-[11pt] leading-[1.3]">
            Asociación Municipal de Usuarios Campesinos
          </div>
          <div className="font-bold text-[13pt] tracking-[1px]">
            Parabólica Comunitaria
          </div>
        </div>

        {/* ── DATOS DE LA EMPRESA + No. COBRO (tabla de 2 columnas) ── */}
        <table className="w-full border-collapse text-[8.5pt] mb-1.5">
          <tbody>
            <tr>
              <td className="align-top w-[65%] leading-[1.6]">
                <div>
                  <strong>NIT:</strong> 811.010.539-2
                </div>
                <div>Carrera Murillo Toro # 10-19</div>
                <div>Dabeiba – Antioquia</div>
                <div>Tel: (604) 232 8831 &nbsp;|&nbsp; Cel: 323 288 3100</div>
                <div>Email: amucampesinos47@gmail.com</div>
              </td>
              <td className="align-top text-right leading-[1.6]">
                <div className="border-[1.5px] border-black py-1 px-2 inline-block text-center">
                  <div className="text-[7.5pt]">No. Cobro</div>
                  <div className="font-bold text-[11pt]">
                    {factura.codigoFactura}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── SEPARADOR ── */}
        <hr className="border-t-[1.5px] border-black my-1" />

        {/* ── DATOS DEL CLIENTE ── */}
        <table className="w-full border-collapse text-[8.5pt] my-1.5">
          <tbody>
            <tr>
              <td className="w-1/2 pb-[3px]">
                <strong>Nombre:</strong> {factura.nombreCliente}
              </td>
              <td className="w-1/2 pb-[3px] text-right">
                <strong>Fecha facturación:</strong>{" "}
                {new Date(factura.fechaFactura).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>
            </tr>
            <tr>
              <td className="pb-[3px]">
                <strong>Nit / Cédula:</strong> {factura.numeroId}
              </td>
              <td className="text-right pb-[3px]">
                <strong>Páguese hasta:</strong>{" "}
                {factura.fechaLimitePago
                  ? new Date(factura.fechaLimitePago).toLocaleDateString(
                      "es-CO",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      },
                    )
                  : "—"}
              </td>
            </tr>
            <tr>
              <td className="pb-[3px]">
                <strong>Dirección:</strong> {factura.direccionServicio}
              </td>
              <td className="text-right pb-[3px]">
                <strong>No. Suscripción:</strong> {factura.idSuscripcion}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── SEPARADOR ── */}
        <hr className="border-t-[1.5px] border-black my-1" />

        {/* ── TABLA DE DESCRIPCIÓN Y VALORES ── */}
        <table className="w-full border-collapse text-[8.5pt] my-2 border border-black">
          <thead>
            <tr className="bg-[#d0d0d0]">
              <th className="border border-black px-[6px] py-1 text-left">
                Descripción
              </th>
              <th className="border border-black px-[6px] py-1 text-right whitespace-nowrap">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Servicio principal */}
            <tr>
              <td className="border border-black px-[6px] py-1">
                {factura.nombreProducto}
                {factura.producto_id === idProductoSuscripcion && (
                  <span>
                    {" – Periodo "}
                    {new Date(
                      `${factura.year}-${factura.mes}-01`,
                    ).toLocaleDateString("es-ES", {
                      month: "long",
                    })}
                    /{factura.year}
                  </span>
                )}
              </td>
              <td className="border border-black px-[6px] py-1 text-right">
                ${factura.valor.toLocaleString("es-CO")}
              </td>
            </tr>

            {/* Pagos realizados */}
            {totalPagado > 0 && (
              <tr>
                <td className="border border-black px-[6px] py-1">
                  Pagos realizados a la factura
                </td>
                <td className="border border-black px-[6px] py-1 text-right">
                  -${totalPagado.toLocaleString("es-CO")}
                </td>
              </tr>
            )}

            {/* Saldo pendiente anterior */}
            {saldoPendiente > 0 && (
              <tr>
                <td className="border border-black px-[6px] py-1">
                  Saldo pendiente anterior
                </td>
                <td className="border border-black px-[6px] py-1 text-right">
                  ${Number(saldoPendiente).toLocaleString("es-CO")}
                </td>
              </tr>
            )}

            {/* Total a pagar */}
            <tr className="bg-[#d0d0d0]">
              <td className="border border-black px-[6px] py-1 font-bold">
                Total a Pagar
              </td>
              <td className="border border-black px-[6px] py-1 text-right font-bold">
                ${saldoTotal.toLocaleString("es-CO")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── PAGOS REALIZADOS (detalle) ── */}
        {pagos.length > 0 && (
          <>
            <hr className="border-t border-dashed border-[#888] my-2" />
            <div className="text-[8.5pt] mb-1">
              <strong>Descripción del Pago:</strong>
            </div>
            <table className="w-full border-collapse text-[8.5pt] border border-black">
              <thead>
                <tr className="bg-[#d0d0d0]">
                  <th className="border border-black px-[6px] py-[3px] text-left">
                    Fecha Pago
                  </th>
                  <th className="border border-black px-[6px] py-[3px] text-right">
                    Valor Pagado
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.idPagos}>
                    <td className="border border-black px-[6px] py-[3px]">
                      {new Date(pago.fechaPago).toLocaleDateString("es-CO")}
                    </td>
                    <td className="border border-black px-[6px] py-[3px] text-right">
                      ${pago.valorPago.toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ── NOTAS ── */}
        <div className="mt-3 text-[7.5pt] border border-black px-[7px] py-[5px] leading-[1.5]">
          <div>
            Puede realizar el pago de su factura mediante consignación o
            transferencia a la cuenta corriente de Bancolombia N.°{" "}
            <strong>240 482161 01</strong>, a nombre de la Asociación de
            Usuarios Campesinos.
          </div>
          {/* insertar line divisoria */}

          <hr className="border-t border-dashed border-[#888] my-2" />

          <div>
            <strong>IMPORTANTE:</strong> Estimado usuario, a partir de dos (2)
            cuentas vencidas será suspendido su servicio de parabolica. La
            tarifa de reconexion es de <strong>$13.000</strong>, traslados{" "}
            <strong>$13.000</strong>.
          </div>
        </div>

        {/* ── ESTADO ── solo visible en pantalla ── */}
        <div className="mt-2 text-[8pt] text-right text-[#555]">
          Estado: <strong>{factura.estado}</strong>
        </div>
        <hr className="border-t border-dashed my-2" />

        {/* COLILLA DE PAGO */}
        <div className="flex justify-between items-start">
          {/* Seccion Usuario */}
          <div>
            <div className="text-[8.5pt]">
              Nro. Suscripción: <strong>{factura.idSuscripcion}</strong>
            </div>
            <div className="text-[8.5pt]">
              <strong>{factura.nombreCliente}</strong>
            </div>
            <div className="text-[8.5pt]">{factura.direccionServicio}</div>
          </div>
          {/* Seccion Cobro */}
          <div className="text-right">
            <div className="text-[8.5pt]">
              Nro. Cobro: <strong>{factura.codigoFactura}</strong>
            </div>
            <div className="text-[8.5pt]">
              Valor Factura:{" "}<strong>${factura.valor.toLocaleString("es-CO")}</strong>
            </div>
            {totalPagado > 0 && (
              <div className="text-[8.5pt]">
                Total Pagos:{" "}<strong>-${totalPagado.toLocaleString("es-CO")}</strong>
              </div>
            )}
            {saldoPendiente > 0 && (
              <div className="text-[8.5pt]">
                Saldo Pendiente:{" "}<strong>${Number(saldoPendiente).toLocaleString("es-CO")}</strong>
              </div>
            )}
            <div className="text-[8.5pt] border-t border-black mt-0.5 pt-0.5">
              Total a Pagar:{" "}<strong>${saldoTotal.toLocaleString("es-CO")}</strong>
            </div>
          </div>
        </div>
      </div>
      {/* fin zona imprimible */}
    </div>
  );
}

export default FacturaPage;
