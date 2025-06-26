import { pool } from "../db.js";

// buscar las suscripciones de un cliente
export const getSuscripcionesCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const consulta = `SELECT s.*, c.nombreCliente, p.nombreProducto
    FROM suscripciones s 
    JOIN clientes c ON s.cliente_id = c.idCliente
    JOIN productos p ON s.producto_id = p.idProducto
    WHERE s.cliente_id = ?`;
    //const consulta = `SELECT s.*, c.nombreCliente, p.nombreProducto
    //FROM suscripciones s
    //JOIN clientes c ON s.cliente_id = c.idCliente
    //JOIN productos p ON s.producto_id = p.idProducto
    //WHERE s.cliente_id = ?`;

    const [rows] = await pool.query(consulta, [id]);

    return res.status(200).json(rows);
  } catch (error) {
    console.log("error en catch de getSuscripciones", error);
    return res.status(500).json({
      message: "Error al obtener las suscripciones, porfavor intente de nuevo",
      error: error.message,
    });
  }
};

export const getSuscripciones = async (req, res) => {
  try {
    const consulta = `SELECT s.*, c.nombreCliente, p.nombreProducto
    FROM suscripciones s 
    JOIN clientes c ON s.cliente_id = c.idCliente
    JOIN productos p ON s.producto_id = p.idProducto`;
    const [rows] = await pool.query(consulta);

    return res.status(200).json(rows);
  } catch (error) {
    console.log("error en catch de getSuscripciones", error);
    return res.status(500).json({
      message: "Error al obtener las suscripciones, porfavor intente de nuevo",
      error: error.message,
    });
  }
};

