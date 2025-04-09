import { useProductos } from "../context/ProductosContext.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProductosPage() {
  const { productos, getProductos } = useProductos();

  useEffect(() => {
    getProductos();
  }, []);

  return (
    <div>
      <h1>Productos</h1>
      <Link to="/productos/nuevo">Nuevo Producto</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre Producto</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.idProducto}>
              <td>{producto.nombreProducto}</td>
              <td>{producto.precioProducto}</td>
              <td>
                <Link to={`/producto/${producto.idProducto}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductosPage;
