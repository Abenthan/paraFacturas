import { createContext, useContext, useState, useEffect } from "react";
import {
  createClienteRequest,
  getClientesRequest,
  getClienteRequest,
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

  const getCliente = async (id) => {
    try {
      const res = await getClienteRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error Catch en getCliente: ", error);
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
    <ClientesContext.Provider
      value={{ clientes, getClientes, getCliente, newCliente }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
