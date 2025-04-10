import { useClientes } from "../context/ClientesContext";
import { useSuscripciones } from "../context/SuscripcionesContext";
import { useEffect, useState } from "react"; // Importa useState
import { useParams, Link } from "react-router-dom";

function Suscripciones() {
  const params = useParams();
  const { getCliente } = useClientes();
  const [cliente, setCliente] = useState(null); // Agrega estado para el cliente

  useEffect(() => {
    async function loadCliente() {
      if (params.id) {
        const clienteData = await getCliente(params.id);
        if (clienteData) {
          setCliente(clienteData); // Guarda el cliente en el estado
          console.log(clienteData);
        }
      }
    }
    loadCliente();
  }, [params.id]);

  return (
    <div>
      <h1>Suscripciones</h1>
      <p>Esta es la página de suscripciones del cliente:</p>
      
      <p>Cliente ID: {params.id}</p>
      {cliente && ( // Solo muestra si cliente existe
        <>
          <p>Nombre del Cliente: {cliente.nombreCliente}</p>
          <p>Apellido del Cliente: {cliente.apellidoCliente}</p>
        </>
      )}
      <Link to="/clientes" className="text-blue-500 hover:underline">
        Volver a la lista de clientes
      </Link>
    </div>
  );
}

export default Suscripciones;