import axios from "./axios.js";

export const getFacturasRequest = async (filtros) =>
  await axios.get("/facturas", { params: filtros });

export const getPrefacturacionRequest = async (year, mes) =>
  await axios.get("/prefacturacion", {
    params: {
      year,
      mes,
    },
  });

export const crearFacturasRequest = async (suscripciones, year, mes) =>
  await axios.post("/facturas", {
    suscripciones,
    year,
    mes,
  });
