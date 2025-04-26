import { useState } from "react";
import { useFacturacion } from "../context/FacturacionContext"; // Asumimos que vas a usar este context
import { useNavigate } from "react-router-dom";

function PrefacturacionPage() {
  const navigate = useNavigate();

  const { obtenerRegistrosPrefacturacion, generarFacturas } = useFacturacion();

  const [year, setYear] = useState("");
  const [mes, setMes] = useState("");
  const [registros, setRegistros] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      const data = await obtenerRegistrosPrefacturacion(year, mes);
      setRegistros(data);
      setSeleccionados([]);
    } catch (error) {
      console.error("Error buscando registros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarTodos = () => {
    if (seleccionados.length === registros.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(registros.map((r) => r.idSuscripcion)); // o el id que manejes
    }
  };

  const handleSeleccionar = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((sid) => sid !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const handleFacturar = async () => {
    if (seleccionados.length === 0) {
      alert("Debe seleccionar al menos un registro.");
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de generar facturas para ${seleccionados.length} registros?`
    );
    if (!confirmacion) return;

    setLoading(true);
    try {
      await generarFacturas(seleccionados, year, mes);
      alert("Facturación generada exitosamente.");
      navigate("/facturacion"); // Opcional, volver a la página principal
    } catch (error) {
      console.error("Error generando facturación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Generar Facturación del Mes</h1>

      {/* Filtros */}
      <div>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Seleccione Año</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          {/* Más años si quieres */}
        </select>

        <select value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Seleccione Mes</option>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          {/* Más meses */}
        </select>

        <button onClick={handleBuscar}>Buscar registros para facturar</button>
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        registros.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={seleccionados.length === registros.length}
                      onChange={handleSeleccionarTodos}
                    />
                  </th>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Dirección</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.idSuscripcion}>
                    <td>
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(registro.idSuscripcion)}
                        onChange={() =>
                          handleSeleccionar(registro.idSuscripcion)
                        }
                      />
                    </td>
                    <td>{registro.nombreCliente}</td>
                    <td>{registro.nombreProducto}</td>
                    <td>{registro.direccionServicio}</td>
                    <td>{registro.valor}</td>
                    <td>{registro.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Resumen y Botón de Facturar */}
            <div>
              <p>Registros seleccionados: {seleccionados.length}</p>
              <button onClick={handleFacturar}>Facturar seleccionados</button>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default PrefacturacionPage;