export const createSuscripcion = async (req, res) => {
  const productoId = 11; // ID del producto de internet
  try {
    const {
      cliente_id,
      producto_id,
      direccionServicio,
      fechaInicio,
      fechaFin,
      estado,
      observaciones,
      usuarioId,
    } = req.body;
    // validar que el cliente exista
    const [cliente] = await pool.query(
      "SELECT * FROM clientes WHERE idCliente = ?",
      [cliente_id]
    );
    if (cliente.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    // validar que el producto exista
    const [producto] = await pool.query(
      "SELECT * FROM productos WHERE idProducto = ?",
      [producto_id]
    );
    if (producto.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // validar que direccion del servicio no este vacia
    if (!direccionServicio) {
      return res.status(400).json({ message: "Direccion del servicio vacia" });
    }

    // validar que fecha de inicio no este vacia
    if (!fechaInicio) {
      return res.status(400).json({ message: "Fecha de inicio vacia" });
    }

    // crear la suscripcion
    const consulta = `INSERT INTO suscripciones (cliente_id, producto_id, direccionServicio , fechaInicio, fechaFin, estado, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(consulta, [
      cliente_id,
      producto_id,
      direccionServicio,
      fechaInicio,
      fechaFin,
      estado,
      observaciones,
    ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Error al crear la suscripción" });
    }
    // CREAR FACTURA DE SUSCRIPCION
    //1. obtener el ultimo consecutivo de la factura 
    const [resultadoConsecutivo] = await pool.query(
      `
      SELECT codigoFactura 
      FROM facturas
      WHERE producto_id = ?
      ORDER BY idFactura DESC
      LIMIT 1
      `,
      [productoId]
    );

    let nuevoCodigoFactura;

    //2. genero el nuevo código de factura
    if (resultadoConsecutivo.length > 0) {
      const ultimoCodigo = resultadoConsecutivo[0].codigoFactura;
      const partes = ultimoCodigo.split("-");
      const ultimoConsecutivo = parseInt(partes[1]);
      const nuevoConsecutivo = ultimoConsecutivo + 1;
      nuevoCodigoFactura = `NS-${nuevoConsecutivo}`;
    } else {
      nuevoCodigoFactura = "NS-1";
    }

    // Obtener el producto de reconexión
    const [productoReconexion] = await pool.query(
      `
      SELECT idProducto, nombreProducto, precioProducto
      FROM productos
      WHERE idProducto = ?
      `,
      [productoId]
    );

    // insertar la factura de reconexión
    const [insertResult] = await pool.query(
      `
      INSERT INTO facturas (producto_id, suscripcion_id, valor, estado, codigoFactura)
      VALUES (?, ?, ?, 'Pendiente por pagar', ?)
      `,
      [
        productoId,
        result.insertId, // id de la suscripción recién creada
        productoReconexion[0].precioProducto,
        nuevoCodigoFactura,
      ]
    );    

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Crear",
      "Suscripciones",
      `Se creó la suscripción número ${result.insertId} y la factura número ${insertResult.insertId}`,
    ]);

    return res
      .status(201)
      .json({ message: "Suscripción creada", id: result.insertId });
  } catch (error) {
    console.log("error en catch de createSuscripcion", error);
    return res.status(500).json({
      message: "Error Catch en createSuscripcion",
      error: error.message,
    });
  }
};

export const getSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = `SELECT s.*, c.nombreCliente, p.nombreProducto
    FROM suscripciones s 
    JOIN clientes c ON s.cliente_id = c.idCliente
    JOIN productos p ON s.producto_id = p.idProducto
    WHERE s.idSuscripcion = ?`;
    const [rows] = await pool.query(consulta, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log("error en catch de getSuscripcion", error);
    return res.status(500).json({
      message: "Error Catch en getSuscripcion",
      error: error.message,
    });
  }
};

export const updateSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cliente_id,
      direccionServicio,
      fechaInicio,
      fechaFin,
      Estado,
      Observaciones,
      usuarioId,
    } = req.body;

    // validar que el cliente exista
    const [cliente] = await pool.query(
      "SELECT * FROM clientes WHERE idCliente = ?",
      [cliente_id]
    );

    if (cliente.length === 0) {
      return res.status(404).json(["Cliente no encontrado"]);
    }

    // validar que direccion del servicio no este vacia
    if (!direccionServicio) {
      return res.status(400).json(["Direccion del servicio vacia"]);
    }

    // validar que fecha de inicio no este vacia
    if (!fechaInicio) {
      return res.status(400).json(["Fecha de inicio vacia"]);
    }

    // actualizar la suscripcion
    const consulta = `UPDATE suscripciones SET direccionServicio = ?, fechaInicio = ?, fechaFin = ?, estado = ?, observaciones = ? WHERE idSuscripcion = ?`;
    const [result] = await pool.query(consulta, [
      direccionServicio,
      fechaInicio,
      fechaFin,
      Estado,
      Observaciones,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json(["Suscripción no encontrada"]);
    }

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Actualizar",
      "Suscripciones",
      `Se actualizó la suscripción número ${id}`,
    ]);

    res.status(200).json({ message: "Suscripción actualizada" });
  } catch (error) {
    console.log("error en updateSuscripcion", error);
    return res.status(500).json(["Error en el servidor, vuelva a intentarlo"]);
  }
};

export const suspenderSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { usuarioId } = req.body;
    // suspender la suscripcion
    const consulta = `UPDATE suscripciones 
    SET estado = 'Suspendida'
    WHERE idSuscripcion = ?`;
    const [result] = await pool.query(consulta, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json(["Suscripción no encontrada"]);
    }

    // registrar en novedad
    const consultaNovedad = `INSERT INTO novedades (novedad, fechaNovedad, descripcionNovedad,suscripcion_id) VALUES (?, ?, ?, ?)`;
    const [novedad] = await pool.query(consultaNovedad, [
      "Suspensión",
      new Date(),
      `Se suspendió la suscripción número ${id}`,
      id,
    ]);

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Suspender",
      "Suscripciones",
      `Se suspendió la suscripción número ${id}`,
    ]);

    res.status(200).json({ message: "Suscripción suspendida" });
  } catch (error) {
    console.log("error en suspenderSuscripcion", error);
    return res.status(500).json(["Error en el servidor, vuelva a intentarlo"]);
  }
};

export const reconexionSuscripcion = async (req, res) => {
  const { idSuscripcion, usuarioId } = req.body;
  try {
    // actualizar el estado de la suscripcion a Activo
    const consultaSuscripcion = `UPDATE suscripciones
  SET Estado = 'Activo'
  WHERE idSuscripcion = ?`;
    const [suscripcion] = await pool.query(consultaSuscripcion, [
      idSuscripcion,
    ]);

    if (suscripcion.affectedRows === 0) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }

    // insertar la novedad de reconexion
    const consultaNovedad = `INSERT INTO novedades (novedad, fechaNovedad, descripcionNovedad,suscripcion_id) VALUES (?, ?, ?, ?)`;
    const [novedad] = await pool.query(consultaNovedad, [
      "Reconexión",
      new Date(),
      `Se reconectó la suscripción número ${idSuscripcion}`,
      idSuscripcion,
    ]);

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Reconectar",
      "Suscripciones",
      `Se reconectó la suscripción número ${idSuscripcion}`,
    ]);
    res.status(200).json({ message: "Suscripción reconectada" });
  } catch (error) {
    console.log("error en reconexionSuscripcion", error);
    return res.status(500).json({
      message: "Error en el servidor, vuelva a intentarlo",
      error: error.message,
    });
  }
};

export const retirarSuscripcion = async (req, res) => {
  const { idSuscripcion, usuarioId } = req.body;
  try {
    // actualizar el estado de la suscripcion a Retirada
    const consultaSuscripcion = `UPDATE suscripciones
    SET Estado = 'Retirada'
    WHERE idSuscripcion = ?`;
    const [suscripcion] = await pool.query(consultaSuscripcion, [
      idSuscripcion,
    ]);

    if (suscripcion.affectedRows === 0) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }

    // insertar la novedad de retiro
    const consultaNovedad = `INSERT INTO novedades (novedad, fechaNovedad, descripcionNovedad,suscripcion_id) VALUES (?, ?, ?, ?)`;
    const [novedad] = await pool.query(consultaNovedad, [
      "Retiro",
      new Date(),
      `Se retiró la suscripción número ${idSuscripcion}`,
      idSuscripcion,
    ]);

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Retirar",
      "Suscripciones",
      `Se retiró la suscripción número ${idSuscripcion}`,
    ]);
    
    res.status(200).json({ message: "Suscripción retirada" });
  } catch (error) {
    console.log("error en retirarSuscripcion", error);
    return res.status(500).json({
      message: "Error en el servidor, vuelva a intentarlo",
      error: error.message,
    });
  }
}

// Reactivacion de una suscripción
export const reactivarSuscripcion = async (req, res) => {
  const { idSuscripcion, usuarioId } = req.body;
  const productoId = 12; // ID del producto de internet
  try {
    // actualizar el estado de la suscripcion a Activo
    const consultaSuscripcion = `UPDATE suscripciones
    SET Estado = 'Activo'
    WHERE idSuscripcion = ?`;
    const [suscripcion] = await pool.query(consultaSuscripcion, [
      idSuscripcion,
    ]);

    if (suscripcion.affectedRows === 0) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }

    // crear Factura de reactivación
    // 1. obtener el ultimo consecutivo de la factura
    const [resultadoConsecutivo] = await pool.query(
      `
      SELECT codigoFactura
      FROM facturas
      WHERE producto_id = ?
      ORDER BY idFactura DESC
      LIMIT 1
      `,
      [productoId]
    );
    let nuevoCodigoFactura;
    // 2. genero el nuevo código de factura
    if (resultadoConsecutivo.length > 0) {
      const ultimoCodigo = resultadoConsecutivo[0].codigoFactura;
      const partes = ultimoCodigo.split("-");
      const ultimoConsecutivo = parseInt(partes[1]);
      const nuevoConsecutivo = ultimoConsecutivo + 1;
      nuevoCodigoFactura = `RA-${nuevoConsecutivo}`;
    }
    else {
      nuevoCodigoFactura = "RA-1";
    }
    //3. Obtener el producto de reactivación
    const [productoReactivacion] = await pool.query(
      `
      SELECT idProducto, nombreProducto, precioProducto
      FROM productos
      WHERE idProducto = ?
      `,
      [productoId]
    );

    //4. insertar la factura de reactivación
    const [insertResult] = await pool.query(
      `
      INSERT INTO facturas (producto_id, suscripcion_id, valor, estado, codigoFactura)
      VALUES (?, ?, ?, 'Pendiente por pagar', ?)
      `,
      [
        productoId,
        idSuscripcion, // id de la suscripción recién reactivada
        productoReactivacion[0].precioProducto,
        nuevoCodigoFactura,
      ]
    );

    // insertar la novedad de reactivación
    const consultaNovedad = `INSERT INTO novedades (novedad, fechaNovedad, descripcionNovedad,suscripcion_id) VALUES (?, ?, ?, ?)`;
    const [novedad] = await pool.query(consultaNovedad, [
      "Reactivación",
      new Date(),
      `Se reactivó la suscripción número ${idSuscripcion} con la factura número ${insertResult.insertId}`,
      idSuscripcion,
    ]);

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Reactivar",
      "Suscripciones",
      `Se reactivó la suscripción número ${idSuscripcion}`,
    ]);

    res.status(200).json({ message: "Suscripción reactivada" });
  } catch (error) {
    console.log("error en reactivarSuscripcion", error);
    return res.status(500).json({
      message: "Error en el servidor, vuelva a intentarlo",
      error: error.message,
    });
  }
}


