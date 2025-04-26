import { pool } from "../db.js";

// Obtener registros pendientes por facturar

export const getFacturasPendientes = async (req, res) => {
  const { year, mes } = req.query;

  if (!year || !mes) {
    return res.status(400).json({ message: "Año y mes son obligatorios." });
  }

  try {
    const consulta = `
    SELECT 
      s.idSuscripcion,
      c.nombreCliente,
      p.nombreProducto,
      s.direccionServicio,
      p.precioProducto AS valor,
      s.Estado
    FROM suscripciones s
    INNER JOIN clientes c ON s.cliente_id = c.idCliente
    INNER JOIN productos p ON s.producto_id = p.idProducto
    WHERE s.Estado = 'Activo'
      AND NOT EXISTS (
        SELECT 1 FROM facturas f
        WHERE f.suscripcion_id = s.idSuscripcion
          AND f.year = ?
          AND f.mes = ?
      )
    `;
    const [rows] = await pool.query(consulta, [year, mes]);

    res.json(rows);
  } catch (error) {
    console.error("Error buscando registros para prefacturación:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
