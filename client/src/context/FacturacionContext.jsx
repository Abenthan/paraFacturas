import { createContext, useContext, useState, useEffect } from "react";
import { getFacturasRequest } from "../api/facturacionApi";

export const FacturacionContext = createContext();

export const useFacturacion = () => {
  const context = useContext(FacturacionContext);
  if (!context) {
    throw new Error("useFacturacion must be used within a FacturacionProvider");
  }
  return context;
};

export const FacturacionProvider = ({ children }) => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getFacturas = async (filtro) => {
        try {
        const res = await getFacturasRequest(filtro);
        setFacturas(res.data);
        } catch (error) {
        console.error("Error al obtener las facturas:", error);
        } finally {
        setLoading(false);
        }
    };
    
    return (
        <FacturacionContext.Provider value={{ facturas, loading, getFacturas }}>
        {children}
        </FacturacionContext.Provider>
    );
    };

