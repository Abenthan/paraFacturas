import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-zinc-800 my-3 flex justify-between items-center py-4 px-8 rounded-lg shadow-lg">
      <Link to="/">
        <h1 className="text-2xl font-bold text-white hover:text-blue-500 transition duration-300">
          paraFacturas
        </h1>
      </Link>

      {/* Menú */}
      <ul className="flex gap-x-6 items-center">
        {isAuthenticated ? (
          <>
            {/* Link a Clientes */}
            <li>
              <Link
                to="/clientes"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                Clientes
              </Link>
            </li>

            {/* Link a suscripciones */}
            <li>
              <Link
                to="/suscripciones"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                Suscripciones
              </Link>
            </li>
            {/* Link a Facturacion */}
            <li>
              <Link
                to="/facturacion"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                Facturación
              </Link>
            </li>


            {/* Menú desplegable: Bases de datos */}
            <li className="relative group">
              <span className="text-white hover:text-blue-500 cursor-pointer transition duration-300">
                Bases de datos
              </span>
              <ul className="absolute hidden bg-zinc-700 rounded-lg py-2 px-4 space-y-2 group-hover:block">
                <li>
                  <Link
                    to="/clientes"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Clientes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/productos"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/suscripciones"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Suscripciones
                  </Link>
                </li>

                <li>
                  <Link
                    to="/novedades"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Novedades
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Usuarios
                  </Link>
                </li>
              </ul>
            </li>

            {/* Menú desplegable: Gestión */}
            <li className="relative group">
              <span className="text-white hover:text-blue-500 cursor-pointer transition duration-300">
                Gestión
              </span>
              <ul className="absolute hidden bg-zinc-700 rounded-lg py-2 px-4 space-y-2 group-hover:block">
                <li>
                  <Link
                    to="/facturacion"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Facturación
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pagos"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Pagos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cartera"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Cartera
                  </Link>
                </li>
              </ul>
            </li>

            {/* Menú desplegable: Nombre de usuario */}
            <li className="relative group">
              <span className="text-white hover:text-blue-500 cursor-pointer transition duration-300">
                {user.fullname}
              </span>
              <ul className="absolute hidden bg-zinc-700 rounded-lg py-2 px-4 space-y-2 group-hover:block min-w-[150px]">
                <li>
                  <Link
                    to="/profile"
                    className="text-white hover:text-blue-500 transition duration-300"
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-white hover:text-blue-500 transition duration-300 whitespace-nowrap"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </li>
          </>
        ) : (
          // Menú para usuarios no autenticados
          <li>
            <Link
              to="/login"
              className="text-white hover:text-blue-500 transition duration-300"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;