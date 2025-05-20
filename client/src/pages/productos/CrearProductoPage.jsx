import { useAuth } from "../../context/AuthContext";
import { useProductos } from "../../context/ProductosContext.jsx";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function CrearProductoPage() {
  const { user } = useAuth();
  const { newProducto } = useProductos();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const usuarioId = user.id;

  useEffect(() => {
    if (successMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [successMessage]);

  const onSubmit = handleSubmit(async (data) => {
    const confirmacion = window.confirm(
      "¿Está seguro de que desea crear este producto?"
    );
    if (!confirmacion) return;

    try {
      const res = await newProducto(data);
      if (res.status === 201) {
        setSuccessMessage(res.data.message);
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/productos");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      alert("Error al registrar el producto. Por favor, inténtelo de nuevo.");
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Volver */}
        <div className="mb-6">
          <Link
            to="/productos"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
            </svg>
            Volver al listado de productos
          </Link>
        </div>

        {/* Contenedor del formulario */}
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl border border-zinc-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Crear Producto
          </h2>

          {successMessage && (
            <div className="mb-4 p-4 rounded-lg bg-green-700 text-white">
              {successMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Nombre del producto */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("nombreProducto", {
                  required: "Este campo es obligatorio",
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Internet Básico"
              />
              {errors.nombreProducto && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.nombreProducto.message}
                </p>
              )}
            </div>

            {/* Precio del producto */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Precio del Producto <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("precioProducto", {
                  required: "Este campo es obligatorio",
                  min: {
                    value: 0,
                    message: "El precio debe ser mayor o igual a 0",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 50000"
              />
              {errors.precioProducto && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.precioProducto.message}
                </p>
              )}
            </div>

            {/* estadoProducto */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Estado del producto
              </label>
              <select
                {...register("estadoProducto")}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Descripción del producto */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Descripción del Producto
              </label>
              <textarea
                {...register("descripcionProducto")}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Internet de 10mbps"
                rows="4"
              ></textarea>
              {errors.descripcionProducto && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.descripcionProducto.message}
                </p>
              )}
            </div>

            {/* usuarioId */}
            <input type="hidden" value={usuarioId} {...register("usuarioId")} />

            {/* Botón */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
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
                Crear Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrearProductoPage;
