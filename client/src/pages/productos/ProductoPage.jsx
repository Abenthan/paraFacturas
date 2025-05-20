import { useAuth } from "../../context/AuthContext";
import { useProductos } from "../../context/ProductosContext.jsx";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function ProductoPage() {
  const { user } = useAuth();
  const {
    producto,
    getProducto,
    updateProducto,
    errors: errorUpdate,
  } = useProductos();
  const { id } = useParams();
  const usuarioId = user.id;

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del producto
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await getProducto(id);
        if (res) {
          setValue("idProducto", res.idProducto);
          setValue("nombreProducto", res.nombreProducto);
          setValue("precioProducto", res.precioProducto);
          setValue("estadoProducto", res.estadoProducto);
          setValue("descripcionProducto", res.descripcionProducto);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerProducto();
  }, [id, setValue]);

  // Enviar formulario
  const onSubmit = async (formData) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar este producto?"
    );
    if (!confirmed) return;

    try {
      const resUpdate = await updateProducto(id, formData);
      if (resUpdate.status === 200) {
        setSuccessMessage(resUpdate.data.message);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  // Desplazar al top si hay mensaje o errores
  useEffect(() => {
    if (errorUpdate.length > 0 || successMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [successMessage, errorUpdate]);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Cargando información del producto...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Volver a productos */}
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

        {/* Contenedor principal */}
        <div className="bg-zinc-800 p-8 rounded-lg shadow-xl border border-zinc-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Editar Producto
          </h2>

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="mb-4 p-4 rounded-lg bg-green-700 text-white">
              {successMessage}
            </div>
          )}

          {/* Errores */}
          {errorUpdate.length > 0 &&
            errorUpdate.map((err, i) => (
              <div
                key={i}
                className="mb-4 p-4 rounded-lg bg-red-700 text-white"
              >
                {err}
              </div>
            ))}

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("nombreProducto", {
                  required: "Este campo es obligatorio",
                  maxLength: {
                    value: 100,
                    message: "El nombre no puede exceder los 100 caracteres",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
              />
              {errors.nombreProducto && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.nombreProducto.message}
                </p>
              )}
            </div>

            {/* Precio */}
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
              />
              {errors.precioProducto && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.precioProducto.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Estado del Producto
              </label>
              <select
                {...register("estadoProducto")}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Descripción del Producto
              </label>
              <textarea
                {...register("descripcionProducto", {
                  maxLength: {
                    value: 250,
                    message:
                      "La descripción no puede exceder los 500 caracteres",
                  },
                })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-700 text-white border border-zinc-600 focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>

            {/* ID oculto del usuario */}
            <input type="hidden" value={usuarioId} {...register("usuarioId")} />

            {/* Botón de guardar */}
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

export default ProductoPage;
