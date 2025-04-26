import { Link } from "react-router-dom";
function FacturacionPage() {
  return (
    <div>
      <Link to="/prefacturacion">
        <button>📝 Generar Facturación del Mes</button>
      </Link>
    </div>
  );
}

export default FacturacionPage;
