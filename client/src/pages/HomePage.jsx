import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center">
      {/* Encabezado con logo */}
      <div className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-700 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Bienvenido a</h1>
        <h2 className="text-3xl font-semibold text-green-400">Asociación de Usuarios Campesinos</h2>
        <p className="text-gray-400 mt-4">Sistema de Facturación y Gestión de suscripciones</p>
      </div>

      {/* Tarjetas de navegación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Tarjeta Clientes */}
        <Link 
          to="/clientes" 
          className="group relative overflow-hidden bg-zinc-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-zinc-700"
        >
          <div className="p-8 flex flex-col items-center">
            <div className="mb-5 p-4 bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Clientes</h2>
            <p className="text-gray-400 text-center">Gestión de clientes y suscripciones</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 group-hover:bg-blue-500 transition-colors duration-300"></div>
        </Link>

        {/* Tarjeta Facturación */}
        <Link 
          to="/facturacion" 
          className="group relative overflow-hidden bg-zinc-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-zinc-700"
        >
          <div className="p-8 flex flex-col items-center">
            <div className="mb-5 p-4 bg-purple-600 rounded-full group-hover:bg-purple-500 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Facturación</h2>
            <p className="text-gray-400 text-center">Generación y gestión de facturas</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 group-hover:bg-purple-500 transition-colors duration-300"></div>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>Sistema desarrollado para la Asociación de Usuarios Campesinos</p>
        <p className="mt-1">© {new Date().getFullYear()} - Todos los derechos reservados</p>
      </div>
    </div>
  );
}

export default HomePage;