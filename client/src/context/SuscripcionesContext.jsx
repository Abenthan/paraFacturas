import { createContext, useContext, useState } from "react";

import {
  getSuscripcionesRequest,
  getSuscripcionRequest,
  createSuscripcionRequest,
  updateSuscripcionRequest,
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
  const [suscripcion, setSuscripcion] = useState(null);

  const getSuscripciones = async (id) => {
    try {
      const response = await getSuscripcionesRequest(id);
      setSuscripciones(response.data);
    } catch (error) {
      console.error("Error fetching suscripciones:", error);
    }
  };
  

  const getSuscripcion = async (id) => {
    try {
      const response = await getSuscripcionRequest(id);
      setSuscripcion(response.data);
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

  return (
    <SuscripcionesContext.Provider
      value={{
        suscripciones,
        suscripcion,
        getSuscripciones,
        getSuscripcion,
        createSuscripcion,
      }}
    >
      {children}
    </SuscripcionesContext.Provider>
  );
};
