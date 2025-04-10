import { useClientes } from "../context/ClientesContext";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function ClientePage() {
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();
  const params = useParams();
  const { getCliente, updateCliente } = useClientes();

  useEffect(() => {
    async function loadCliente() {
      if (params.id) {
        const cliente = await getCliente(params.id);
        if (cliente) {
          Object.entries(cliente).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      }
    }
    loadCliente();
  }, [params.id]);

  const onSubmit = async (data) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los datos del cliente?"
    );
    if (!confirmed) return;

    try {
      await updateCliente(params.id, data);
      alert("Cliente actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Error al actualizar el cliente");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Enlaces de navegación */}

      {/* Enlace para volver al listado */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <Link
          to="/clientes"
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Volver al listado
        </Link>

        {/* Enlace para Suscripciones */}
        <div className="flex gap-4">
          <Link
            to={`/Suscripciones/${params.id}`}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Suscripciones
          </Link>

          {/* Enlace para Estado de cuenta */}
          <Link
            to={`/clientes/${params.id}/estado-cuenta`}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Estado de cuenta
          </Link>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-2xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white mb-8">
          Editar Cliente
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección de campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  {...register("codigo", { required: "Campo obligatorio" })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.codigo && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.codigo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de ID
                </label>
                <select
                  {...register("tipoId", { required: "Seleccione una opción" })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Cédula">Cédula</option>
                  <option value="NIT">NIT</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                {errors.tipoId && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.tipoId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  {...register("telefono", { required: "Campo obligatorio" })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register("nombreCliente", {
                    required: "Campo obligatorio",
                  })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.nombreCliente && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.nombreCliente.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Número de ID
                </label>
                <input
                  type="text"
                  {...register("numeroId", { required: "Campo obligatorio" })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.numeroId && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.numeroId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Correo
                </label>
                <input
                  type="email"
                  {...register("emailCliente", {
                    required: "Campo obligatorio",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo inválido",
                    },
                  })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.emailCliente && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.emailCliente.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dirección (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Dirección
            </label>
            <textarea
              {...register("direccion", { required: "Campo obligatorio" })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.direccion && (
              <p className="mt-1 text-sm text-red-400">
                {errors.direccion.message}
              </p>
            )}
          </div>

          {/* Solo botón de guardar */}
          <div className="pt-6 border-t border-zinc-700 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientePage;
