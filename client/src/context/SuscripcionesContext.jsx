import { createContext, useContext, useState, useEffect } from "react";

import {
  getSuscripcionesRequest,
  getSuscripcionesClienteRequest,
  getSuscripcionRequest,
  createSuscripcionRequest,
  updateSuscripcionRequest,
  suspenderSuscripcionRequest,
  obtenerFacturaReconexionRequest,
  insertarFacturaReconexionRequest,
  reconexionSuscripcionRequest,
  retirarSuscripcionRequest,
  reactivarSuscripcionRequest,  
  crearFacturaTrasladoRequest
} from "../api/suscripcionesApi";

import { getNovedadesSuscripcionRequest } from "../api/novedadesApi";

export const SuscripcionesContext = createContext();

export const useSuscripciones = () => {
  const context = useContext(SuscripcionesContext);
  if (!context) {
    throw new Error(
      "useSuscripciones must be used within a SuscripcionesProvider"
    );
  }
  return context;
};

export const SuscripcionesProvider = ({ children }) => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [suscripcion, setSuscripcion] = useState({});
  const [errors, setErrors] = useState([]);

  const getSuscripciones = async () => {
    try {
      const response = await getSuscripcionesRequest();
      setSuscripciones(response.data);
    } catch (error) {
      console.error("Error fetching suscripciones:", error);
    }
  };

  const getSuscripcionesCliente = async (id) => {
    try {
      const response = await getSuscripcionesClienteRequest(id);
      setSuscripciones(response.data);
    } catch (error) {
      console.error("Error fetching suscripciones:", error);
    }
  };

  const getSuscripcion = async (id) => {
    try {
      const response = await getSuscripcionRequest(id);
      setSuscripcion(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching suscripcion:", error);
    }
  };

  const createSuscripcion = async (suscripcion) => {
    try {
      const response = await createSuscripcionRequest(suscripcion);
      setSuscripciones((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error creating suscripcion:", error);
    }
  };

  const suspenderSuscripcion = async (id, usuarioId) => {
    try {
      const response = await suspenderSuscripcionRequest(id, usuarioId);
      return response;
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const updateSuscripcion = async (id, suscripcion) => {
    try {
      const response = await updateSuscripcionRequest(id, suscripcion);
      setSuscripcion(response.data);
      return response;
    } catch (error) {
      setErrors(error.response.data);
      return error.response.data;
    }
  };

  const obtenerFacturaReconexion = async (idSuscripcion) => {
    try {
      const response = await obtenerFacturaReconexionRequest(idSuscripcion);
      return response.data;
    } catch (error) {
      console.error("Error fetching factura de reconexion:", error);
      return null;
    }
  };

  const insertarFacturaReconexion = async (data) => {
    try {
      const respuestaFacturaReconexion = await insertarFacturaReconexionRequest(
        data
      );
      return respuestaFacturaReconexion.data;
    } catch (error) {
      console.error("Error inserting factura de reconexion:", error);
      return null;
    }
  };

  const reconexionSuscripcion = async (data) => {
    try {
      const respuestaReconexion = await reconexionSuscripcionRequest(data);
      return respuestaReconexion.data;
    } catch (error) {
      console.error("Error reconectando suscripcion:", error);
      return null;
    }
  };

  const retirarSuscripcion = async (data) => {
    try {
      const respuestaRetirar = await retirarSuscripcionRequest(data);
      return respuestaRetirar;
    } catch (error) {
      console.error("Error retirando suscripcion:", error);
      return null;
    }
  };

  const reactivarSuscripcion = async (data) => {
    try {
      console.log("Reactivando suscripcion con data:", data);
      const respuestaReactivar = await reactivarSuscripcionRequest(data);
      return respuestaReactivar;
    } catch (error) {
      console.error("Error reactivando suscripcion:", error);
      return null;
    }
  };

  const insertarFacturaTraslado = async (data) => {
    try {
      const respuestaFacturaTraslado = await crearFacturaTrasladoRequest(data);
      return respuestaFacturaTraslado.data;
    }
    catch (error) {
      console.error("Error inserting factura de traslado:", error);
      return null;
    }
  };
    
  const getNovedadesSuscripcion = async (idSuscripcion) => {
    try {
      const response = await getNovedadesSuscripcionRequest(idSuscripcion);
      return response;
    } catch (error) {
      console.error("Error fetching novedades de la suscripción:", error);
      return null;
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <SuscripcionesContext.Provider
      value={{
        suscripciones,
        suscripcion,
        getSuscripciones,
        getSuscripcionesCliente,
        getSuscripcion,
        createSuscripcion,
        updateSuscripcion,
        suspenderSuscripcion,
        obtenerFacturaReconexion,
        insertarFacturaReconexion,
        reconexionSuscripcion,
        retirarSuscripcion,
        reactivarSuscripcion,
        insertarFacturaTraslado,
        getNovedadesSuscripcion,
        errors,
        setErrors,
      }}
    >
      {children}
    </SuscripcionesContext.Provider>
  );
};
