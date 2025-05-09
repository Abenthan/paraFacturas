import { useClientes } from "../context/ClientesContext";
import { useParams, Link } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function ClientePage() {
  const { user } = useAuth(); // Obtener el usuario autenticado

  const {
    cliente,
    setCliente,
    updateCliente,
    errors: updateClienteError,
    setErrors,
  } = useClientes();

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

  useEffect(() => {
    if (successMessage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [successMessage]);

  {
    /* funcion onSubmit */
  }
  const onSubmit = async (data) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los datos del cliente?"
    );

    if (!confirmed) return;

    try {
      const res = await updateCliente(params.id, data);
      console.log("res:", res);
      if (res.status === 200) {
        setCliente(data); // Actualiza el cliente en el contexto
        setSuccessMessage(res.data.message); // Actualiza el mensaje de éxito");
        setTimeout(() => {
          setSuccessMessage(""); // Limpia el mensaje después de 3 segundos
        }, 3000);
      }
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      setErrors(error.response.data); // Actualiza los errores en el contexto
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
        {/* seccion de mensages */}
        <div>
          {/* mensaje de actualizacion exitosa*/}
          {successMessage && (
            <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
              {successMessage}
            </div>
          )}

          {/* mensaje de error */}
          {updateClienteError.map((error, index) => (
            <div
              key={index}
              className="bg-red-600/90 text-white p-4 rounded-lg flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          ))}
        </div>

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
                  <option value="Otros">Otros</option>
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

            {/* campo usuarioId tipo numerico*/}
            <div className="hidden">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                ID de Usuario
              </label>
              <input
                type="number"
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
