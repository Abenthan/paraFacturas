import axios from "./axios.js";

export const getProductosRequest = () => axios.get(`/productos`);
export const getProductoRequest = (id) => axios.get(`/producto/${id}`);
export const createProductoRequest = (producto) => axios.post(`/nuevoProducto`, producto);
export const updateProductoRequest = (id, producto) => axios.put(`/productos/${id}`, producto);
export const deleteProductoRequest = (id) => axios.delete(`/productos/${id}`);