import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { useFacturacion } from "../context/FacturacionContext";

function FacturaPage() {
  const { id } = useParams();
  const { obtenerFactura } = useFacturacion(); // usamos el contexto
  const [factura, setFactura] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  // Consultar la factura usando el contexto
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

  const totalPagado = pagos.reduce((sum, p) => sum + p.valorPago, 0);
  const saldoPendiente = factura ? factura.valor - totalPagado : 0;

  const handleDescargarPDF = () => {
    const element = printRef.current;
    const options = {
      margin: 10,
      filename: `${factura.codigoFactura}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(element).save();
  };

  const puedePagar =
    factura?.estado === "Pendiente por pagar" ||
    factura?.estado === "Pago Parcial";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Factura #{factura.codigoFactura}</h1>
        <div className="flex gap-4">
          <button
            onClick={handleDescargarPDF}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Descargar PDF
          </button>
          <button
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
        className="bg-gray-900 p-6 rounded-lg shadow-md text-white"
      >
        <div className="mb-4">
          <p>
            <strong>Cliente:</strong> {factura.nombreCliente}
          </p>
          <p>
            <strong>Producto:</strong> {factura.nombreProducto}
          </p>
          <p>
            <strong>Dirección Servicio:</strong> {factura.direccionServicio}
          </p>
          <p>
            <strong>Periodo:</strong> {factura.year}/
            {factura.mes.toString().padStart(2, "0")}
          </p>
          <p>
            <strong>Estado:</strong> {factura.estado}
          </p>
        </div>

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

        {pagos.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Pagos realizados</h2>
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-2">Fecha</th>
                  <th className="text-left p-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.idPagos} className="border-t border-gray-600">
                    <td className="p-2">
                      {new Date(pago.fechaPago).toLocaleDateString()}
                    </td>
                    <td className="p-2">${pago.valorPago.toLocaleString()}</td>
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
