import { useClientes } from "../context/ClientesContext";
import { useProductos } from "../context/ProductosContext.jsx";
import { useSuscripciones } from "../context/SuscripcionesContext";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function CrearSuscripcionPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const params = useParams();
  const { getCliente, cliente, setCliente } = useClientes();
  const { productos, getProductos } = useProductos();
  const { createSuscripcion } = useSuscripciones();

  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Hook para cargar el cliente
  useEffect(() => {
    async function loadCliente() {
      if (params.id) {
        try {
          const clienteData = await getCliente(params.id);
          if (clienteData) {
            setCliente(clienteData);
          }
        } catch (error) {
          console.error("Error al cargar el cliente:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadCliente();
  }, []);

  // Hook para cargar los productos
  useEffect(() => {
    getProductos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando información del cliente...
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        No se encontró el cliente solicitado.
      </div>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    const confirmacion = window.confirm(
      `¿Está seguro que desea crear la suscripción para ${cliente.nombreCliente}?`
    );
    if (!confirmacion) {
      return;
    }

    try {
      await createSuscripcion(data);
      console.log("Datos de la suscripción:", data);
      setSuccessMessage("Suscripción creada con éxito.");
    } catch (error) {
      console.error("Error al crear la suscripción:", error);
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-zinc-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <Link
            to={`/suscripciones/${params.id}`}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Volver
          </Link>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 rounded-lg bg-green-700 text-white">
            {successMessage}
          </div>
        )}

        <p className="text-gray-300">Nueva suscripción para:</p>
        <h2 className="text-2xl font-bold text-white mb-4">
          {cliente.nombreCliente}
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Producto */}
          <div>
            <label
              htmlFor="producto_id"
              className="block text-sm text-gray-300 mb-1"
            >
              Producto
            </label>
            <select
              id="producto_id"
              {...register("producto_id", { required: true })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione un producto</option>
              {productos.map((producto) => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombreProducto}
                </option>
              ))}
            </select>
            {errors.producto_id && (
              <p className="text-red-400 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          {/* Dirección del servicio */}
          <div>
            <label
              htmlFor="direccionServicio"
              className="block text-sm text-gray-300 mb-1"
            >
              Dirección del servicio
            </label>
            <input
              type="text"
              id="direccionServicio"
              {...register("direccionServicio", { required: true })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.direccionServicio && (
              <p className="text-red-400 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          {/* Fecha inicio */}
          <div>
            <label
              htmlFor="fechaInicio"
              className="block text-sm text-gray-300 mb-1"
            >
              Fecha de inicio
            </label>
            <input
              type="date"
              id="fechaInicio"
              {...register("fechaInicio", { required: true })}
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.fechaInicio && (
              <p className="text-red-400 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <label
              htmlFor="estado"
              className="block text-sm text-gray-300 mb-1"
            >
              Estado
            </label>
            <select
              id="estado"
              {...register("estado", { required: true })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            {errors.estado && (
              <p className="text-red-400 text-sm mt-1">
                Este campo es requerido
              </p>
            )}
          </div>

          {/* Observaciones */}
          <div>
            <label
              htmlFor="observaciones"
              className="block text-sm text-gray-300 mb-1"
            >
              Observaciones
            </label>
            <textarea
              id="observaciones"
              {...register("observaciones")}
              className="w-full px-4 py-2 rounded-lg bg-zinc-700 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo oculto del cliente */}
          <input type="hidden" value={params.id} {...register("cliente_id")} />

          {/* Botón */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Crear Suscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearSuscripcionPage;
