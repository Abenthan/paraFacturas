import { useProductos } from "../../context/ProductosContext.jsx";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function ProductosPage() {
  const { productos, getProductos } = useProductos();

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
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
                <th className="px-4 py-3">Nombre Producto</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.idProducto} className="border-b border-zinc-700 hover:bg-zinc-700">
                  <td className="px-4 py-2">{producto.nombreProducto}</td>
                  <td className="px-4 py-2">${producto.precioProducto}</td>
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
