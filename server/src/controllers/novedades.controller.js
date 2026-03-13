import { pool } from "../db.js";

// novedades de una suscripción
export const getNovedadesSuscripcion = async (req, res) => {
  try {
    const { idSuscripcion } = req.params;
    const consulta = `SELECT *
    FROM novedades
    WHERE suscripcion_id = ?
    ORDER BY idNovedad DESC`;
    const [rows] = await pool.query(consulta, [idSuscripcion]);

    if (rows.length === 0) {
      return res.status(204).json({
        message: "No hay novedades para esta suscripción",
      });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.log("error en getNovedadesSuscripcion", error);
    return res.status(500).json({
      message: "Error al obtener las novedades de la suscripción",
      error: error.message,
    });
  }
};

// novedades de todas las suscripciones con filtros opcionales
export const getNovedades = async (req, res) => {
  const { buscar, fechaDesde, fechaHasta } = req.query;
  try {
    const condiciones = [];
    const valores = [];

    if (buscar) {
      condiciones.push("(n.suscripcion_id LIKE ? OR c.nombreCliente LIKE ?)");
      valores.push(`%${buscar}%`, `%${buscar}%`);
    }
    if (fechaDesde) {
      condiciones.push("DATE(n.fechaNovedad) >= ?");
      valores.push(fechaDesde);
    }
    if (fechaHasta) {
      condiciones.push("DATE(n.fechaNovedad) <= ?");
      valores.push(fechaHasta);
    }

    const where = condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : "";

    const consulta = `
      SELECT n.*,
        c.nombreCliente
      FROM novedades n
      LEFT JOIN suscripciones s ON n.suscripcion_id = s.idSuscripcion
      LEFT JOIN clientes c ON s.cliente_id = c.idCliente
      ${where}
      ORDER BY n.idNovedad DESC
    `;

    const [rows] = await pool.query(consulta, valores);

    if (rows.length === 0) {
      return res.status(204).json({ message: "No hay novedades" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.log("error en getNovedades", error);
    return res.status(500).json({
      message: "Error al obtener las novedades",
      error: error.message,
    });
  }
};