import { useClientes } from "../context/ClientesContext";

function ClientePage() {
  const { cliente } = useClientes();

  return (
    <div>
      <p>Cliente:</p>
      <h2 className="text-2xl font-bold text-white mb-4">
        {cliente?.nombreCliente}
      </h2>
    </div>
  );
}

export default ClientePage;
