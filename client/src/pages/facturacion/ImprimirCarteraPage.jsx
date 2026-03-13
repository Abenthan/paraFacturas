import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { obtenerCarteraRequest } from "../../api/facturacionApi";

function ImprimirCarteraPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cartera, setCartera] = useState([]);
  const [loading, setLoading] = useState(true);

  const filtros = {
    estado: searchParams.get("estado") || "",
    cliente: searchParams.get("cliente") || "",
    idSuscripcion: searchParams.get("idSuscripcion") || "",
  };

  useEffect(() => {
    obtenerCarteraRequest(filtros)
      .then((res) => setCartera(res.data))
      .catch((err) => console.error("Error cargando cartera:", err))
      .finally(() => setLoading(false));
  }, []);

  const fechaGeneracion = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalSaldo = cartera.reduce(
    (acc, item) => acc + Number(item.saldoPendiente),
    0
  );
  const totalFacturas = cartera.reduce(
    (acc, item) => acc + Number(item.cantidadFacturas),
    0
  );

  const tituloFiltro = [
    filtros.estado && `Estado: ${filtros.estado}`,
    filtros.cliente && `Cliente: ${filtros.cliente}`,
    filtros.idSuscripcion && `Suscripción: ${filtros.idSuscripcion}`,
  ]
    .filter(Boolean)
    .join(" | ");

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
          <div className="font-bold text-base">Reporte de Cartera</div>
          {tituloFiltro && (
            <div className="text-xs text-gray-600">Filtro: {tituloFiltro}</div>
          )}
          <div className="text-xs text-gray-500">Generado el {fechaGeneracion}</div>
        </div>

        {loading ? (
          <div className="text-center text-sm">Cargando cartera...</div>
        ) : cartera.length === 0 ? (
          <div className="text-center text-sm">
            No hay suscripciones con saldo pendiente.
          </div>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-500 text-xs">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-8">
                    ID
                  </th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">
                    Cliente
                  </th>
                  <th className="border border-gray-400 px-1 py-0.5 text-left">
                    Dirección del Servicio
                  </th>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-20">
                    Estado
                  </th>
                  <th className="border border-gray-400 px-1 py-0.5 text-right w-24">
                    Saldo Pendiente
                  </th>
                  <th className="border border-gray-400 px-1 py-0.5 text-center w-14">
                    Cant. Fact.
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartera.map((item) => (
                  <tr
                    key={item.idSuscripcion}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-1 py-0 text-center">
                      {item.idSuscripcion}
                    </td>
                    <td className="border border-gray-300 px-1 py-0">
                      {item.nombreCliente}
                    </td>
                    <td className="border border-gray-300 px-1 py-0">
                      {item.direccionServicio}
                    </td>
                    <td className="border border-gray-300 px-1 py-0 text-center">
                      {item.estadoSuscripcion}
                    </td>
                    <td className="border border-gray-300 px-1 py-0 text-right">
                      ${Number(item.saldoPendiente).toLocaleString("es-CO")}
                    </td>
                    <td className="border border-gray-300 px-1 py-0 text-center">
                      {item.cantidadFacturas}
                    </td>
                  </tr>
                ))}
                {/* Fila de totales */}
                <tr className="bg-gray-200 font-bold">
                  <td
                    colSpan={4}
                    className="border border-gray-400 px-1 py-0.5 text-right"
                  >
                    Total ({cartera.length} suscripciones):
                  </td>
                  <td className="border border-gray-400 px-1 py-0.5 text-right">
                    ${totalSaldo.toLocaleString("es-CO")}
                  </td>
                  <td className="border border-gray-400 px-1 py-0.5 text-center">
                    {totalFacturas}
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

export default ImprimirCarteraPage;
