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
          s.Estado,
          n.novedad,
          n.fechaNovedad AS fecha_novedad,
          COALESCE(saldos.saldoPendiente, 0) AS saldoPendiente
      FROM suscripciones s
      INNER JOIN clientes c ON s.cliente_id = c.idCliente
      INNER JOIN productos p ON s.producto_id = p.idProducto
      LEFT JOIN (
          SELECT 
              suscripcion_id, 
              novedad,
              fechaNovedad
          FROM novedades 
          WHERE idNovedad IN (
              SELECT MAX(idNovedad) 
              FROM novedades 
              GROUP BY suscripcion_id
          )
      ) n ON s.idSuscripcion = n.suscripcion_id
      LEFT JOIN (
          SELECT 
              f.suscripcion_id,
              SUM(f.valor - IFNULL(p.totalPagado, 0)) AS saldoPendiente
          FROM facturas f
          LEFT JOIN (
              SELECT 
                  factura_id,
                  SUM(valorPago) AS totalPagado
              FROM pagos
              GROUP BY factura_id
          ) p ON f.idFactura = p.factura_id
          WHERE f.estado IN ('Pendiente por pagar', 'Pago Parcial')
          GROUP BY f.suscripcion_id
      ) saldos ON s.idSuscripcion = saldos.suscripcion_id
      WHERE s.Estado = 'Activo'
        AND NOT EXISTS (
          SELECT 1 
          FROM facturas f
          WHERE f.suscripcion_id = s.idSuscripcion
            AND f.year = 2025
            AND f.mes = 6
        );
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
  const { suscripciones, year, mes, usuarioId } = req.body;

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
        p.idProducto AS producto_id,
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
        suscripcion.producto_id,
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
      INSERT INTO facturas (producto_id, suscripcion_id, year, mes, valor, estado, codigoFactura)
      VALUES ?
      `,
      [facturasAInsertar]
    );

    // 7. preparar auditorías
    const auditorias = facturasAInsertar.map((factura, index) => [
      usuarioId,
      "Crear",
      "Facturación",
      `Factura #${insertResult.insertId + index} con el codigo #${
        factura[6]
      } para suscripción ${factura[1]}`,
    ]);

    // 8. Insertar auditorías
    if (auditorias.length > 0) {
      await pool.query(
        `
        INSERT INTO auditoria (usuario_id, accion, modulo, descripcion)
        VALUES ?
        `,
        [auditorias]
      );
    }

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
          f.suscripcion_id,
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
        f.fechaFactura,
        c.idCliente,
        c.nombreCliente,
        p.nombreProducto,
        s.direccionServicio,
        s.idSuscripcion
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

    // Consultar los pagos asociados a la factura
    const [pagos] = await pool.query(
      `
      SELECT idPagos, fechaPago, valorPago
      FROM pagos
      WHERE factura_id = ?
      ORDER BY fechaPago ASC
      `,
      [id]
    );

    // Calcular total pagado anterior
    const [saldoRows] = await pool.query(
      `
      SELECT 
        SUM(f.valor - IFNULL(p.totalPagado, 0)) AS saldoPendienteAnterior
      FROM facturas f
      LEFT JOIN (
        SELECT 
          factura_id, 
          SUM(valorPago) AS totalPagado
        FROM pagos
        GROUP BY factura_id
      ) p ON f.idFactura = p.factura_id
      WHERE 
        f.suscripcion_id = ? 
        AND f.idFactura < ?
        AND f.estado IN ('Pendiente por pagar', 'Pago Parcial')
      `,
      [factura.idSuscripcion, id]
    );

    const saldoPendienteAnterior = saldoRows[0]?.saldoPendienteAnterior || 0;

    // respuesta
    res.json({
      factura,
      pagos,
      saldoPendienteAnterior,
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

// obtener pagos
export const getPagos = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, cliente, codigoFactura } = req.query;

    const condiciones = [];
    const valores = [];

    if (fechaDesde) {
      condiciones.push("DATE(p.fechaPago) >= ?");
      valores.push(fechaDesde);
    }

    if (fechaHasta) {
      condiciones.push("DATE(p.fechaPago) <= ?");
      valores.push(fechaHasta);
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
        p.idPagos,
        p.fechaPago,
        p.valorPago,
        f.codigoFactura,
        c.nombreCliente
      FROM pagos p
      INNER JOIN facturas f ON p.factura_id = f.idFactura
      INNER JOIN suscripciones s ON f.suscripcion_id = s.idSuscripcion
      INNER JOIN clientes c ON s.cliente_id = c.idCliente
      ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}
      ORDER BY p.fechaPago DESC
    `;

    console.log("Consulta SQL:", sql);
    console.log("Valores:", valores);

    const [rows] = await pool.query(sql, valores);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Obtener pago por ID
