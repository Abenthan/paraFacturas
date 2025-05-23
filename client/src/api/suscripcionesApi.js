import axios from "./axios.js";

export const getSuscripcionesClienteRequest = (id) =>
  axios.get(`/suscripciones/${id}`);

export const getSuscripcionesRequest = () => axios.get(`/suscripciones`);

export const createSuscripcionRequest = (suscripcion) =>
  axios.post(`/suscripcion`, suscripcion);

export const getSuscripcionRequest = (id) =>
  axios.get(`/suscripcion/${id}`);

export const updateSuscripcionRequest = (id, suscripcion) =>
  axios.put(`/suscripcion/${id}`, suscripcion);
