import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SuscripcionesPage() {
  const { getSuscripciones, suscripciones } = useSuscripciones();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuscripciones = async () => {
      try {
        await getSuscripciones();
      } catch (error) {
        console.error("Error fetching suscripciones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuscripciones();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!suscripciones) {
    return <div>No hay suscripciones</div>;
  }

  return (
    <div>
      Pagina de Suscripciones
      {/* tabla de suscripciones */}
      <div>
        <table>
          <thead>
            <tr>
              <th>numero de suscripcion</th>
              <th>nombre de cliente</th>
              <th>nombre de producto</th>
              <th>direccion del servicio</th>
              <th>estado</th>
              <th>ver</th>
            </tr>
          </thead>
          <tbody>
            {suscripciones.map((suscripcion) => (
              <tr key={suscripcion.idSuscripcion}>
                <td>{suscripcion.idSuscripcion}</td>
                <td>{suscripcion.nombreCliente}</td>
                <td>{suscripcion.nombreProducto}</td>
                <td>{suscripcion.direccionServicio}</td>
                <td>{suscripcion.Estado}</td>
                <td>
                  <Link to={`/suscripcion/${suscripcion.idSuscripcion}`}>
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuscripcionesPage;
