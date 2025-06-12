import { useParams, Link } from "react-router-dom";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useEffect, useState } from "react";
import { use } from "react";

function NovedadesSuscripcionPage() {
  const { idSuscripcion } = useParams();
  const { suscripcion, getSuscripcion, getNovedadesSuscripcion } =
    useSuscripciones();
  const [novedades, setNovedades] = useState([]);

  useEffect(() => {
    const fetchSuscripcion = async () => {
      try {
        const resSuscripcion = await getSuscripcion(idSuscripcion);
        if (resSuscripcion) {
          // obtener las novedades de la suscripción
          const resNovedades = await getNovedadesSuscripcion(idSuscripcion);
         
          if (resNovedades && resNovedades.status === 200) {
            setNovedades(resNovedades.data);
          } else {
            setNovedades([]);
          }
        }
      } catch (error) {}
    };
    fetchSuscripcion();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-5xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        {/* Botón de regreso */}
        <div className="mb-4">
          <Link
            to={`/carteraSuscripcion/${idSuscripcion}`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← ver Suscripcion
          </Link>
        </div>

        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Novedades de la suscripción #{idSuscripcion}
          </h1>
          <p className="text-gray-300">
            Cliente:{" "}
            <span className="text-white font-semibold">
              {suscripcion.nombreCliente}
            </span>
          </p>
          <p className="text-gray-300">
            Producto:{" "}
            <span className="text-white font-semibold">
              {suscripcion.nombreProducto}
            </span>
          </p>
          <p className="text-gray-300">
            Dirección del servicio:{" "}
            <span className="text-white font-semibold">
              {suscripcion.direccionServicio}
            </span>
          </p>
          <p className="text-gray-300">
            Estado de la suscripción:{" "}
            <span className="text-white font-semibold">
              {suscripcion.Estado}
            </span>
          </p>
        </div>
        {/* Tabla de Novedades */}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th className="px-4 py-3">id Novedad</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Novedad</th>
              </tr>
            </thead>
            <tbody>
              {novedades.map((novedad) => (
                <tr
                  key={novedad.idNovedad}
                  className="border-b border-zinc-600"
                >
                  <td className="px-4 py-3">{novedad.idNovedad}</td>
                  <td className="px-4 py-3">
                    {new Date(novedad.fechaNovedad).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </td>
                  <td className="px-4 py-3">{novedad.novedad}</td>
                </tr>
              ))}
              {novedades.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No hay novedades para esta suscripción.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NovedadesSuscripcionPage;
