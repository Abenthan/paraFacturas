import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { useFacturacion } from "../context/FacturacionContext";

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
    documentTitle: `Pago_${pago?.codigoFactura || "sin_codigo"}`,
    onPrintError: (error) => {
      console.error("Error al imprimir:", error);
    },
  });

  const handleDownloadPDF = () => {
    if (!contentRef.current) {
      console.error("No se encontró el elemento para generar PDF.");
      return;
    }
    const opt = {
      margin: 0.5,
      filename: `Pago_${pago?.codigoFactura || "sin_codigo"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(contentRef.current).save();
  };

  if (!pago) return <div className="p-4 text-center">Cargando pago...</div>;

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            Detalle del Pago
          </h1>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 w-full justify-center md:w-auto"
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

        <div
          ref={contentRef}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 print:p-0 print:shadow-none print:border-0"
        >
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Recibo de Pago #{pago.idPagos}
                </h2>
                <p className="text-sm text-gray-500">
                  Fecha de emisión: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">
                  Información del Cliente
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">
                    <span className="font-medium">Nombre:</span>{" "}
                    {pago.nombreCliente}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Factura:</span>{" "}
                    {pago.codigoFactura}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">
                  Detalles del Pago
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">
                    <span className="font-medium">Fecha de Pago:</span>{" "}
                    {new Date(pago.fechaPago).toLocaleDateString()}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Valor Pagado:</span> $
                    {Number(pago.valorPago).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Resumen</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        Pago de factura
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ${Number(pago.valorPago).toLocaleString("es-CO")}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        ${Number(pago.valorPago).toLocaleString("es-CO")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Gracias por su pago. Este documento es válido como comprobante.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Generado automáticamente por el sistema el{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagoPage;
