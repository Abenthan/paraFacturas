import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(null);

  const activeLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold transition duration-300"
      : "text-white hover:text-blue-400 transition duration-300";

  const toggleDropdown = (nombre) => {
    setDropdownAbierto((prev) => (prev === nombre ? null : nombre));
  };

  const cerrarTodo = () => {
    setDropdownAbierto(null);
    setMenuAbierto(false);
  };

  return (
    <nav className="bg-zinc-800 my-3 px-8 py-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" onClick={cerrarTodo}>
          <h1 className="text-2xl font-bold text-white hover:text-blue-400 transition duration-300">
            paraFacturas
          </h1>
        </NavLink>

        {/* Menú desktop */}
        {isAuthenticated && (
          <ul className="hidden md:flex gap-x-6 items-center">

            {/* Link directo: Suscripciones */}
            <li>
              <NavLink to="/suscripciones" className={activeLinkClass} onClick={cerrarTodo}>
                Suscripciones
              </NavLink>
            </li>

            {/* Link directo: Facturación */}
            <li>
              <NavLink to="/facturacion" className={activeLinkClass} onClick={cerrarTodo}>
                Facturación
              </NavLink>
            </li>

            {/* Dropdown: Bases de datos */}
            <li className="relative">
              <button
                onClick={() => toggleDropdown("basedatos")}
                className="flex items-center gap-1 text-white hover:text-blue-400 transition duration-300"
              >
                Bases de datos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${dropdownAbierto === "basedatos" ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownAbierto === "basedatos" && (
                <ul className="absolute top-full mt-2 left-0 bg-zinc-700 rounded-lg py-2 px-1 space-y-1 shadow-xl min-w-[160px] z-50">
                  {[
                    { to: "/clientes", label: "Clientes" },
                    { to: "/productos", label: "Productos" },
                    { to: "/suscripciones", label: "Suscripciones" },
                    { to: "/novedades", label: "Novedades" },
                    { to: "/usuarios", label: "Usuarios" },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={activeLinkClass}
                        onClick={cerrarTodo}
                      >
                        <span className="block px-3 py-1 rounded hover:bg-zinc-600">{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Dropdown: Gestión */}
            <li className="relative">
              <button
                onClick={() => toggleDropdown("gestion")}
                className="flex items-center gap-1 text-white hover:text-blue-400 transition duration-300"
              >
                Gestión
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${dropdownAbierto === "gestion" ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownAbierto === "gestion" && (
                <ul className="absolute top-full mt-2 left-0 bg-zinc-700 rounded-lg py-2 px-1 space-y-1 shadow-xl min-w-[150px] z-50">
                  {[
                    { to: "/facturacion", label: "Facturación" },
                    { to: "/pagos", label: "Pagos" },
                    { to: "/cartera", label: "Cartera" },
                  ].map(({ to, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={activeLinkClass}
                        onClick={cerrarTodo}
                      >
                        <span className="block px-3 py-1 rounded hover:bg-zinc-600">{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Dropdown: Usuario */}
            <li className="relative">
              <button
                onClick={() => toggleDropdown("usuario")}
                className="flex items-center gap-1 text-white hover:text-blue-400 transition duration-300"
              >
                {user.fullname}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${dropdownAbierto === "usuario" ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownAbierto === "usuario" && (
                <ul className="absolute top-full mt-2 right-0 bg-zinc-700 rounded-lg py-2 px-1 space-y-1 shadow-xl min-w-[150px] z-50">
                  <li>
                    <button
                      onClick={() => { logout(); cerrarTodo(); }}
                      className="block w-full text-left px-3 py-1 rounded text-white hover:text-blue-400 hover:bg-zinc-600 transition duration-300 whitespace-nowrap"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        )}

        {/* Login (no autenticado, desktop) */}
        {!isAuthenticated && (
          <ul className="hidden md:flex">
            <li>
              <NavLink to="/login" className={activeLinkClass}>
                Login
              </NavLink>
            </li>
          </ul>
        )}

        {/* Botón hamburguesa (móvil) */}
        <button
          className="md:hidden text-white hover:text-blue-400 transition duration-300"
          onClick={() => setMenuAbierto((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden mt-4 flex flex-col gap-2 border-t border-zinc-600 pt-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/suscripciones" className={activeLinkClass} onClick={cerrarTodo}>Suscripciones</NavLink>
              <NavLink to="/facturacion" className={activeLinkClass} onClick={cerrarTodo}>Facturación</NavLink>
              <div className="border-t border-zinc-600 pt-2 mt-1">
                <p className="text-zinc-400 text-xs uppercase mb-1 px-1">Bases de datos</p>
                <NavLink to="/clientes" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Clientes</span></NavLink>
                <NavLink to="/productos" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Productos</span></NavLink>
                <NavLink to="/suscripciones" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Suscripciones</span></NavLink>
                <NavLink to="/novedades" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Novedades</span></NavLink>
                <NavLink to="/usuarios" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Usuarios</span></NavLink>
              </div>
              <div className="border-t border-zinc-600 pt-2 mt-1">
                <p className="text-zinc-400 text-xs uppercase mb-1 px-1">Gestión</p>
                <NavLink to="/facturacion" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Facturación</span></NavLink>
                <NavLink to="/pagos" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Pagos</span></NavLink>
                <NavLink to="/cartera" className={activeLinkClass} onClick={cerrarTodo}><span className="block px-2 py-1">Cartera</span></NavLink>
              </div>
              <div className="border-t border-zinc-600 pt-2 mt-1">
                <button
                  onClick={() => { logout(); cerrarTodo(); }}
                  className="text-white hover:text-blue-400 transition duration-300 px-2 py-1"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <NavLink to="/login" className={activeLinkClass} onClick={cerrarTodo}>Login</NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
