import { useProductos } from "../../context/ProductosContext.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductosPage() {
  const { productos, getProductos } = useProductos();
  const [orden, setOrden] = useState({ campo: "idProducto", direccion: "asc" });

  useEffect(() => {
    getProductos();
  }, []);

  const ordenarProductos = (campo) => {
    const nuevaDireccion = orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
    setOrden({ campo, direccion: nuevaDireccion });
  };

  const productosOrdenados = [...productos].sort((a, b) => {
    let valorA = a[orden.campo];
    let valorB = b[orden.campo];

    // Comparación para strings sin sensibilidad a mayúsculas
    if (typeof valorA === "string") {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    if (valorA < valorB) return orden.direccion === "asc" ? -1 : 1;
    if (valorA > valorB) return orden.direccion === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Productos</h1>
          <Link
            to="/crearProducto"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            + Nuevo Producto
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                {/* Encabezados clicables para ordenar */}
                <th className="px-4 py-3 cursor-pointer" onClick={() => ordenarProductos("idProducto")}>
                  ID {orden.campo === "idProducto" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => ordenarProductos("nombreProducto")}>
                  Nombre Producto {orden.campo === "nombreProducto" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => ordenarProductos("estadoProducto")}>
                  Estado {orden.campo === "estadoProducto" ? (orden.direccion === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosOrdenados.map((producto) => (
                <tr
                  key={producto.idProducto}
                  className="border-b border-zinc-700 hover:bg-zinc-700"
                >
                  <td className="px-4 py-2">{producto.idProducto}</td>
                  <td className="px-4 py-2">{producto.nombreProducto}</td>
                  <td className="px-4 py-2">
                    ${producto.precioProducto.toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 py-2">{producto.estadoProducto}</td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/producto/${producto.idProducto}`}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 010 2.828l-9.5 9.5a1 1 0 01-.293.207l-4 2a1 1 0 01-1.316-1.316l2-4a1 1 0 01.207-.293l9.5-9.5a2 2 0 012.828 0z" />
                      </svg>
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductosPage;
