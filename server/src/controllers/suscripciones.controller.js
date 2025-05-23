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
}

export const createSuscripcion = async (req, res) => {
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

    // registrar en auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Crear",
      "Suscripciones",
      `Se creó la suscripción número ${result.insertId}`,
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
