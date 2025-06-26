import axios from "./axios.js";

export const getNovedadesSuscripcionRequest = (idSuscripcion) =>
  axios.get(`suscripciones/novedades/${idSuscripcion}`);

export const getNovedadesRequest = () =>
  axios.get("novedades");
