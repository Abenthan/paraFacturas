import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFacturacion } from "../../context/FacturacionContext";

function PagarFacturaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerFactura, registrarPago } = useFacturacion();

  const [factura, setFactura] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [valorPago, setValorPago] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerFactura(id);
        setFactura(data.factura);
        setPagos(data.pagos || []);
        const totalPagado = data.pagos?.reduce((sum, p) => sum + p.valorPago, 0) || 0;
        const saldo = data.factura.valor - totalPagado;
        setValorPago(saldo);
      } catch (error) {
        console.error("Error cargando factura:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, obtenerFactura]);

  const handlePagar = async () => {
    const totalPagado = pagos.reduce((sum, p) => sum + p.valorPago, 0);
    const saldo = factura.valor - totalPagado;

    if (valorPago <= 0) {
      alert("Debe ingresar un valor mayor a cero.");
      return;
    }

    if (valorPago > saldo) {
      alert("El valor a pagar no puede ser mayor al saldo pendiente.");
      return;
    }

    try {
      await registrarPago(factura.idFactura, valorPago);
      alert("Pago registrado con éxito.");
      navigate(`/factura/${factura.idFactura}`);
    } catch (error) {
      console.error("Error registrando el pago:", error);
      alert("Ocurrió un error al registrar el pago.");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-8 text-xl">Cargando datos...</div>;
  }

  if (!factura) {
    return <div className="text-red-500 text-center mt-8 text-xl">Factura no encontrada</div>;
  }

  const totalPagado = pagos.reduce((sum, p) => sum + p.valorPago, 0);
  const saldo = factura.valor - totalPagado;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrar Pago</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-4 max-w-xl mx-auto">
        <p><strong>Código de Factura:</strong> {factura.codigoFactura}</p>
        <p><strong>Cliente:</strong> {factura.nombreCliente}</p>
        <p><strong>Valor Total:</strong> ${factura.valor.toLocaleString()}</p>
        <p><strong>Total Pagado:</strong> ${totalPagado.toLocaleString()}</p>
        <p><strong>Saldo Pendiente:</strong> ${saldo.toLocaleString()}</p>

        <div>
          <label className="block mb-2 font-semibold">Valor a pagar:</label>
          <input
            type="number"
            value={valorPago}
            onChange={(e) => setValorPago(Number(e.target.value))}
            min="0"
            max={saldo}
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

