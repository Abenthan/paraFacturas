import { useClientes } from "../context/ClientesContext";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function ClientePage() {
  const { cliente, updateCliente } = useClientes();
  const { user } = useAuth(); // Obtener el usuario autenticado
  useEffect(() => {
    if (cliente) {
      Object.entries(cliente).forEach(([key, value]) => {
        setValue(key, value); // Llenamos cada campo con setValue
      });
    }
  }, [cliente]);

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();
  const params = useParams();
  const usuarioId = user.id; // Obtener el id del cliente desde la URL
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const onSubmit = async (data) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los datos del cliente?"
    );
    if (!confirmed) return;

    try {
      await updateCliente(params.id, data);
      setSuccessMessage("Cliente actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Error al actualizar el cliente");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Enlaces de navegación */}
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

      {/* formulario del cliente */}
      <div className="max-w-2xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">
          Informacion del cliente
        </h2>
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección de campos del formulario */}
          <div>
            {/* campo nombreCliente*/}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre del Cliente
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

            {/* tipoId y Cedula */}
            <div className="flex gap-4">
              {/* tipoId */}
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tipo de ID
                </label>
                <select
                  {...register("tipoId", { required: "Seleccione una opción" })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Cedula">Cédula</option>
                  <option value="NIT">NIT</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                {errors.tipoId && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.tipoId.message}
                  </p>
                )}
              </div>

              {/* numeroId */}
              <div className="w-1/2">
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
            </div>

            {/* campo telefono */}
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

            {/* campo emailCliente */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Correo
              </label>
              <input
                type="email"
                {...register("emailCliente", {
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

            {/* direccion */}
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

            {/* campo usuarioId */}
            <div className="hidden">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                ID de Usuario
              </label>
              <input
                type="text"
                {...register("usuarioId")}
                defaultValue={usuarioId}
                className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.usuarioId && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.usuarioId.message}
                </p>
              )}
            </div>
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
