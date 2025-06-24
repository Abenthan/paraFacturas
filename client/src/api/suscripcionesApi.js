import axios from "./axios.js";

export const getSuscripcionesClienteRequest = (id) =>
  axios.get(`/suscripcionesCliente/${id}`);

export const getSuscripcionesRequest = () => axios.get(`/suscripciones`);

export const createSuscripcionRequest = (suscripcion) =>
  axios.post(`/suscripcion`, suscripcion);

export const getSuscripcionRequest = (id) =>
  axios.get(`/suscripcion/${id}`);

export const updateSuscripcionRequest = (id, suscripcion) =>
  axios.put(`/suscripcion/${id}`, suscripcion);

export const suspenderSuscripcionRequest = (id, usuarioId) =>
  axios.put(`/suspenderSuscripcion/${id}`, { usuarioId });

export const obtenerFacturaReconexionRequest = (idSuscripcion) =>
  axios.get(`/facturaReconexion/${idSuscripcion}`);

export const insertarFacturaReconexionRequest = (data) =>
  axios.post(`/facturaReconexion`, data);

export const reconexionSuscripcionRequest = (data) =>
  axios.post(`/reconexionSuscripcion`, data);

export const retirarSuscripcionRequest = (data) =>
  axios.post(`/retirarSuscripcion`, data);

export const reactivarSuscripcionRequest = (data) =>
  axios.post(`/reactivarSuscripcion`, data);

export const getNovedadesSuscripcionRequest = (idSuscripcion) =>
  axios.get(`/suscripciones/novedades/${idSuscripcion}`);