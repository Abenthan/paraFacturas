import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useFacturacion } from "../../context/FacturacionContext.jsx";

const PagoPage = () => {
  const { obtenerPago } = useFacturacion();
  const { id } = useParams();
  const [pago, setPago] = useState(null);
  const contentRef = useRef();

  useEffect(() => {
    const fetchPago = async () => {
      try {
        const respuesta = await obtenerPago(id);
        if (respuesta) {
          setPago(respuesta);
        } else {
          console.error("No se encontró el pago con ID:", id);
        }
      } catch (error) {
        console.error("Error al obtener pago:", error);
      }
    };

    fetchPago();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Pago_${pago?.[0]?.codigoFactura || "sin_codigo"}`,
    onPrintError: (error) => {
      console.error("Error al imprimir:", error);
    },
  });

  if (!pago) return <div className="p-4 text-center">Cargando pago...</div>;

  return (
    <div className="container mx-auto p-6 text-white">

      {/* Encabezado con botones — no se imprime */}
      <div className="no-print flex justify-between items-center mb-6">
        <div>
          <Link
            to={`/Cliente/${pago[0].idCliente}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Cliente
          </Link>
          <span className="mx-2 text-gray-400">|</span>
          <Link
            to={`/carteraSuscripcion/${pago[0].suscripcion_id}`}
            className="text-green-500 hover:text-green-300 text-sm"
          >
            Suscripción
          </Link>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={handlePrint}
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

        {/* ── DATOS DE LA EMPRESA + No. RECIBO ── */}
        <table className="w-full border-collapse text-[8.5pt] mb-1.5">
          <tbody>
            <tr>
              <td className="align-top w-[65%] leading-[1.6]">
                <div><strong>NIT:</strong> 811.010.539-2</div>
                <div>Carrera Murillo Toro # 10-19</div>
                <div>Dabeiba – Antioquia</div>
                <div>Tel: (604) 232 8831 &nbsp;|&nbsp; Cel: 323 288 3100</div>
                <div>Email: amucampesinos47@gmail.com</div>
              </td>
              <td className="align-top text-right leading-[1.6]">
                <div className="border-[1.5px] border-black py-1 px-2 inline-block text-center">
                  <div className="text-[7.5pt]">No. Recibo</div>
                  <div className="font-bold text-[11pt]">
                    {pago[0].idPago}
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
                <strong>Nombre:</strong> {pago[0].nombreCliente}
              </td>
              <td className="w-1/2 pb-[3px] text-right">
                <strong>Fecha de pago:</strong>{" "}
                {new Date(pago[0].fechaPago).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </td>
            </tr>
            <tr>
              <td className="pb-[3px]"></td>
              <td className="text-right pb-[3px]">
                <strong>Fecha límite de pago:</strong>{" "}
                {(() => {
                  const ultima = pago[pago.length - 1];
                  const fecha = new Date(ultima.facturaYear, ultima.facturaMes, 0);
                  return fecha.toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  });
                })()}
              </td>
            </tr>
            <tr>
              <td className="pb-[3px]">
                <strong>No. Suscripción:</strong> {pago[0].suscripcion_id}
              </td>
              <td className="text-right pb-[3px]">
                <strong>Método de pago:</strong> {pago[0].metodoPago}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── SEPARADOR ── */}
        <hr className="border-t-[1.5px] border-black my-1" />

        {/* ── TABLA DE PAGOS A FACTURAS ── */}
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
            {pago.map((pagoAFactura) => (
              <tr key={pagoAFactura.idPagoFactura}>
                <td className="border border-black px-[6px] py-1">
                  Pago a la factura # {pagoAFactura.codigoFactura},{" "}
                  {pagoAFactura.estado}
                </td>
                <td className="border border-black px-[6px] py-1 text-right">
                  ${Number(pagoAFactura.pagoFactura).toLocaleString("es-CO")}
                </td>
              </tr>
            ))}
            <tr className="bg-[#d0d0d0]">
              <td className="border border-black px-[6px] py-1 font-bold">
                Total Pagado
              </td>
              <td className="border border-black px-[6px] py-1 text-right font-bold">
                ${Number(pago[0].valorPago).toLocaleString("es-CO")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── NOTAS ── */}
        <div className="mt-3 text-[7.5pt] border border-black px-[7px] py-[5px] leading-[1.5]">
          <div>
            Puede realizar el pago de su factura mediante consignación o
            transferencia a la cuenta corriente de Bancolombia N.°{" "}
            <strong>240 482161 01</strong>, a nombre de la Asociación de
            Usuarios Campesinos.
          </div>
          <hr className="border-t border-dashed border-[#888] my-2" />
          <div>
            <strong>IMPORTANTE:</strong> Estimado usuario, a partir de dos (2)
            cuentas vencidas será suspendido su servicio de parabolica. La
            tarifa de reconexion es de <strong>$13.000</strong>, traslados{" "}
            <strong>$13.000</strong>.
          </div>
        </div>

        {/* ── SEPARADOR COLILLA ── */}
        <hr className="border-t border-dashed my-2" />

        {/* COLILLA DE PAGO */}
        <div className="flex justify-between items-start">
          {/* Sección Usuario */}
          <div>
            <div className="text-[8.5pt]">
              Nro. Suscripción: <strong>{pago[0].suscripcion_id}</strong>
            </div>
            <div className="text-[8.5pt]">
              <strong>{pago[0].nombreCliente}</strong>
            </div>
          </div>
          {/* Sección Valores */}
          <div className="text-right">
            <div className="text-[8.5pt]">
              Nro. Recibo: <strong>{pago[0].idPago}</strong>
            </div>
            <div className="text-[8.5pt]">
              Método: <strong>{pago[0].metodoPago}</strong>
            </div>
            {pago.map((pagoAFactura) => (
              <div key={pagoAFactura.idPagoFactura} className="text-[8.5pt]">
                Factura # {pagoAFactura.codigoFactura}:{" "}
                <strong>${Number(pagoAFactura.pagoFactura).toLocaleString("es-CO")}</strong>
              </div>
            ))}
            <div className="text-[8.5pt] border-t border-black mt-0.5 pt-0.5">
              Total Pagado:{" "}
              <strong>${Number(pago[0].valorPago).toLocaleString("es-CO")}</strong>
            </div>
          </div>
        </div>

      </div>
      {/* fin zona imprimible */}

    </div>
  );
};

export default PagoPage;
