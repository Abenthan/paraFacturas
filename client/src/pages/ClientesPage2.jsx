import { useClientes } from "../context/ClientesContext";
import { useEffect } from "react";

function ClientesPage() {
  const { getClientes, clientes } = useClientes();
  useEffect(() => {
    getClientes();
  }, []);

  return (
    <div>
      {clientes.map((cliente) => (
        <div key={cliente.idCliente}>
          <h2>{cliente.nombreCliente}</h2>
          <p>{cliente.codigo}</p>
          <p>{cliente.numeroId}</p>
          <p>{cliente.telefono}</p>
          <p>{cliente.direccion}</p>
        </div>
      ))}

    </div>
  );
}

export default ClientesPage;
