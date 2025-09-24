import { useEffect, useState, useRef } from "react";
import { useFacturacion } from "../../context/FacturacionContext";

function ImprimirFacturacionPage() {
  const { obtenerFacturas } = useFacturacion();
  const reportRef = useRef(null);

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

  const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Solo imprime el área del informe
  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="p-8 bg-white text-black">
      {/* Botón imprimir - fuera del área del informe */}
      <div className="mb-6 text-right no-print">
        <button
          onClick={handleImprimir}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Imprimir
        </button>
      </div>

      {/* Área del informe */}
      <div ref={reportRef} className="print-area">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">Informe de Facturación</h1>
          <p className="text-gray-700 text-sm">Generado el {fechaGeneracion}</p>
        </div>

        {loading ? (
          <div className="text-center text-lg">Cargando facturas...</div>
        ) : facturas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-400 text-xs">
              <thead className="bg-gray-200 text-black uppercase">
                <tr>
                  <th className="p-1 border">Código</th>
                  <th className="p-1 border">Suscripción</th>
                  <th className="p-1 border">Cliente</th>
                  <th className="p-1 border">Producto</th>
                  <th className="p-1 border">Dirección</th>
                  <th className="p-1 border">Valor</th>
                  <th className="p-1 border">Pendiente</th>
                  <th className="p-1 border">Total a Pagar</th>
                  <th className="p-1 border">Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f) => (
                  <tr key={f.idFactura} className="hover:bg-gray-100">
                    <td className="p-1 border">{f.codigoFactura}</td>
                    <td className="p-1 border">{f.suscripcion_id}</td>
                    <td className="p-1 border">{f.nombreCliente}</td>
                    <td className="p-1 border">{f.nombreProducto}</td>
                    <td className="p-1 border">{f.direccionServicio}</td>
                    <td className="p-1 border">
                      ${f.valor.toLocaleString("es-CO")}
                    </td>
                    <td className="p-1 border">
                      ${Number(f.valor_pendiente)?.toLocaleString("es-CO")}
                    </td>
                    <td className="p-1 border">
                      ${Number(f.totalPagar)?.toLocaleString("es-CO")}
                    </td>
                    <td className="p-1 border">{f.estado}</td>
                  </tr>
                ))}
              </tbody>

              {/* Totales */}
              <tfoot className="bg-gray-200 font-bold">
                <tr>
                  <td colSpan="5" className="p-2 border text-right">
                    Totales:
                  </td>
                  <td className="p-2 border">
                    ${totalFacturasMes.toLocaleString("es-CO")}
                  </td>
                  <td className="p-2 border">
                    ${totalPendiente.toLocaleString("es-CO")}
                  </td>
                  <td className="p-2 border">
                    ${totalFacturacion.toLocaleString("es-CO")}
                  </td>
                  <td className="p-2 border"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center text-lg">No se encontraron facturas.</div>
        )}
      </div>

      {/* Estilos para impresión */}
      <style>
        {`
          @media print {
            nav, header, footer, .no-print { display: none; }
            body { background: white; }
            .print-area {
              margin: 0;
              padding: 0;
              font-size: 10pt;
            }
            table { font-size: 9pt; }
          }
        `}
      </style>
    </div>
  );
}

export default ImprimirFacturacionPage;
