import { useForm } from "react-hook-form";
import { useState } from "react";
import { useClientes } from "../context/ClientesContext";

function NuevoClientePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { newCliente } = useClientes();
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    setSuccessMessage("Cliente registrado exitosamente!");
    newCliente(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-zinc-800 max-w-md w-full p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Nuevo Cliente
        </h1>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

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
              <option value="Cédula">Cédula</option>
              <option value="Nit">Nit</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.tipoId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tipoId.message}
              </p>
            )}
          </div>

          {/* Campo: Código */}
          <div>
            <label className="block text-white mb-2">Código</label>
            <input
              type="text"
              placeholder="Ingrese el código"
              {...register("codigo", {
                required: "Este campo es obligatorio",
                maxLength: {
                  value: 10,
                  message: "El código no puede tener más de 10 caracteres",
                },
              })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.codigo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.codigo.message}
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
                required: "Este campo es obligatorio",
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
