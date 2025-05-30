import { pool } from "../db.js";
import { createAccessToken } from "../libs/jwt.js";

export const getClientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    console.log("error en catch de getClientes", error);
    res.status(500).json("Error Catch en getClientes: " + error.message);
  }
};

export const createCliente = async (req, res) => {
  const {
    tipoId,
    numeroId,
    nombreCliente,
    emailCliente,
    telefono,
    direccion,
    usuarioId,
  } = req.body;

  // Validar campos obligatorios
  if (!tipoId || !numeroId || !nombreCliente || !telefono || !direccion) {
    return res.status(400).json(["Todos los campos son obligatorios"]);
  }

  try {
    // Verificar si el cliente ya existe con tipoId y numeroId
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE tipoId = ? AND numeroId = ?",
      [tipoId, numeroId]
    );
    if (rows.length > 0) return res.status(400).json(["El cliente ya existe"]);

    // Guardar cliente en la base de datos
    const result = await pool.query(
      "INSERT INTO clientes (tipoId, numeroId, nombreCliente, emailCliente, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)",
      [tipoId, numeroId, nombreCliente, emailCliente, telefono, direccion]
    );

    // obtengo el id del cliente creado
    const idCliente = result[0].insertId;

    // guardar auditoria
    const [rowsAuditoria] = await pool.query(
      "INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)",
      [usuarioId, "Crear", "Clientes", `Cliente ${idCliente} creado`]
    );

    res.status(201).json({
      message: "Cliente creado",
      idCliente: idCliente,
    });
  } catch (error) {
    console.log("error en catch", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE idCliente = ?",
      [id]
    );
    if (rows.length <= 0)
      return res.status(404).json(["Cliente no encontrado" ]);
    res.json(rows[0]);
  } catch (error) {
    console.log("error en catch getCliente", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const {
    tipoId,
    numeroId,
    nombreCliente,
    emailCliente,
    telefono,
    direccion,
    usuarioId,
  } = req.body;
  // Validar campos obligatorios
  if (!tipoId || !numeroId || !nombreCliente || !telefono || !direccion) {
    return res.status(400).json(["Todos los campos son obligatorios"]);
  }
  try {
    // Verificar si el cliente ya existe con tipoId y numeroId y idCliente diferente
    const [clienteExiste] = await pool.query(
      "SELECT * FROM clientes WHERE tipoId = ? AND numeroId = ? AND idCliente != ?",
      [tipoId, numeroId, id]
    );
    if (clienteExiste.length > 0)
      return res.status(400).json(["Error al actualizar el cliente, la identificacion (Tipo + identificacion) ya existen en otro cliente"]);

    const [result] = await pool.query(
      "UPDATE clientes SET tipoId = ?, numeroId = ?, nombreCliente = ?, emailCliente = ?, telefono = ?, direccion = ? WHERE idCliente = ?",
      [tipoId, numeroId, nombreCliente, emailCliente, telefono, direccion, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json(["Cliente no encontrado"]);

    // registrar audiroria
    const [rows] = await pool.query(
      "INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)",
      [usuarioId, "Actualizar", "Clientes", `Cliente ${id} actualizado`]
    );

    res.status(200).json({
      message: "Cliente actualizado exitosamente",
      idCliente: id,
    });
  } catch (error) {
    console.log("error en catch updateCliente", error);
    res.status(500).json({ message: error.message });
  }
};
