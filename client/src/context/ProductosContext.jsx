import { createContext, useContext, useState } from "react";
import {
  getProductoRequest,
  getProductosRequest,
  createProductoRequest,
  updateProductoRequest,
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
  const [producto, setProducto] = useState({});
  const [errors, setErrors] = useState([]);

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
      return res;
    } catch (error) {
      console.error("Error Catch en newProducto: ", error);
    }
  };

  const getProducto = async (id) => {
    try {
      const res = await getProductoRequest(id);
      setProducto(res.data);
      return res.data;
    } catch (error) {
      console.error("Error Catch en getProducto: ", error);
    }
  };

  const updateProducto = async (id, producto) => {
    try {
      const res = await updateProductoRequest(id, producto);
      return res;
    } catch (error) {
      console.error("Error Catch en updateProducto: ", error);
      setErrors(error.response.data);
      return error.response.data;    }
  }

  return (
    <ProductosContext.Provider
      value={{ productos, producto, errors, getProductos, newProducto, getProducto, updateProducto }}
    >
      {children}
    </ProductosContext.Provider>
  );
};
