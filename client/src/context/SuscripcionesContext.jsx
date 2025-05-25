import { createContext, useContext, useState, useEffect } from "react";

import {
  getSuscripcionesRequest,
  getSuscripcionesClienteRequest,
  getSuscripcionRequest,
  createSuscripcionRequest,
  updateSuscripcionRequest,
  suspenderSuscripcionRequest,
} from "../api/suscripcionesApi";

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

  }

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
        errors,
        setErrors,
      }}
    >
      {children}
    </SuscripcionesContext.Provider>
  );
};
