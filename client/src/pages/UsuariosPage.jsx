import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsuariosRequest, deleteUsuarioRequest } from "../api/auth";

function UsuariosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      setUsuarios(res.data);
    } catch (err) {
      setError("Error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que desea eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUsuarioRequest(id);
      setUsuarios((prev) => prev.filter((u) => u.idUsuario !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar el usuario.");
    }
  };

  const rolBadge = (rol) =>
    rol === "admin"
      ? "bg-purple-700 text-purple-100"
      : "bg-blue-700 text-blue-100";

  return (
    <div className="container mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        {user?.rol === "admin" && (
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Nuevo usuario
          </Link>
        )}
      </div>

      {error && <div className="bg-red-600 p-3 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center text-lg">Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg shadow text-white">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 text-left w-12">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Usuario</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center w-28">Rol</th>
                <th className="p-3 text-center w-36">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.idUsuario} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{u.idUsuario}</td>
                  <td className="p-3">{u.fullname}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rolBadge(u.rol)}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/usuario/${u.idUsuario}/password`)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Contraseña
                      </button>
                      {user?.rol === "admin" && u.idUsuario !== user.id && (
                        <button
                          onClick={() => handleEliminar(u.idUsuario, u.fullname)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsuariosPage;
