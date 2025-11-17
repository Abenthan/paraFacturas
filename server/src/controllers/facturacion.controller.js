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
			suscripcion_id, novedad, fechaNovedad
		FROM novedades 
		WHERE idNovedad IN (
			SELECT MAX(idNovedad) 
			FROM novedades 
			WHERE YEAR(fechaNovedad) = ? 
				AND MONTH(fechaNovedad) = ?
			GROUP BY suscripcion_id
		)
		AND YEAR(fechaNovedad) = ?
		AND MONTH(fechaNovedad) = ?
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
              FROM pagofactura
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
            AND f.year = ?
            AND f.mes = ?)
    `;
    const [rows] = await pool.query(consulta, [
      year,
      mes,
      year,
      mes,
      year,
      mes,
    ]);

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

    // Consulta para obtener las facturas
    const facturasSql = `
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
          p.nombreProducto,
          COALESCE(v.valor_pendiente, 0) AS valor_pendiente,
          COALESCE(v.facturas_vencidas, 0) AS facturas_vencidas,
          (f.valor + COALESCE(v.valor_pendiente, 0)) AS totalPagar
        FROM facturas f
        INNER JOIN suscripciones s ON f.suscripcion_id = s.idSuscripcion
        INNER JOIN clientes c ON s.cliente_id = c.idCliente
        INNER JOIN productos p ON s.producto_id = p.idProducto
        left join (
	        SELECT 
		        suscripcion_id AS 'suscripcionId',
		        SUM(valor) AS 'valor_pendiente',
		        count(*) as 'Facturas_vencidas'
	        FROM facturas
	        where not (year = ? and mes = ?)
		        or year is null
		        or mes is null
	        GROUP BY suscripcion_id
        ) v on f.suscripcion_id = v.suscripcionId
        ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}
        ORDER BY f.idFactura DESC
      `;
    const valoresConsulta = [year, mes, ...valores];

    // Consulta para obtener los totales
    const totalesSql = `
        SELECT 
	        sum(f.valor) as totalFacturasMes,
          sum(coalesce(p.valor_pendiente, 0)) as totalPendiente,
          sum(f.valor + coalesce(p.valor_pendiente, 0)) as totalFacturacion
        FROM facturas f
          left join(
	          select
		          suscripcion_id,
		          sum(valor) as valor_pendiente
	          from facturas
            where not (year = ? AND mes = ?)
		          or year is null
              or mes is null
	          group by suscripcion_id    
          ) p on f.suscripcion_id = p.suscripcion_id
        ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}
        `;
    const [rows, totales] = await Promise.all([
      pool.query(facturasSql, valoresConsulta),
      pool.query(totalesSql, valoresConsulta),
    ]);

    // Arreglo con facturas y totales
    const facturas = {
      facturas: rows[0],
      totales: totales[0] || {
        totalFacturasMes: 0,
        totalPendiente: 0,
        totalFacturacion: 0,
      },
    };

    res.json(facturas);
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
        f.producto_id,
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
      INNER JOIN productos p ON f.producto_id = p.idProducto
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
      SELECT idPagoFactura, fechaPago, valorPago
      FROM pagoFactura
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
        FROM pagoFactura
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
  const { idFactura, valorPago, idSuscripcion, usuarioId } = req.body;

  if (!idFactura || !valorPago || valorPago <= 0) {
    return res
      .status(400)
      .json({ message: "Datos inválidos para registrar el pago." });
  }

  try {
    // Obtener todas las facturas pendientes anteriores o igual a la actual
    const [facturasPendientes] = await pool.query(
      `SELECT 
        f.idFactura,
        f.codigoFactura,
        f.fechaFactura,
        f.valor AS valorFactura,
        COALESCE(SUM(p.valorPago), 0) AS pagosRealizados,
        (f.valor - COALESCE(SUM(p.valorPago), 0)) AS saldoFactura
      FROM 
        facturas f
        LEFT JOIN pagoFactura p ON f.idFactura = p.factura_id
      WHERE 
        f.suscripcion_id = ? AND
        (f.estado = "Pendiente por pagar" OR f.estado = "Pago Parcial") AND
        f.idFactura <= ?
      GROUP BY 
        f.idFactura
      ORDER BY 
        f.fechaFactura ASC
      `,
      [idSuscripcion, idFactura]
    );

    if (facturasPendientes.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay facturas pendientes para aplicar el pago." });
    }

    // registrar en pagos
    const [pagoRegistro] = await pool.query(
      "INSERT INTO pagos (suscripcion_id, valorPago) VALUES (?, ?)",
      [idSuscripcion, valorPago]
    );

    const pagosRealizados = [];

    async function registrarUnPago(idFactura, valor, nuevoEstado) {
      const [pago] = await pool.query(
        "INSERT INTO pagoFactura (idPago, factura_id, valorPago) VALUES (?, ?, ?)",
        [pagoRegistro.insertId, idFactura, valor]
      );

      // Actualizar estado de la factura
      await pool.query("UPDATE facturas SET estado = ? WHERE idFactura = ?", [
        nuevoEstado,
        idFactura,
      ]);

      // Registrar auditoría
      await pool.query(
        `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion)
         VALUES (?, ?, ?, ?)`,
        [
          usuarioId,
          "Insertar",
          "Pagos",
          `Pago de $${valor} aplicado a factura ${idFactura} (ID Pago: ${pagoRegistro.insertId})`,
        ]
      );

      // Retornar para la respuesta
      pagosRealizados.push({
        idFactura,
        valorPagado: valor,
        estado: nuevoEstado,
        idPago: pago.insertId,
      });
    }

    let saldoPago = Number(valorPago);

    for (const factura of facturasPendientes) {
      const { idFactura, saldoFactura } = factura;

      if (saldoPago <= 0) break;

      if (saldoPago > Number(saldoFactura)) {
        console.log(
          `idFactura: ${idFactura}, saldoPago $${saldoPago}, saldoFactura : $${saldoFactura}, 1`
        );
        await registrarUnPago(idFactura, saldoFactura, "Cancelada");
        saldoPago -= saldoFactura;
      } else if (saldoPago === Number(saldoFactura)) {
        console.log(
          `idFactura: ${idFactura}, saldoPago $${saldoPago}, saldoFactura : $${saldoFactura}, 2`
        );
        await registrarUnPago(idFactura, saldoPago, "Cancelada");
        saldoPago = 0;
        break;
      } else {
        console.log(
          `idFactura: ${idFactura}, saldoPago $${saldoPago}, saldoFactura : $${saldoFactura}, 3`
        );
        await registrarUnPago(idFactura, saldoPago, "Pago Parcial");
        saldoPago = 0;
        break;
      }
    }

    res.status(200).json({
      message: "Pago registrado exitosamente.",
      pagos: pagosRealizados,
      idPago: pagoRegistro.insertId,
    });
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// obtener pagos
export const getPagos = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, cliente, suscripcion } = req.query;

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

    if (suscripcion) {
      condiciones.push("p.suscripcion_id = ?");
      valores.push(suscripcion);
    }

    const sql = `
      SELECT 
        p.idPago,
        p.suscripcion_id,
        p.fechaPago,
        p.valorPago,
        c.nombreCliente
      FROM pagos p
      INNER JOIN suscripciones s ON p.suscripcion_id = s.idSuscripcion
      INNER JOIN clientes c ON s.cliente_id = c.idCliente
      ${condiciones.length > 0 ? "WHERE " + condiciones.join(" AND ") : ""}
      ORDER BY p.fechaPago DESC
    `;

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

  try {
    const [pagoRows] = await pool.query(
      `
        SELECT 
          p.idPago,
          c.idCliente,  
          c.nombreCliente,
            p.suscripcion_id,
            p.fechaPago,
            p.valorPago,
            pf.idPagoFactura,
            pf.factura_id,
            pf.valorPago as pagoFactura,
            f.codigoFactura,
            f.estado
        FROM pagofactura pf
        inner join pagos p on  pf.idPago = p.idPago
        inner join facturas f on pf.factura_id = f.idFactura
        inner join suscripciones s on p.suscripcion_id = s.idSuscripcion
        inner join clientes c on s.cliente_id = c.idCliente
        where pf.idPago = ?
    `,
      [id]
    );

    if (pagoRows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    res.json(pagoRows);
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
        FROM pagoFactura
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
        f.fechaFactura,
        f.valor AS valorFactura, 
        COALESCE(SUM(p.valorPago), 0) AS totalPagado
      FROM facturas f
      LEFT JOIN pagofactura p ON f.idFactura = p.factura_id
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

// crear factura de traslado
export const crearFacturaTraslado = async (req, res) => {
  const { idSuscripcion, usuarioId, nuevaDireccion } = req.body;
  const ProductoId = 13;

  try {
    // GENERAR EL CÓDIGO DE LA FACTURA

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
      nuevoCodigoFactura = `T-${nuevoConsecutivo}`;
    } else {
      nuevoCodigoFactura = "T-1";
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

    // Obtener observaciones de la suscripción
    const consultaSuscripcion =
      "SELECT direccionServicio FROM parafacturas.suscripciones where idSuscripcion = ?";
    const [suscripcionRows] = await pool.query(consultaSuscripcion, [
      idSuscripcion,
    ]);
    const observaciones = ` Direccion Antes del traslado: ${suscripcionRows[0].direccionServicio}`;

    // Actualizar direccion en suscripciones
    const consultaActualizarSuscripcion = `
      UPDATE suscripciones 
      SET direccionServicio = ?, Observaciones = ? 
      WHERE idSuscripcion = ?
    `;
    await pool.query(consultaActualizarSuscripcion, [
      nuevaDireccion,
      observaciones,
      idSuscripcion,
    ]);

    // insertar registro en novedades
    const [novedadInsertResult] = await pool.query(
      `
      INSERT INTO novedades (novedad, fechaNovedad, descripcionNovedad, suscripcion_id)
      VALUES ('Traslado', NOW(), ?, ?)
      `,
      [
        `Traslado de servicio a la nueva dirección: ${nuevaDireccion}`,
        idSuscripcion,
      ]
    );

    // insertar registro en facturasnovedades
    await pool.query(
      `
            INSERT INTO facturasnovedades (factura_id, novedad_id)
            VALUES (?, ?)
            `,
      [insertResult.insertId, novedadInsertResult.insertId]
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
        `Factura de traslado #${insertResult.insertId}`,
      ]
    );

    // Responder con éxito
    res.json({
      message:
        "Direccion actualizada, novedad creada y factura generada con éxito.",
      idFactura: insertResult.insertId,
      codigoFactura: nuevoCodigoFactura,
      valor: productoReconexion[0].precioProducto,
      producto: productoReconexion[0].nombreProducto,
      estado: "Pendiente por pagar",
      fechaFactura: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
      idNovedad: novedadInsertResult.insertId,
    });
  } catch (error) {
    console.error("Error creando factura de traslado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
