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

export const crearFacturasRequest = async (suscripciones, year, mes, usuarioId) =>
  await axios.post("/facturas", {
    suscripciones,
    year,
    mes,
    usuarioId,
  });

export const getFacturaRequest = async (idFactura) =>
  await axios.get(`/factura/${idFactura}`);

export const registrarPagoRequest = async (idFactura, valorPago, idSuscripcion, usuarioId) =>
  await axios.post(`/pagarFactura`, { idFactura, valorPago, idSuscripcion, usuarioId });

export const obtenerPagosRequest = async (filtros) =>
  await axios.get("/pagos", { params: filtros });

export const obtenerPagoRequest = async (idPago) =>
  await axios.get(`/pago/${idPago}`);

export const obtenerCarteraRequest = async (filtros) =>
  await axios.get("/cartera", { params: filtros });

export const getEstadoCuentaClienteRequest = async (idCliente) =>
  await axios.get(`/estadoCuentaCliente/${idCliente}`);

export const getCarteraSuscripcionRequest = async (idSuscripcion) =>
  await axios.get(`/carteraSuscripcion/${idSuscripcion}`);