export const getPago = async (req, res) => {
  const { id } = req.params;

  console.log("estamos en backend con el idPago :) ", id);

  try {
    const [pagoRows] = await pool.query(
      `
      SELECT 
        p.idPagos,
        p.fechaPago,
        p.valorPago,
        f.codigoFactura,
        c.nombreCliente
      FROM pagos p
      INNER JOIN facturas f ON p.factura_id = f.idFactura
      INNER JOIN suscripciones s ON f.suscripcion_id = s.idSuscripcion
      INNER JOIN clientes c ON s.cliente_id = c.idCliente
      WHERE p.idPagos = ?
    `,
      [id]
    );

    if (pagoRows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.json(pagoRows[0]);
  } catch (error) {
    console.error("Error al obtener pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener cartera
export const getCartera = async (req, res) => {
  const { estado, cliente, idSuscripcion } = req.query;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        s.idSuscripcion,
        c.nombreCliente,
        p.nombreProducto,
        s.direccionServicio,
        s.Estado AS estadoSuscripcion,
        SUM(f.valor) AS totalFacturado,
        SUM(IFNULL(p.totalPagado, 0)) AS totalPagado,
        SUM(f.valor) - SUM(IFNULL(p.totalPagado, 0)) AS saldoPendiente,
        COUNT(f.idFactura) AS cantidadFacturas
      FROM suscripciones s
      JOIN clientes c ON s.cliente_id = c.idCliente
      JOIN productos p ON s.producto_id = p.idProducto
      JOIN facturas f ON f.suscripcion_id = s.idSuscripcion
      LEFT JOIN (
        SELECT factura_id, SUM(valorPago) AS totalPagado
        FROM pagos
        GROUP BY factura_id
      ) p ON p.factura_id = f.idFactura
      WHERE f.estado IN ('Pendiente por pagar', 'Pago Parcial')
      ${estado ? "AND f.estado = ?" : ""}
      ${cliente ? "AND c.nombreCliente LIKE ?" : ""}
      ${idSuscripcion ? "AND s.idSuscripcion = ?" : ""}
      GROUP BY s.idSuscripcion
      HAVING saldoPendiente > 0
      ORDER BY s.idSuscripcion
    `,
      [
        ...(estado ? [estado] : []),
        ...(cliente ? [`%${cliente}%`] : []),
        ...(idSuscripcion ? [idSuscripcion] : []),
      ]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo cartera:", error);
    res.status(500).json({ message: "Error obteniendo cartera" });
  }
};

// Obtener estado de cuenta del cliente
export const getEstadoCuentaCliente = async (req, res) => {
  const { idCliente } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT  
        f.idFactura,
        f.codigoFactura,
        f.suscripcion_id,
        f.valor AS valorFactura, 
        COALESCE(SUM(p.valorPago), 0) AS totalPagado
      FROM facturas f
      JOIN suscripciones s ON f.suscripcion_id = s.idSuscripcion
      LEFT JOIN pagos p ON f.idFactura = p.factura_id
      WHERE s.cliente_id = ?
      AND (f.estado = 'Pendiente por pagar' OR f.estado = 'Pago Parcial')
      GROUP BY f.idFactura
      ORDER BY f.idFactura DESC
    `,
      [idCliente]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron facturas." });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo estado de cuenta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener estado de cuenta de la suscripcion
export const getCarteraSuscripcion = async (req, res) => {
  const { idSuscripcion } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT  
        f.idFactura,
        f.codigoFactura,
        f.valor AS valorFactura, 
        COALESCE(SUM(p.valorPago), 0) AS totalPagado
      FROM facturas f
      LEFT JOIN pagos p ON f.idFactura = p.factura_id
      WHERE f.suscripcion_id = ?
      AND (f.estado = 'Pendiente por pagar' OR f.estado = 'Pago Parcial')
      GROUP BY f.idFactura
      ORDER BY f.idFactura DESC
    `,
      [idSuscripcion]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron facturas." });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo estado de cuenta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//obtener factura de reconexión
export const getFacturaReconexion = async (req, res) => {
  const { idSuscripcion } = req.params;

  // validar que exista la suscripcion
  if (!idSuscripcion) {
    return res
      .status(400)
      .json({ message: "No de ha obtenido el numero de suscripcion" });
  }

  // Busco novedad
  try {
    const [resultadoFacturaReconexion] = await pool.query(
      `
        SELECT f.codigoFactura, f.fechaFactura, p.nombreProducto, f.valor, f.estado, f.idFactura
        FROM novedades n
        JOIN facturasnovedades fn ON fn.novedad_id = n.idNovedad
        JOIN facturas f ON f.idFactura = fn.factura_id
        JOIN productos p ON p.idProducto = f.producto_id
        WHERE n.suscripcion_id = ?
        AND n.novedad = 'Suspensión'    `,
      [idSuscripcion]
    );

    if (resultadoFacturaReconexion.length === 0) {
      return res.status(404).json({ message: "No hay factura de reconexión." });
    }
    const facturaReconexion = resultadoFacturaReconexion[0];
    res.json(facturaReconexion);
  } catch (error) {
    console.error("Error obteniendo factura de reconexión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// generar factura reconexion
export const crearFacturaReconexion = async (req, res) => {
  const { idSuscripcion, usuarioId } = req.body;
  const ProductoId = 10; // ID del producto de reconexión, debe ser el correcto según tu base de datos
  console.log("Datos recibidos para crear factura de reconexión:", req.body);

  try {
    // Verificar si las suscripciones ya tienen factura de reconexión
    // primero busco la novedad de suspensión
    const [novedadRows] = await pool.query(
      `
      SELECT idNovedad, suscripcion_id
      FROM novedades
      WHERE suscripcion_id = ? AND novedad = 'Suspensión'
      order by fechaNovedad desc
      limit 1
      `,
      [idSuscripcion]
    );

    if (novedadRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Novedad de suspensión no encontrada." });
    }

    // busco idNovedad facturasnovedades
    const [facturaNovedadesRows] = await pool.query(
      `
      SELECT *
      FROM facturasnovedades
      WHERE novedad_id = ?
      `,
      [novedadRows[0].idNovedad]
    );

    if (facturaNovedadesRows.length > 0) {
      return res.status(400).json({
        message: "Ya existe una factura de reconexión para esta suscripción.",
      });
    }

    // Generar el código de la factura

    // Obtener el último consecutivo de facturas de reconexión
    const [resultadoConsecutivo] = await pool.query(
      `
      SELECT codigoFactura 
      FROM facturas
      WHERE producto_id = ?
      ORDER BY idFactura DESC
      LIMIT 1
      `,
      [ProductoId]
    );

    let nuevoCodigoFactura;

    // genero el nuevo código de factura
    if (resultadoConsecutivo.length > 0) {
      const ultimoCodigo = resultadoConsecutivo[0].codigoFactura;
      const partes = ultimoCodigo.split("-");
      const ultimoConsecutivo = parseInt(partes[1]);
      const nuevoConsecutivo = ultimoConsecutivo + 1;
      nuevoCodigoFactura = `R-${nuevoConsecutivo}`;
    } else {
      nuevoCodigoFactura = "R-1";
    }

    // Obtener el producto de reconexión
    const [productoReconexion] = await pool.query(
      `
      SELECT idProducto, nombreProducto, precioProducto
      FROM productos
      WHERE idProducto = ?
      `,
      [ProductoId]
    );

    // insertar la factura de reconexión
    const [insertResult] = await pool.query(
      `
      INSERT INTO facturas (producto_id, suscripcion_id, valor, estado, codigoFactura)
      VALUES (?, ?, ?, 'Pendiente por pagar', ?)
      `,
      [
        ProductoId,
        idSuscripcion,
        productoReconexion[0].precioProducto,
        nuevoCodigoFactura,
      ]
    );

    // insertar registro en facturasnovedades
    await pool.query(
      `
            INSERT INTO facturasnovedades (factura_id, novedad_id)
            VALUES (?, ?)
            `,
      [insertResult.insertId, novedadRows[0].idNovedad]
    );

    // insterto registro en auditoria
    await pool.query(
      `
            INSERT INTO auditoria (usuario_id, accion, modulo, descripcion)
            VALUES (?, ?, ?, ?)
            `,
      [
        usuarioId,
        "Crear",
        "Facturación",
        `Factura de reconexión #${insertResult.insertId}`,
      ]
    );
    // Responder con éxito
    res.json({
      message: "Factura de reconexión creada con éxito.",
      idFactura: insertResult.insertId,
      codigoFactura: nuevoCodigoFactura,
      valor: productoReconexion[0].precioProducto,
      producto: productoReconexion[0].nombreProducto,
      estado: "Pendiente por pagar",
      fechaFactura: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
    });
  } catch (error) {
    console.error("Error creando factura de reconexión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
