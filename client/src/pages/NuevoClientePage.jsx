import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useClientes } from "../context/ClientesContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
  
  {/* Sube la pagina cuando guarda*/}
  useEffect(() => {
    if (successMessage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [successMessage]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await newCliente(data);
    if (res.status === 201) {
      setCliente(data);
      setSuccessMessage(res.data.message);
      setTimeout(() => {
        setSuccessMessage("");
        // enviar a cliente/idCliente
        navigate(`/cliente/${res.data.idCliente}`);
      }, 2000);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-lg shadow-lg">
        {/* Enlace de navegacion */}
        <div>
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
        </div>

        <h2 className="text-2xl font-bold text-center text-white m-4">
          Nuevo Cliente
        </h2>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-600 text-white p-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        {/* Mensaje de error */}
        {newClienteError.map((error, index) => (
          <div
            key={index}
            className="bg-red-600 text-white p-3 rounded-lg mb-4"
          >
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Campo: Identificación */}
          <div>
            <label className="block text-white mb-2">Identificación</label>
            <input
              type="text"
              placeholder="Ingrese la identificación"
              {...register("numeroId", {
                required: "Este campo es obligatorio",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.numeroId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numeroId.message}
              </p>
            )}
          </div>

          {/* Campo: Tipo de identificación */}
          <div>
            <label className="block text-white mb-2">
              Tipo de identificación
            </label>
            <select
              {...register("tipoId", {
                required: "Este campo es obligatorio",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un tipo</option>
              <option value="Cedula">Cédula</option>
              <option value="Nit">Nit</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.tipoId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tipoId.message}
              </p>
            )}
          </div>

          {/* Campo: Nombre del Cliente */}
          <div>
            <label className="block text-white mb-2">Nombre del Cliente</label>
            <input
              type="text"
              placeholder="Ingrese el nombre del cliente"
              {...register("nombreCliente", {
                required: "Este campo es obligatorio",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nombreCliente && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nombreCliente.message}
              </p>
            )}
          </div>

          {/* Campo: Correo electrónico */}
          <div>
            <label className="block text-white mb-2">Correo electrónico</label>
            <input
              type="email"
              placeholder="Ingrese el correo electrónico"
              {...register("emailCliente", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ingrese un correo electrónico válido",
                },
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.emailCliente && (
              <p className="text-red-500 text-sm mt-1">
                {errors.emailCliente.message}
              </p>
            )}
          </div>

          {/* Campo: Teléfono */}
          <div>
            <label className="block text-white mb-2">Teléfono</label>
            <input
              type="text"
              placeholder="Ingrese el teléfono"
              {...register("telefono", {
                required: "Este campo es obligatorio",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">
                {errors.telefono.message}
              </p>
            )}
          </div>

          {/* Campo: Dirección */}
          <div>
            <label className="block text-white mb-2">Dirección</label>
            <input
              type="text"
              placeholder="Ingrese la dirección"
              {...register("direccion", {
                required: "Este campo es obligatorio",
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">
                {errors.direccion.message}
              </p>
            )}
          </div>

          {/* Campo: usuarioId, oculto */}
          <input type="hidden" value={usuarioId} {...register("usuarioId")} />

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Registrar Cliente
          </button>
        </form>
      </div>
    </div>
  );
}

export default NuevoClientePage;
