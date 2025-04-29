import { createContext, useContext, useState, useEffect } from "react";
import {
  getFacturasRequest,
  getPrefacturacionRequest,
  crearFacturasRequest,
  getFacturaRequest,
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

  const generarFacturas = async (suscripciones, year, mes) => {
    try {
      const res = await crearFacturasRequest(suscripciones, year, mes);
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
  }

  return (
    <FacturacionContext.Provider
      value={{
        prefacturacionRegistros,
        obtenerFacturas,
        obtenerRegistrosPrefacturacion,
        generarFacturas,
        obtenerFactura,
      }}
    >
      {children}
    </FacturacionContext.Provider>
  );
};
