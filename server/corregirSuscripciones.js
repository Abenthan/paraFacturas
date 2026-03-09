import { createPool } from "mysql2/promise";

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: "Acces0r00t",
  database: process.env.DB_NAME || "parafacturas",
});

const corregirSuscripciones = async () => {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    // 1️⃣ Buscar suscripciones en estado Desconectado
    const [suscripciones] = await conexion.query(
      "SELECT idSuscripcion FROM suscripciones WHERE estado = 'Desconectado'"
    );

    if (suscripciones.length === 0) {
      console.log("No hay suscripciones en estado Desconectado.");
      return;
    }

    console.log(`Se encontraron ${suscripciones.length} suscripciones.`);

    for (const suscripcion of suscripciones) {
      const id = suscripcion.idSuscripcion;

      // 2️⃣ Actualizar estado
      await conexion.query(
        "UPDATE suscripciones SET estado = 'Suspendido' WHERE idSuscripcion = ?",
        [id]
      );

      // 3️⃣ Registrar novedad
      await conexion.query(
        `INSERT INTO novedades 
         (novedad, fechaNovedad, descripcionNovedad, suscripcion_id) 
         VALUES (?, ?, ?, ?)`,
        [
          "Suspencion",
          new Date(),
          `Se cambió estado de Desconectado a Suspendido (proceso correctivo)`,
          id,
        ]
      );

      // 4️⃣ Registrar auditoría
      await conexion.query(
        `INSERT INTO auditoria 
         (usuario_id, accion, modulo, descripcion) 
         VALUES (?, ?, ?, ?)`,
        [
          1, // 👈 pon aquí el ID del usuario administrador
          "Corrección masiva",
          "Suscripciones",
          `Se cambió estado de Desconectado a Suspendido en suscripción ${id}`,
        ]
      );
    }

    await conexion.commit();

    console.log("Proceso finalizado correctamente.");
  } catch (error) {
    await conexion.rollback();
    console.error("Error en el proceso:", error);
  } finally {
    conexion.release();
    process.exit();
  }
};

corregirSuscripciones();