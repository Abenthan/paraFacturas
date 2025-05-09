import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useClientes } from "../context/ClientesContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

function NuevoClientePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const { newCliente, setCliente, errors: newClienteError } = useClientes();
  const [successMessage, setSuccessMessage] = useState("");
  const usuarioId = user.id;
  const navigate = useNavigate();

  // Scroll to top when success message appears
  useEffect(() => {
    if (successMessage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [successMessage]);

  const onSubmit = handleSubmit(async (data) => {
    const confirmed = window.confirm(
      "¿Está seguro de que desea registrar este cliente?"
    );
    if (!confirmed) return;
    try {
      const res = await newCliente(data);
      if (res.status === 201) {
        setCliente(data);
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          setSuccessMessage("");
          navigate(`/cliente/${res.data.idCliente}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error al registrar el cliente:", error);
      alert("Error al registrar el cliente. Por favor, inténtelo de nuevo.");
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Link */}
        <div className="mb-8">
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
            Volver al listado de clientes
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl border border-zinc-700">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Nuevo Cliente
          </h2>

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

            {newClienteError.map((error, index) => (
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

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* ID Type and Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Type */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Tipo de identificación <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("tipoId", {
                    required: "Este campo es obligatorio",
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Cedula">Cédula</option>
                  <option value="Nit">Nit</option>
                  <option value="Otros">Otros</option>
                </select>
                {errors.tipoId && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
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
                  Identificación <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1234567890"
                  {...register("numeroId", {
                    required: "Este campo es obligatorio",
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                />
                {errors.numeroId && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
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
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
              />
              {errors.nombreCliente && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
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

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="Ej: cliente@example.com"
                  {...register("emailCliente", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ingrese un correo electrónico válido",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                />
                {errors.emailCliente && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
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

              {/* Phone */}
              <div>
                <label className="block text-white mb-2 font-medium">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 3001234567"
                  {...register("telefono", {
                    required: "Este campo es obligatorio",
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
                />
                {errors.telefono && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
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
            </div>

            {/* Address */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Dirección <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Calle 123 #45-67"
                {...register("direccion", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-600 transition-colors duration-200"
              />
              {errors.direccion && (
                <p className="text-red-400 text-sm mt-1 flex items-center">
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
            <input type="hidden" value={usuarioId} {...register("usuarioId")} />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800 font-medium flex items-center justify-center"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Registrar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoClientePage;
