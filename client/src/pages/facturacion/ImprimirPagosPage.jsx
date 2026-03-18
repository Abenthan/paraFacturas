import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFacturacion } from "../../context/FacturacionContext";
import * as XLSX from "xlsx";

function ImprimirPagosPage() {
  const { obtenerPagos } = useFacturacion();
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tituloFiltro, setTituloFiltro] = useState("");

  useEffect(() => {
    const filtros = JSON.parse(localStorage.getItem("filtrosPagos")) || {};

    const partes = [];
    if (filtros.fechaDesde && filtros.fechaHasta) {
      partes.push(`Desde ${filtros.fechaDesde} hasta ${filtros.fechaHasta}`);
    }
    if (filtros.cliente) partes.push(`Cliente: ${filtros.cliente}`);
    if (filtros.suscripcion) partes.push(`Suscripción: ${filtros.suscripcion}`);
    if (filtros.idPago) partes.push(`No. Recibo: ${filtros.idPago}`);
    setTituloFiltro(partes.length > 0 ? partes.join(" | ") : "");

    obtenerPagos(filtros)
      .then((data) => {
        const ordenados = [...(data ?? [])].sort((a, b) => a.idPago - b.idPago);
        setPagos(ordenados);
      })
      .catch((err) => console.error("Error cargando pagos:", err))
      .finally(() => setLoading(false));
  }, [obtenerPagos]);

  const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalPagos = pagos.reduce((acc, p) => acc + p.valorPago, 0);

  const exportarExcel = () => {
    const datos = pagos.map((p) => ({
      "No. Recibo": p.idPago,
      Cliente: p.nombreCliente,
      Suscripción: p.suscripcion_id,
      Fecha: new Date(p.fechaPago).toLocaleDateString("es-CO"),
      Valor: p.valorPago,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    XLSX.writeFile(wb, "pagos.xlsx");
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      {/* Botones — no se imprimen */}
      <div className="mb-4 flex gap-2 justify-end no-print">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
        >
          Volver
        </button>
        <button
          onClick={exportarExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          Exportar a Excel
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Imprimir
        </button>
      </div>

      <div className="print-area">
        {/* Encabezado */}
        <div className="text-center mb-2">
          <div className="font-bold text-sm">
            Asociación Municipal de Usuarios Campesinos — Parabólica Comunitaria
          </div>
          <div className="font-bold text-base">Reporte de Pagos</div>
          {tituloFiltro && (
            <div className="text-xs text-gray-600">Filtro: {tituloFiltro}</div>
          )}
          <div className="text-xs text-gray-500">Generado el {fechaGeneracion}</div>
        </div>

        {loading ? (
          <div className="text-center text-sm">Cargando pagos...</div>
        ) : pagos.length === 0 ? (
          <div className="text-center text-sm">No se encontraron pagos.</div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-500 text-xs">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-16">No. Recibo</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">Cliente</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-16">Suscripción</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-24">Fecha</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-right w-24">Valor</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((p) => (
                  <tr key={p.idPago} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-1 py-0 text-center">{p.idPago}</td>
                    <td className="border border-gray-300 px-1 py-0">{p.nombreCliente}</td>
                    <td className="border border-gray-300 px-1 py-0 text-center">{p.suscripcion_id}</td>
                    <td className="border border-gray-300 px-1 py-0 text-center">
                      {new Date(p.fechaPago).toLocaleDateString("es-CO")}
                    </td>
                    <td className="border border-gray-300 px-1 py-0 text-right">
                      ${p.valorPago.toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={4} className="border border-gray-400 px-1 py-0.5 text-right">
                    Total ({pagos.length} pagos):
                  </td>
                  <td className="border border-gray-400 px-1 py-0.5 text-right">
                    ${totalPagos.toLocaleString("es-CO")}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>

      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 10mm 8mm;
          }
          nav, header, footer, .no-print {
            display: none !important;
          }
          body {
            background: white;
            margin: 0;
          }
          .print-area {
            font-size: 8pt;
          }
          table {
            font-size: 7pt;
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            padding: 1px 3px;
            line-height: 1.25;
          }
          tr {
            page-break-inside: avoid;
          }
          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </div>
  );
}

export default ImprimirPagosPage;
