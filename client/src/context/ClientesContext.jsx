import { createContext, useContext, useState, useEffect } from "react";
import {
  createClienteRequest,
  getClientesRequest,
} from "../api/clientesApi.js";

export const ClientesContext = createContext();

export const useClientes = () => {
  const context = useContext(ClientesContext);
  if (!context) {
    throw new Error("useClientes must be used within a ClientesProvider");
  }

  return context;
};

export const ClientesProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);

  const getClientes = async () => {
    try {
      const res = await getClientesRequest();
      setClientes(res.data);
      console.log("Clientes obtenidos:", res.data);
    } catch (error) {
      console.error("Error Catch en getClientes: ", error);
    }
  };

  const newCliente = async (cliente) => {
    try {
      const res = await createClienteRequest(clientes);
      setClientes(res.data);

      console.log("Cliente creado:", res.data);
    } catch (error) {
      console.error("Error Catch en newCliente: ", error);
    }
  };

  return (
    <ClientesContext.Provider value={{ clientes, getClientes, newCliente }}>
      {children}
    </ClientesContext.Provider>
  );
};
