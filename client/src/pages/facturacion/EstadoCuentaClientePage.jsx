import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClientes } from "../../context/ClientesContext";
import { useFacturacion } from "../../context/FacturacionContext";

function EstadoCuentaClientePage() {
  const { id } = useParams();
  const { getCliente, cliente } = useClientes();
  const { getEstadoCuentaCliente } = useFacturacion();

  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const clienteData = cliente;
        console.log(id);
        if (clienteData && id) {
          const facturasData = await getEstadoCuentaCliente(id);
          setFacturas(facturasData);
        }
      } catch (error) {
        console.error("Error al cargar estado de cuenta:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, [id]);

  const calcularSaldoPendiente = (factura) => {
    return factura.valorFactura - factura.totalPagado;
  };

  const totalSaldo = facturas.reduce(
    (acc, factura) => acc + calcularSaldoPendiente(factura),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando estado de cuenta...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-6xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          <Link
            to={`/cliente/${cliente?.idCliente}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Ver Cliente
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          Estado de cuenta de: {cliente?.nombreCliente}
        </h1>

        {facturas.length === 0 ? (
          <p className="text-gray-300">
            Este cliente no tiene facturas pendientes por pagar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
                <tr>
                  <th className="px-4 py-3">
                    Numero de
                    <br /> Suscripción
                  </th>
                  <th className="px-4 py-3">Código Factura</th>
                  <th className="px-4 py-3">Valor Factura</th>
                  <th className="px-4 py-3">Total Pagado</th>
                  <th className="px-4 py-3">Saldo Pendiente</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => {
                  const saldo = calcularSaldoPendiente(factura);
                  return (
                    <tr
                      key={factura.idFactura}
                      className="border-b border-zinc-700 hover:bg-zinc-700"
                    >
                      <td className="px-4 py-2">{factura.suscripcion_id}</td>
                      <td className="px-4 py-2">{factura.codigoFactura}</td>
                      <td className="px-4 py-2">
                        ${factura.valorFactura.toLocaleString("es-CO")}
                      </td>
                      <td className="px-4 py-2">
                        ${factura.totalPagado.toLocaleString("es-CO")}
                      </td>
                      <td className="px-4 py-2 text-yellow-300 font-semibold">
                        ${saldo.toLocaleString("es-CO")}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/factura/${factura.idFactura}`}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                        >
                          Pagar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-zinc-700 font-bold text-white">
                  <td colSpan="4" className="px-4 py-3 text-right">
                    Total pendiente:
                  </td>
                  <td className="px-4 py-3 text-yellow-300">
                    ${totalSaldo.toLocaleString("es-CO")}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EstadoCuentaClientePage;
