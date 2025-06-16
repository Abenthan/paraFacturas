import { createContext, useContext, useState, useEffect } from "react";
import {
  getFacturasRequest,
  getPrefacturacionRequest,
  crearFacturasRequest,
  getFacturaRequest,
  registrarPagoRequest,
  obtenerPagosRequest,
  obtenerPagoRequest,
  obtenerCarteraRequest,
  getEstadoCuentaClienteRequest,
  getCarteraSuscripcionRequest,
} from "../api/facturacionApi";

export const FacturacionContext = createContext();

export const useFacturacion = () => {
  const context = useContext(FacturacionContext);
  if (!context) {
    throw new Error("useFacturacion must be used within a FacturacionProvider");
  }
  return context;
};

export const FacturacionProvider = ({ children }) => {
  const [prefacturacionRegistros, setPrefacturacionRegistros] = useState([]);

  const obtenerFacturas = async (filtros) => {
    try {
      const res = await getFacturasRequest(filtros);
      return res.data;
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const obtenerRegistrosPrefacturacion = async (year, mes) => {
    try {
      const res = await getPrefacturacionRequest(year, mes);
      setPrefacturacionRegistros(res.data);
      return res.data;
    } catch (error) {
      console.error("Error al obtener los registros de prefacturación:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const generarFacturas = async (suscripciones, year, mes, usuarioId) => {
    try {
      const res = await crearFacturasRequest(suscripciones, year, mes, usuarioId);
      return res.data;
    } catch (error) {
      console.error("Error al generar las facturas:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const obtenerFactura = async (idFactura) => {
    try {
      const res = await getFacturaRequest(idFactura);
      return res.data;
    } catch (error) {
      console.error("Error al obtener la factura:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };
  const registrarPago = async (idFactura, valorPago, idSuscripcion, usuarioId) => {
    try {
      const res = await registrarPagoRequest(idFactura, valorPago, idSuscripcion, usuarioId);
      return res.data;
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const obtenerPagos = async (filtros) => {
    try {
      const res = await obtenerPagosRequest(filtros);
      return res.data;
    } catch (error) {
      console.error("Error al obtener los pagos:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const obtenerPago = async (idPago) => {
    try {
      const res = await obtenerPagoRequest(idPago);
      return res.data;
    } catch (error) {
      console.error("Error al obtener el pago:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const obtenerCartera = async (filtros) => {
    try {
      const res = await obtenerCarteraRequest(filtros);
      return res.data;
    } catch (error) {
      console.error("Error al obtener la cartera:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const getEstadoCuentaCliente = async (idCliente) => {
    try {
      const res = await getEstadoCuentaClienteRequest(idCliente);
      return res.data;
    } catch (error) {
      console.error("Error al obtener el estado de cuenta del cliente:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  };

  const getCarteraSuscripcion = async (idSuscripcion) => {
    try {
      const res = await getCarteraSuscripcionRequest(idSuscripcion);
      return res.data;
    } catch (error) {
      console.error("Error al obtener la cartera de la suscripción:", error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  }

  return (
    <FacturacionContext.Provider
      value={{
        prefacturacionRegistros,
        obtenerFacturas,
        obtenerRegistrosPrefacturacion,
        generarFacturas,
        obtenerFactura,
        registrarPago,
        obtenerPagos,
        obtenerPago,
        obtenerCartera,
        getEstadoCuentaCliente,
        getCarteraSuscripcion,
      }}
    >
      {children}
    </FacturacionContext.Provider>
  );
};
