import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSuscripcionesRequest } from "../../api/suscripcionesApi.js";

function ImprimirSuscripcionesPage() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSuscripcionesRequest()
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => a.idSuscripcion - b.idSuscripcion);
        setSuscripciones(sorted);
      })
      .catch((err) => console.error("Error cargando suscripciones:", err))
      .finally(() => setLoading(false));
  }, []);

  const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const resumen = suscripciones.reduce((acc, s) => {
    const estado = s.Estado || "Sin estado";
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <div className="mb-4 flex gap-2 justify-end no-print">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
        >
          Volver
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Imprimir
        </button>
      </div>

      <div className="print-area">
        <div className="text-center mb-3">
          <h1 className="text-lg font-bold">Reporte de Suscripciones</h1>
          <p className="text-gray-600 text-xs">Generado el {fechaGeneracion}</p>
        </div>

        {loading ? (
          <div className="text-center text-sm">Cargando suscripciones...</div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-500 text-xs">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-1 py-0.5 text-left w-10">ID</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">Cliente</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">Dirección del Servicio</th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left w-20">Estado</th>
                </tr>
              </thead>
              <tbody>
                {suscripciones.map((s) => (
                  <tr key={s.idSuscripcion} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-1 py-0">{s.idSuscripcion}</td>
                    <td className="border border-gray-300 px-1 py-0">{s.nombreCliente}</td>
                    <td className="border border-gray-300 px-1 py-0">{s.direccionServicio}</td>
                    <td className="border border-gray-300 px-1 py-0">{s.Estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 text-xs border-t border-gray-400 pt-2">
              <span className="font-bold">Total: {suscripciones.length}</span>
              {Object.entries(resumen).map(([estado, count]) => (
                <span key={estado} className="ml-4">
                  {estado}: <span className="font-semibold">{count}</span>
                </span>
              ))}
            </div>
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
            font-size: 7.5pt;
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            padding: 1px 3px;
            line-height: 1.3;
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

export default ImprimirSuscripcionesPage;
