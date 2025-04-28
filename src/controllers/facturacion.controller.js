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

// Crear facturas
export const crearFacturas = async (req, res) => {
  const { suscripciones, year, mes } = req.body;

  if (
    !suscripciones ||
    !Array.isArray(suscripciones) ||
    suscripciones.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Debe enviar las suscripciones a facturar." });
  }

  if (!year || !mes) {
    return res.status(400).json({ message: "Debe enviar año y mes." });
  }

  try {
    // 1. Verificar qué suscripciones ya tienen factura
    const [facturasExistentes] = await pool.query(
      `
      SELECT suscripcion_id
      FROM facturas
      WHERE year = ? AND mes = ? AND suscripcion_id IN (?)
      `,
      [year, mes, suscripciones]
    );

    const suscripcionesYaFacturadas = facturasExistentes.map(
      (f) => f.suscripcion_id
    );

    // 2. Filtrar solo las que NO tienen factura
    const suscripcionesAFacturar = suscripciones.filter(
      (id) => !suscripcionesYaFacturadas.includes(id)
    );

    if (suscripcionesAFacturar.length === 0) {
      return res.status(400).json({
        message: "Todas las suscripciones seleccionadas ya tienen factura.",
        facturadas: suscripcionesYaFacturadas,
      });
    }

    // 3. Obtener último consecutivo
    const [resultadoConsecutivo] = await pool.query(
      `
      SELECT codigoFactura 
      FROM facturas
      WHERE year = ? AND mes = ?
      ORDER BY idFactura DESC
      LIMIT 1
      `,
      [year, mes]
    );

    let ultimoConsecutivo = 0;

    if (resultadoConsecutivo.length > 0) {
      const ultimoCodigo = resultadoConsecutivo[0].codigoFactura;
      const partes = ultimoCodigo.split("-");
      ultimoConsecutivo = parseInt(partes[2]) || 0;
    }

    // 4. Obtener datos de las suscripciones válidas
    const [datosSuscripciones] = await pool.query(
      `
      SELECT 
        s.idSuscripcion,
        p.precioProducto
      FROM suscripciones s
      INNER JOIN productos p ON s.producto_id = p.idProducto
      WHERE s.idSuscripcion IN (?)
      `,
      [suscripcionesAFacturar]
    );

    if (datosSuscripciones.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron suscripciones válidas." });
    }

    // 5. Preparar facturas a insertar
    const facturasAInsertar = datosSuscripciones.map((suscripcion, index) => {
      const consecutivo = ultimoConsecutivo + index + 1;
      const codigoFactura = `${year.toString().slice(-2)}-${mes
        .toString()
        .padStart(2, "0")}-${consecutivo}`;
      return [
        suscripcion.idSuscripcion,
        year,
        mes,
        suscripcion.precioProducto,
        "Pendiente por pagar",
        codigoFactura,
      ];
    });

    // 6. Insertar facturas
    const [insertResult] = await pool.query(
      `
      INSERT INTO facturas (suscripcion_id, year, mes, valor, estado, codigoFactura)
      VALUES ?
      `,
      [facturasAInsertar]
    );

    res.json({
      message: "Facturación completada.",
      facturasCreadas: insertResult.affectedRows,
      facturasDuplicadas: suscripcionesYaFacturadas,
    });
  } catch (error) {
    console.error("Error generando facturas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
