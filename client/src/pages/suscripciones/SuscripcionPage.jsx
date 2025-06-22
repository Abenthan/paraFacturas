import { useAuth } from "../../context/AuthContext";
import { useSuscripciones } from "../../context/SuscripcionesContext";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function SuscripcionPage() {
  const { user } = useAuth();
  const {
    getSuscripcion,
    updateSuscripcion,
    suscripcion,
    errors: updateSuscripcionError,
    setErrors,
  } = useSuscripciones();
  const { id } = useParams();

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();

  const usuarioId = user.id;
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar la suscripción al montar el componente
  useEffect(() => {
    const fetchSuscripcion = async () => {
      try {
        const data = await getSuscripcion(id);

        // Establecer valores en el formulario
        setValue("idSuscripcion", data.idSuscripcion);
        setValue("nombreCliente", data.nombreCliente);
        setValue("nombreProducto", data.nombreProducto);
        setValue("direccionServicio", data.direccionServicio);
        setValue("Estado", data.Estado);
        setValue("fechaInicio", data.fechaInicio.split("T")[0]);
        // Solo establecer fechaFin si tiene valor
        if (data.fechaFin) {
          setValue("fechaFin", data.fechaFin.split("T")[0]);
        }
        setValue("Observaciones", data.Observaciones);
        setValue("cliente_id", data.cliente_id);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando suscripción:", error);
      }
    };
    fetchSuscripcion();
  }, [id]);

  // Enviar cambios al backend
  const onSubmit = async (formData) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas actualizar los datos de la suscripción?"
    );

    if (!confirmed) return;

    try {
      // Validar fechaFin tenga valor si el estado es "Inactivo" asignar fecha actual a fechaFin
      if (formData.Estado === "Inactivo" && !formData.fechaFin) {
        formData.fechaFin = new Date().toISOString().split("T")[0];
      }

      if (formData.Estado === "Activo") {
        formData.fechaFin = null; // Limpiar fechaFin si el estado es "Activo"
      }

      const res = await updateSuscripcion(id, formData);
      if (res.status === 200) {
        setSuccessMessage(res.data.message);
        // Limpiar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrors(error.response?.data || ["Error al actualizar la suscripción"]);
    }
  };

  // Scroll to top en mensaje de éxito
  useEffect(() => {
    if (updateSuscripcionError.length > 0 || successMessage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [updateSuscripcionError, successMessage]);

  if (loading) {
    return (
      <div className="text-white text-center mt-10">
        Cargando suscripción...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <Link
          to={`/carterasuscripcion/${suscripcion.idSuscripcion}`}
          className="text-blue-400 hover:text-blue-300"
        >
          ← Ver suscripción
        </Link>

      </div>

      <h2 className="text-2xl font-bold mb-6">Editar Suscripción</h2>

      {/* Seccion de mensajes */}
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

        {updateSuscripcionError.map((error, index) => (
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Número de suscripción (solo lectura) */}
        <div>
          <label className="block text-sm font-medium">
            Número de suscripción
          </label>
          <input
            disabled
            {...register("idSuscripcion")}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
        </div>

        {/* Cliente (solo lectura) */}
        <div>
          <label className="block text-sm font-medium">Cliente</label>
          <input
            disabled
            {...register("nombreCliente")}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
        </div>

        {/* Producto (solo lectura) */}
        <div>
          <label className="block text-sm font-medium">Producto</label>
          <input
            disabled
            {...register("nombreProducto")}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
        </div>

        {/* Dirección editable */}
        <div>
          <label className="block text-sm font-medium">
            Dirección de servicio
          </label>
          <input
            {...register("direccionServicio", { required: true })}
            className="w-full bg-gray-800 p-2 rounded mt-1"
          />
          {errors.direccionServicio && (
            <span className="text-red-400 text-sm">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Estado: Activo o Inactivo */}
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            {...register("Estado", { required: true })}
            className="w-full bg-gray-800 p-2 rounded mt-1"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Fecha de inicio */}
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium">
            Fecha de inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            {...register("fechaInicio", { required: true })}
            className="w-full bg-gray-700 p-2 rounded mt-1"
          />
          {errors.fechaInicio && (
            <span className="text-red-400 text-sm">
              Este campo es requerido
            </span>
          )}
        </div>

        {/* Fecha de finalización */}
        {suscripcion.Estado === "Inactivo" && (
          <div>
            <label htmlFor="fechaFin" className="block text-sm font-medium">
              Fecha de finalización
            </label>
            <input
              type="date"
              id="fechaFin"
              {...register("fechaFin")}
              className="w-full bg-gray-700 p-2 rounded mt-1"
            />
          </div>
        )}
        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium">Observaciones</label>
          <textarea
            {...register("Observaciones")}
            rows={3}
            className="w-full bg-gray-800 p-2 rounded mt-1"
          />
        </div>

        {/* ocultos */}
        <div>
          <input type="hidden" {...register("cliente_id")} />

          {/* usuarioId */}
          <input type="hidden" value={usuarioId} {...register("usuarioId")} />
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Guardar Cambios
        </button>
        {/* Botón de cancelar, Link to `/suscripciones/data.cliente_id` */}
        <Link
          to={`/carteraSuscripcion/${suscripcion.idSuscripcion}`}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white ml-2"
        >
          Cancelar
        </Link>
      </form>
    </div>
  );
}

export default SuscripcionPage;
