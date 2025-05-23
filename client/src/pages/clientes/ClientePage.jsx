import { useAuth } from "../../context/AuthContext";
import { useClientes } from "../../context/ClientesContext.jsx";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

function ClientePage() {
  const { user } = useAuth();
  const {
    cliente,
    setCliente,
    updateCliente,
    errors: updateClienteError,
    setErrors,
  } = useClientes();
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();
  const params = useParams();
  const usuarioId = user.id;
  const [successMessage, setSuccessMessage] = useState("");

  // Llenar formulario con datos del cliente
  useEffect(() => {
    if (cliente) {
      Object.entries(cliente).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [cliente, setValue]);

  // Scroll to top en mensaje de error o éxito
  useEffect(() => {
    if (updateClienteError.length > 0 || successMessage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [updateClienteError, successMessage]);

  const onSubmit = async (data) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los datos del cliente?"
    );

    if (!confirmed) return;

    try {
      const res = await updateCliente(params.id, data);
      if (res.status === 200) {
        setCliente(data);
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
      setErrors(error.response?.data || ["Error al actualizar el cliente"]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
       
        {/* Navigation and Links */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            to="/clientes"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Listado de Clientes
          </Link>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to={`/Suscripciones/${params.id}`}
              className="inline-flex items-center px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 rounded-lg transition-colors duration-200 border border-purple-600/50"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Suscripciones
            </Link>

            <Link
              to={`/estadoCuentaCliente/${params.id}`}
              className="inline-flex items-center px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-blue-200 rounded-lg transition-colors duration-200 border border-blue-600/50"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Estado de cuenta
            </Link>
          </div>
        </div>

        {/* Client Form */}
        <div className="bg-zinc-800 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-700">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Información del Cliente
            </h2>
            <p className="text-zinc-400">Actualiza los datos del cliente</p>
          </div>

          {/* Messages Section */}
          <div className="space-y-3 mb-6">
            
            {successMessage && (
              <div className="bg-green-600/90 text-white p-4 rounded-lg flex items-center">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {successMessage}
              </div>
            )}

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
            {/* Client Name */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Nombre del Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                {...register("nombreCliente", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
              />
              {errors.nombreCliente && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
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
                  {errors.nombreCliente.message}
                </p>
              )}
            </div>

            {/* ID Type and Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Type */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Tipo de Identificación <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("tipoId", { required: "Seleccione una opción" })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Cedula">Cédula</option>
                  <option value="NIT">NIT</option>
                  <option value="Otros">Otros</option>
                </select>
                {errors.tipoId && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {errors.tipoId.message}
                  </p>
                )}
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Número de Identificación{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1234567890"
                  {...register("numeroId", {
                    required: "Este campo es obligatorio",
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                />
                {errors.numeroId && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {errors.numeroId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3001234567"
                  {...register("telefono", {
                    required: "Este campo es obligatorio",
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                />
                {errors.telefono && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ej: cliente@example.com"
                  {...register("emailCliente", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ingrese un correo válido",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                />
                {errors.emailCliente && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {errors.emailCliente.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Dirección <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("direccion", {
                  required: "Este campo es obligatorio",
                })}
                rows={3}
                placeholder="Ej: Calle 123 #45-67, Ciudad"
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
              />
              {errors.direccion && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
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
                  {errors.direccion.message}
                </p>
              )}
            </div>

            {/* Hidden User ID Field */}
            <input type="hidden" {...register("usuarioId")} value={usuarioId} />

            {/* Submit Button */}
            <div className="pt-6 border-t border-zinc-700">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800 flex items-center justify-center"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientePage;
