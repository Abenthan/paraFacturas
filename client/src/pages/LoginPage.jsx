import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, isAuthenticated , errors: signinErrors } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async(data) => {
    signin(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-lg shadow-lg">
        {signinErrors.map((error, i) => (
          <div key={i} className="bg-red-500 p-2 text-white text-center">
            {error}
          </div>
        ))}

        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Iniciar Sesión
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            {...register("username", { required: true })}
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <span className="text-red-500">El usuario es requerido</span>
          )}

          <input
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: true })}
            className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <span className="text-red-500">La contraseña es requerida</span>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
