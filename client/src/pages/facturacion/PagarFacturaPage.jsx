import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFacturacion } from "../../context/FacturacionContext";

function PagarFacturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { obtenerFactura, registrarPago } = useFacturacion();

  const [factura, setFactura] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [valorPagar, setValorPagar] = useState(0);
  const [valorPago, setValorPago] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerFactura(id);
        setFactura(data.factura);
        setPagos(data.pagos || []);
        setSaldoPendiente(data.saldoPendienteAnterior || 0);
        const abonosFactura =
          data.pagos?.reduce((sum, p) => sum + p.valorPago, 0) || 0;
        setAbonos(abonosFactura);
        const totalPagar = data.factura.valor - abonosFactura + Number(data.saldoPendienteAnterior);
        setValorPagar(totalPagar);
        setValorPago(totalPagar); 
      } catch (error) {
        console.error("Error cargando factura:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handlePagar = async () => {

    if (valorPago <= 0) {
       alert("Debe ingresar un valor mayor a cero.");
       return;
    }

     if (valorPago > valorPagar) {
       alert("El valor a pagar no puede ser mayor al saldo pendiente.");
       return;
     }

    try {
      const respuestaPago = await registrarPago(id, valorPago, factura.idSuscripcion, user.id);
      alert("Pago registrado con éxito.");
      navigate(`/pago/${respuestaPago.data.idPago}`);
    } catch (error) {
      console.error("Error registrando el pago:", error);
      alert("Ocurrió un error al registrar el pago.");
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center mt-8 text-xl">
        Cargando datos...
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="text-red-500 text-center mt-8 text-xl">
        Factura no encontrada
      </div>
    );
  }


  return (
    <div className="container mx-auto p-6 text-white">
      {/* Enlace a regresar a la factura */}
      <Link
        to={`/factura/${factura.idFactura}`}
        className="text-blue-400 hover:underline mb-4 inline-block"
      >
        &larr; Volver a la factura
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center">Registrar Pago</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-4 max-w-xl mx-auto">
        <p>
          <strong>Código de Factura:</strong> {factura.codigoFactura}
        </p>
        <p>
          <strong>Cliente:</strong> {factura.nombreCliente}
        </p>
        <p>
          <strong>Valor Factura:</strong> ${factura.valor.toLocaleString()}
        </p>
        {abonos > 0 && (
          <p>
            <strong>Abonos:</strong> ${abonos.toLocaleString()}
          </p>
        )}
        {saldoPendiente > 0 && (
          <p>
            <strong>Saldo Pendiente:</strong> $
            {Number(saldoPendiente).toLocaleString()}
          </p>
        )}
        <p>
          <strong>Saldo total a pagar:</strong> ${valorPagar.toLocaleString()}
        </p>

        <div>
          <label className="block mb-2 font-semibold">Valor a pagar:</label>
          <input
            type="number"
            value={valorPago}
            onChange={(e) => setValorPago(Number(e.target.value))}
            min="0"
            max={valorPagar}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 w-full"
          />
        </div>

        <button
          onClick={handlePagar}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-lg transition"
        >
          Registrar Pago
        </button>
      </div>
    </div>
  );
}

export default PagarFacturaPage;
