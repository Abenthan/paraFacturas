import { useParams, Link } from "react-router-dom";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useFacturacion } from "../../context/FacturacionContext";
import { useEffect, useState } from "react";

function CarteraSuscripcionPage() {
  const { id: suscripcionId } = useParams();
  const { suscripcion, getSuscripcion } = useSuscripciones();
  const { getCarteraSuscripcion } = useFacturacion();
  const [facturas, setFacturas] = useState([]);

  // Cargar datos de la suscripción
  useEffect(() => {
    const fetchSuscripcion = async () => {
      try {
        await getSuscripcion(suscripcionId);
      } catch (error) {
        console.error("Error al obtener la suscripción:", error);
      }
    };
    fetchSuscripcion();
  }, [suscripcionId]);

  // Cargar cartera de la suscripción
  useEffect(() => {
    const fetchCartera = async () => {
      try {
        const cartera = await getCarteraSuscripcion(suscripcionId);
        setFacturas(cartera);
      } catch (error) {
        console.error("Error al obtener cartera:", error);
      }
    };
    fetchCartera();
  }, [suscripcionId]);

  if (!suscripcion) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        Cargando información de la suscripción...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-5xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {/* Botón de regreso */}
        <div className="mb-4">
          <Link
            to={`/suscripcion/${suscripcionId}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Ir a la Suscripción
          </Link>
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Estado de cuenta de la suscripción #{suscripcionId}
          </h1>
          <p className="text-gray-300">Cliente: <span className="text-white font-semibold">{suscripcion.nombreCliente}</span></p>
          <p className="text-gray-300">Producto: <span className="text-white font-semibold">{suscripcion.nombreProducto}</span></p>
          <p className="text-gray-300">Dirección del servicio: <span className="text-white font-semibold">{suscripcion.direccionServicio}</span></p>
        </div>

        {/* Tabla de facturas */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">Código Factura</th>
                <th className="px-4 py-3">Valor Factura</th>
                <th className="px-4 py-3">Total Pagado</th>
                <th className="px-4 py-3">Saldo Pendiente</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => {
                const saldo = factura.valorFactura - factura.totalPagado;
                return (
                  <tr
                    key={factura.idFactura}
                    className="border-b border-zinc-700 hover:bg-zinc-700"
                  >
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
          </table>
        </div>
      </div>
    </div>
  );
}

export default CarteraSuscripcionPage;
