import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { changePasswordRequest } from "../api/auth";
import { useState } from "react";

function CambiarPasswordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exito, setExito] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    setExito("");
    setErrorMsg("");
    try {
      const res = await changePasswordRequest(id, {
        passwordActual: values.passwordActual,
        passwordNueva: values.passwordNueva,
      });
      setExito(res.data.message);
      reset();
      setTimeout(() => navigate("/usuarios"), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error al cambiar la contraseña.");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Cambiar Contraseña
        </h1>

        {exito && (
          <div className="bg-green-600 p-2 text-white rounded mb-4 text-center">{exito}</div>
        )}
        {errorMsg && (
          <div className="bg-red-600 p-2 text-white rounded mb-4">{errorMsg}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Contraseña actual"
              {...register("passwordActual", { required: "La contraseña actual es requerida" })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passwordActual && (
              <span className="text-red-400 text-sm">{errors.passwordActual.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Nueva contraseña (mínimo 8 caracteres)"
              {...register("passwordNueva", {
                required: "La nueva contraseña es requerida",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.passwordNueva && (
              <span className="text-red-400 text-sm">{errors.passwordNueva.message}</span>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              {...register("confirmarPassword", {
                required: "Debe confirmar la nueva contraseña",
                validate: (val) =>
                  val === watch("passwordNueva") || "Las contraseñas no coinciden",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmarPassword && (
              <span className="text-red-400 text-sm">{errors.confirmarPassword.message}</span>
            )}
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
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CambiarPasswordPage;
