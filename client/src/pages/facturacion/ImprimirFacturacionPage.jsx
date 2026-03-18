import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFacturacion } from "../../context/FacturacionContext";
import * as XLSX from "xlsx";

function ImprimirFacturacionPage() {
  const { obtenerFacturas } = useFacturacion();
  const navigate = useNavigate();

  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recuperar filtros desde localStorage
  useEffect(() => {
    const filtros = JSON.parse(localStorage.getItem("filtrosFacturas")) || {};
    const fetchData = async () => {
      try {
        const data = await obtenerFacturas({
          year: filtros.year ? Number(filtros.year) : undefined,
          mes: filtros.mes ? Number(filtros.mes) : undefined,
          estado: filtros.estadoFiltro || undefined,
          cliente: filtros.buscar || undefined,
        });
        // Aseguramos un array antes de ordenar
        const facturasOrdenadas = (data?.facturas ?? []).sort(
          (a, b) => (a.suscripcion_id || 0) - (b.suscripcion_id || 0)
        );

        setFacturas(facturasOrdenadas);
      } catch (error) {
        console.error("Error obteniendo facturas para imprimir:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [obtenerFacturas]);

  // Calcular totales a partir de las facturas visibles
  const totalFacturasMes = facturas.reduce((acc, f) => acc + (f.valor || 0), 0);
  const totalPendiente = facturas.reduce(
    (acc, f) => acc + (Number(f.valor_pendiente) || 0),
    0
  );
  const totalFacturacion = facturas.reduce(
    (acc, f) => acc + (Number(f.totalPagar) || 0),
    0
  );

  const exportarExcel = () => {
    const datos = facturas.map((f) => ({
      Factura: f.codigoFactura,
      Suscripción: f.suscripcion_id,
      Cliente: f.nombreCliente,
      Dirección: f.direccionServicio,
      Valor: f.valor,
      Pendiente: Number(f.valor_pendiente),
      "Total a Pagar": Number(f.totalPagar),
      Estado: f.estado,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    XLSX.writeFile(wb, "facturas.xlsx");
  };

  const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          <div className="font-bold text-base">Informe de Facturación</div>
          <div className="text-xs text-gray-500">Generado el {fechaGeneracion}</div>
        </div>

        {loading ? (
          <div className="text-center text-sm">Cargando facturas...</div>
        ) : facturas.length > 0 ? (
          <>
            <table className="w-full border-collapse border border-gray-500 text-xs">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">Código</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-8">Susc.</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">Cliente</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">Dirección</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-right w-20">Valor</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-right w-20">Pendiente</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-right w-20">Total Pagar</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-24">Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f) => (
                  <tr key={f.idFactura} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-1 py-0">{f.codigoFactura}</td>
                    <td className="border border-gray-300 px-1 py-0 text-center">{f.suscripcion_id}</td>
                    <td className="border border-gray-300 px-1 py-0">{f.nombreCliente}</td>
                    <td className="border border-gray-300 px-1 py-0">{f.direccionServicio}</td>
                    <td className="border border-gray-300 px-1 py-0 text-right">${f.valor.toLocaleString("es-CO")}</td>
                    <td className="border border-gray-300 px-1 py-0 text-right">${Number(f.valor_pendiente).toLocaleString("es-CO")}</td>
                    <td className="border border-gray-300 px-1 py-0 text-right">${Number(f.totalPagar).toLocaleString("es-CO")}</td>
                    <td className="border border-gray-300 px-1 py-0 text-center">{f.estado}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={4} className="border border-gray-400 px-1 py-0.5 text-right">
                    Total ({facturas.length} facturas):
                  </td>
                  <td className="border border-gray-400 px-1 py-0.5 text-right">${totalFacturasMes.toLocaleString("es-CO")}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-right">${totalPendiente.toLocaleString("es-CO")}</td>
                  <td className="border border-gray-400 px-1 py-0.5 text-right">${totalFacturacion.toLocaleString("es-CO")}</td>
                  <td className="border border-gray-400 px-1 py-0.5"></td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <div className="text-center text-sm">No se encontraron facturas.</div>
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

export default ImprimirFacturacionPage;
