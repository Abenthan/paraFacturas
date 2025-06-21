import { createContext, useContext, useState, useEffect } from "react";
import {
  createClienteRequest,
  getClientesRequest,
  getClienteRequest,
  updateClienteRequest,
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
  const [cliente, setCliente] = useState({});
  const [errors, setErrors] = useState([]);

  const getClientes = async () => {
    try {
      const res = await getClientesRequest();
      setClientes(res.data);
    } catch (error) {
      console.error("Error Catch en getClientes: ", error);
    }
  };

  const getCliente = async (id) => {
    try {
      const res = await getClienteRequest(id);
      setCliente(res.data);
      return res;
    } catch (error) {
      console.error("Error Catch en getCliente: ", error);
    }
  };

  const newCliente = async (cliente) => {
    try {
      const res = await createClienteRequest(cliente);
      return res;
    } catch (error) {

      setErrors(error.response.data);
    }
  };

  const updateCliente = async (id, cliente) => {
    try {
      const respuestaUpdate = await updateClienteRequest(id, cliente);
      return respuestaUpdate;
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
    <ClientesContext.Provider
      value={{
        clientes,
        cliente,
        setCliente,
        getClientes,
        getCliente,
        newCliente,
        updateCliente,
        errors,
        setErrors,
      }}
    >
      {children}
    </ClientesContext.Provider>
  );
};
