import axios from "./axios.js";

export const getClientesRequest = () => axios.get(`/clientes`);
export const getClienteRequest = (id) => axios.get(`/cliente/${id}`);
export const createClienteRequest = (cliente) => axios.post(`/nuevoCliente`, cliente);

export const updateClienteRequest = (id, cliente) => axios.put(`/clientes/${id}`, cliente);
export const deleteClienteRequest = (id) => axios.delete(`/clientes/${id}`);
