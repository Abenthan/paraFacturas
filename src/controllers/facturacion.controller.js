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

// Obtener facturas
export const getFacturas = async (req, res) => {
  try {
    const { year, mes, estado, cliente, codigoFactura } = req.query;

    const condiciones = [];
    const valores = [];

    if (year) {
      condiciones.push("f.year = ?");
      valores.push(Number(year));
    }

    if (mes) {
      condiciones.push("f.mes = ?");
      valores.push(Number(mes));
    }

    if (estado) {
      condiciones.push("f.estado = ?");
      valores.push(estado);
    }

    if (cliente) {
      condiciones.push("LOWER(c.nombreCliente) LIKE ?");
      valores.push(`%${cliente.toLowerCase()}%`);
    }

    if (codigoFactura) {
      condiciones.push("f.codigoFactura LIKE ?");
      valores.push(`%${codigoFactura}%`);
    }

    const sql = `
        SELECT 
          f.idFactura,
          f.codigoFactura,
          f.valor,
          f.estado,
          f.year,
          f.mes,
          c.nombreCliente,
          s.direccionServicio,
          p.nombreProducto
        FROM facturas f
        INNER JOIN suscripciones s ON f.suscripcion_id = s.idSuscripcion
        INNER JOIN clientes c ON s.cliente_id = c.idCliente
        INNER JOIN productos p ON s.producto_id = p.idProducto
        ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}
        ORDER BY f.idFactura DESC
      `;

    const [rows] = await pool.query(sql, valores);

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo facturas:", error);
    res.status(500).json({ message: "Error al obtener facturas" });
  }
};

// Obtener factura por ID
export const getFactura = async (req, res) => {
  const { id } = req.params;
  console.log("ID de factura:", id);

  try {
    // Consultar la factura con cliente, producto y dirección
    const [facturaRows] = await pool.query(
      `
      SELECT 
        f.idFactura,
        f.codigoFactura,
        f.valor,
        f.estado,
        f.year,
        f.mes,
        c.nombreCliente,
        p.nombreProducto,
        s.direccionServicio
      FROM facturas f
      INNER JOIN suscripciones s ON f.suscripcion_id = s.idSuscripcion
      INNER JOIN clientes c ON s.cliente_id = c.idCliente
      INNER JOIN productos p ON s.producto_id = p.idProducto
      WHERE f.idFactura = ?
      `,
      [id]
    );

    if (facturaRows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    const factura = facturaRows[0];

    // Consultar los pagos asociados
    const [pagos] = await pool.query(
      `
      SELECT idPagos, fechaPago, valorPago
      FROM pagos
      WHERE factura_id = ?
      ORDER BY fechaPago ASC
      `,
      [id]
    );

    res.json({
      factura,
      pagos,
    });
  } catch (error) {
    console.error("Error al obtener detalle de factura:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Registrar pago
export const registrarPago = async (req, res) => {
  const { idFactura, valorPago } = req.body;

  if (!idFactura || !valorPago || valorPago <= 0) {
    return res
      .status(400)
      .json({ message: "Datos inválidos para registrar el pago." });
  }

  try {
    // Verificar si la factura existe
    const [facturaRows] = await pool.query(
      "SELECT valor FROM facturas WHERE idFactura = ?",
      [idFactura]
    );

    if (facturaRows.length === 0) {
      return res.status(404).json({ message: "Factura no encontrada." });
    }

    const valorFactura = Number(facturaRows[0].valor);

    // Calcular total pagado hasta ahora
    const [pagosRows] = await pool.query(
      "SELECT SUM(valorPago) AS totalPagado FROM pagos WHERE factura_id = ?",
      [idFactura]
    );

    const totalPagado = Number(pagosRows[0].totalPagado) || 0;
    const saldoPendiente = valorFactura - totalPagado;

    if (valorPago > saldoPendiente) {
      return res
        .status(400)
        .json({ message: "El valor a pagar excede el saldo pendiente." });
    }

    // Registrar el nuevo pago
    await pool.query(
      "INSERT INTO pagos (factura_id, valorPago) VALUES (?, ?)",
      [idFactura, valorPago]
    );

    // Actualizar el estado de la factura si es necesario
    const nuevoTotalPagado = totalPagado + Number(valorPago);
    let nuevoEstado = "Pendiente por pagar";

    console.log("Nuevo total pagado:", nuevoTotalPagado);
    console.log("Valor de la factura:", valorFactura);

    if (nuevoTotalPagado >= valorFactura) {
      nuevoEstado = "Cancelada";
    } else if (nuevoTotalPagado > 0 && nuevoTotalPagado < valorFactura) {
      nuevoEstado = "Pago Parcial";
    }

    await pool.query("UPDATE facturas SET estado = ? WHERE idFactura = ?", [
      nuevoEstado,
      idFactura,
    ]);

    res.json({ message: "Pago registrado con éxito.", nuevoEstado });
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
