import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { signup, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const [exitoso, setExitoso] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    const result = await signup(values);
    if (result?.ok) {
      setExitoso(true);
      setTimeout(() => navigate("/usuarios"), 1500);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-lg shadow-lg">

        {registerErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 text-white rounded mb-2">{error}</div>
        ))}

        {exitoso && (
          <div className="bg-green-600 p-2 text-white rounded mb-2 text-center">
            Usuario creado exitosamente. Redirigiendo...
          </div>
        )}

        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Registro de usuario
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              {...register("fullname", { required: "El nombre completo es requerido" })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullname && <span className="text-red-400 text-sm">{errors.fullname.message}</span>}
          </div>

          {/* Usuario */}
          <div>
            <input
              type="text"
              placeholder="Nombre de usuario"
              {...register("username", { required: "El usuario es requerido" })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <span className="text-red-400 text-sm">{errors.username.message}</span>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", {
                required: "El correo electrónico es requerido",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo no válido" },
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
          </div>

          {/* #7 — Contraseña con mínimo 8 caracteres */}
          <div>
            <input
              type="password"
              placeholder="Contraseña (mínimo 8 caracteres)"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: { value: 8, message: "La contraseña debe tener al menos 8 caracteres" },
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
          </div>

          {/* #7 — Confirmación de contraseña */}
          <div>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              {...register("confirmPassword", {
                required: "Debe confirmar la contraseña",
                validate: (val) =>
                  val === watch("password") || "Las contraseñas no coinciden",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <span className="text-red-400 text-sm">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* #9 — Rol */}
          <div>
            <select
              {...register("rol", { required: "El rol es requerido" })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="operador">Operador</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.rol && <span className="text-red-400 text-sm">{errors.rol.message}</span>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/usuarios")}
              className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
