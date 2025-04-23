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
    codigo,
    tipoId,
    numeroId,
    nombreCliente,
    emailCliente,
    telefono,
    direccion,
  } = req.body;

  // Validar campos obligatorios
  if (
    !codigo ||
    !tipoId ||
    !numeroId ||
    !nombreCliente ||
    !emailCliente ||
    !telefono ||
    !direccion
  ) {
    return res
      .status(400)
      .json(["Todos los campos son obligatorios"]);
  } else {
    try {
      // Verificar si el cliente ya existe con tipoId y numeroId
      const [rows] = await pool.query(
        "SELECT * FROM clientes WHERE tipoId = ? AND numeroId = ?",
        [tipoId, numeroId]
      );
      if (rows.length > 0) {
        console.log("El cliente ya existe");

        return res.status(400).json(["El cliente ya existe"]);

      } else {
        // verificar el codigo no existe
        const [rows] = await pool.query(
          "SELECT * FROM clientes WHERE codigo = ?",
          [codigo]
        );
        if (rows.length > 0) {
          return res.status(400).json(["El codigo ya existe"]);
        } else {
          // Guardar cliente en la base de datos
          const result = await pool.query(
            "INSERT INTO clientes (codigo, tipoId, numeroId, nombreCliente, emailCliente, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              codigo,
              tipoId,
              numeroId,
              nombreCliente,
              emailCliente,
              telefono,
              direccion,
            ]
          );

          // Crear el token
          const token = await createAccessToken({ id: result.insertId });
          // responder al frontend
          res.cookie("token", token);
          res.json({
            message: "Cliente creado",
            id: result.insertId,
          });
        }
      }
    } catch (error) {
        console.log("error en catch", error);
        res.status(500).json({ message: error.message });
    }
  }
};

export const getCliente = async (req, res) => {
  console.log("hasta aqui vamos bien");
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE idCliente = ?",
      [id]
    );
    if (rows.length <= 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.log("error en catch getCliente", error);
    res.status(500).json({ message: error.message });
  }
}

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const {
    codigo,
    tipoId,
    numeroId,
    nombreCliente,
    emailCliente,
    telefono,
    direccion,
  } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE clientes SET codigo = ?, tipoId = ?, numeroId = ?, nombreCliente = ?, emailCliente = ?, telefono = ?, direccion = ? WHERE idCliente = ?",
      [
        codigo,
        tipoId,
        numeroId,
        nombreCliente,
        emailCliente,
        telefono,
        direccion,
        id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente actualizado" });
  } catch (error) {
    console.log("error en catch updateCliente", error);
    res.status(500).json({ message: error.message });
  }
};

