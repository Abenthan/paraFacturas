import { createContext, useContext, useState } from "react";
import {
  getProductoRequest,
  getProductosRequest,
  createProductoRequest,
} from "../api/productosApi.js";

export const ProductosContext = createContext();
export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error("useProductos must be used within a ProductosProvider");
  }
  return context;
};

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);

  const getProductos = async () => {
    try {
      const res = await getProductosRequest();
      setProductos(res.data);
    } catch (error) {
      console.error("Error Catch en getProductos: ", error);
    }
  };

  const newProducto = async (producto) => {
    try {
      const res = await createProductoRequest(producto);
      setProductos(res.data);
      console.log("Producto creado:", res.data);
    } catch (error) {
      console.error("Error Catch en newProducto: ", error);
    }
  };

  const getProducto = async (id) => {
    try {
      const res = await getProductoRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error Catch en getProducto: ", error);
    }
  };

  return (
    <ProductosContext.Provider
      value={{ productos, getProductos, newProducto, getProducto }}
    >
      {children}
    </ProductosContext.Provider>
  );
};
