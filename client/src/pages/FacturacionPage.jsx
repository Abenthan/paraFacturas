import { Link } from "react-router-dom";

function FacturacionPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-12 text-center">Módulo de Facturación</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Botón Generar Facturación */}
        <Link 
          to="/prefacturacion" 
          className="group relative overflow-hidden bg-zinc-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-zinc-700"
        >
          <div className="p-6 flex flex-col items-center h-full">
            <div className="mb-4 p-4 bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Generar Facturación</h2>
            <p className="text-gray-400 text-center">Proceso mensual de generación de facturas</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 group-hover:bg-blue-500 transition-colors duration-300"></div>
        </Link>

        {/* Botón Ver Facturas */}
        <Link 
          to="/facturas" 
          className="group relative overflow-hidden bg-zinc-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-zinc-700"
        >
          <div className="p-6 flex flex-col items-center h-full">
            <div className="mb-4 p-4 bg-green-600 rounded-full group-hover:bg-green-500 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Historial de Facturas</h2>
            <p className="text-gray-400 text-center">Consulta y gestión de facturas emitidas</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 group-hover:bg-green-500 transition-colors duration-300"></div>
        </Link>

        {/* Nuevo Botón Pagos */}
        <Link 
          to="/pagos" 
          className="group relative overflow-hidden bg-zinc-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-zinc-700"
        >
          <div className="p-6 flex flex-col items-center h-full">
            <div className="mb-4 p-4 bg-purple-600 rounded-full group-hover:bg-purple-500 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Gestión de Pagos</h2>
            <p className="text-gray-400 text-center">Registro y seguimiento de pagos</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 group-hover:bg-purple-500 transition-colors duration-300"></div>
        </Link>
      </div>

      {/* Efecto decorativo opcional */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-800 to-transparent pointer-events-none"></div>
    </div>
  );
}

export default FacturacionPage;