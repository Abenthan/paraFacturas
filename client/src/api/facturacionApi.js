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

export const getFacturaRequest = async (idFactura) =>
  await axios.get(`/factura/${idFactura}`);

export const registrarPagoRequest = async (idFactura, valorPago) =>
  await axios.post(`/pagarFactura`, { idFactura, valorPago });


export const obtenerPagosRequest = async (filtros) =>
  await axios.get("/pagos", { params: filtros });

export const obtenerPagoRequest = async (idPago) =>
  await axios.get(`/pago/${idPago}`);
