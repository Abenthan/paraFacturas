import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function Impresion() {
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef, // <= esta línea reemplaza el callback anterior
    documentTitle: "Recibo_Pago",
    onPrintError: (error) => {
      console.error("Error al imprimir:", error);
    },
  });
  

  return (
    <div>
      <h1>Prueba de impresión</h1>
      <button
        onClick={handlePrint}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Imprimir
      </button>

      <div
        ref={contentRef}
        className="bg-white p-6 rounded shadow border print:p-0 print:shadow-none print:border-0 text-black mt-4"
      >
        <h2 className="text-xl font-semibold mb-4">Recibo de Pago #12345</h2>
        <div className="mb-4">
          <p><strong>Cliente:</strong> Juan Pérez</p>
          <p><strong>Factura:</strong> 54321</p>
        </div>
        <div className="mb-4">
          <p><strong>Fecha de Pago:</strong> 01/01/2023</p>
          <p><strong>Valor Pagado:</strong> $1,000,000</p>
        </div>
        <p className="text-sm text-gray-500 mt-8">Generado por el sistema</p>
      </div>
    </div>
  );
}

export default Impresion;
