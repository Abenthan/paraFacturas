import axios from "./axios.js";

export const getSuscripcionesRequest = (id) =>
  axios.get(`/suscripcion/${id}`);
export const getSuscripcionRequest = (id) => axios.get(`/suscripcion/${id}`);

export const createSuscripcionRequest = (suscripcion) =>
  axios.post(`/suscripcion`, suscripcion);

export const updateSuscripcionRequest = (id, suscripcion) =>
  axios.put(`/suscripcion/${id}`, suscripcion);
