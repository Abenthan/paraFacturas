import { useParams, Link } from "react-router-dom";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useFacturacion } from "../../context/FacturacionContext";

import { useEffect, useState } from "react";

function CarteraSuscripcionPage() {
  const suscripcionId = useParams().id;
  const { suscripcion, getSuscripcion } = useSuscripciones();
  const { getCarteraSuscripcion } = useFacturacion();

  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchSuscripcion = async () => {
      try {
        const suscripcionObtenida = await getSuscripcion(suscripcionId);
        console.log("Suscripcion obtenida:", suscripcionObtenida);
      } catch (error) {
        console.error("Error fetching suscripcion:", error);
      }
    };

    fetchSuscripcion();
  }, [suscripcionId]);

  if (!suscripcion) {
    return <div>No hay suscripcion...</div>;
  }

  // obtener la cartera de la suscripcion
  useEffect(() => {
    const fetchCarteraSuscripcion = async () => {
      try {
        const carteraObtenida = await getCarteraSuscripcion(suscripcionId);
        setFacturas(carteraObtenida);
        console.log("Cartera de la suscripcion:", carteraObtenida);
      } catch (error) {
        console.error("Error fetching cartera de la suscripcion:", error);
      }
    };

    fetchCarteraSuscripcion();
  }, [suscripcionId]);

  return (
    <div>
      <Link
        to={`/suscripcion/${suscripcionId}`}
        className="text-blue-400 hover:text-blue-300 text-sm"
      >
        ← Ir a la Suscripcion
      </Link>
      <h1>Estado de cuenta de la suscripcion # {suscripcionId}</h1>
      <p>Nombre del Cliente: {suscripcion.nombreCliente}</p>
      <p>Producto: {suscripcion.nombreProducto}</p>
      <p>Direccion del servicio: {suscripcion.direccionServicio}</p>
      {/* tabla con los datos de carteraObtenida */}
      <table>
        <thead>
          <tr>
            <th>Codigo Factura</th>
            <th>Valor</th>
            <th>Total Pagado</th>
            <th>Saldo Pendiente</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* mapear los datos de la cartera obtenida */}
          {facturas.map((factura) => {
            // calcular el saldo pendiente
            const saldoPendiente = factura.valorFactura - factura.totalPagado;
            return (
              <tr key={factura.idFactura}>
                <td>{factura.codigoFactura}</td>
                <td>{factura.valorFactura}</td>
                <td>{factura.totalPagado}</td>
                <td>{saldoPendiente}</td>
                <td>
                  <Link to={`/factura/${factura.idFactura}`}>Pagar</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CarteraSuscripcionPage;
