import axios from "./axios.js";

export const getFacturasRequest = async (year, mes) =>
  await axios.get("/facturas", {
    params: {
      year,
      mes,
    },
  });
