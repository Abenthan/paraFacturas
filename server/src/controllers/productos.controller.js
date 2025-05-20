import { pool } from "../db.js";

export const createProducto = async (req, res) => {
  const { nombreProducto, precioProducto, estadoProducto, descripcionProducto , usuarioId } = req.body;

  // Validar que los campos no estén vacíos
  if (!nombreProducto || !precioProducto) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  } else {
    // guardar producto en base de datos
    try {
      const consulta = "INSERT INTO productos (nombreProducto, precioProducto, estadoProducto, descripcionProducto) VALUES (?, ?, ?, ?)";
      const [result] = await pool.query(consulta, [
        nombreProducto,
        precioProducto,
        estadoProducto,
        descripcionProducto,
      ]);

      // registrar auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Crear",
      "Productos",
      `Se creó el producto ${result.insertId}`,
    ]);

      return res
        .status(201)
        .json({
          message: "Producto creado con éxito",
          producto: { id: result.insertId, nombreProducto, precioProducto },
        });
    } catch (error) {
      console.log("error en catch de createProducto", error);
      res
        .status(500)
        .json({
          message: "Error al crear el producto, porfavor intente nuevamente.",
          error: error.message,
        });
    }
  }
};

export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    return res.status(200).json(rows);
  } catch (error) {
    console.log("error en catch de getProductos", error);
    return res.status(500).json("Error Catch en getProductos", error.message);
  }
};

export const getProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM productos WHERE idProducto = ?", [
      id,
    ]);
    if (rows.length <= 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log("error en catch de getProducto", error);
    return res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};

export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombreProducto, precioProducto, estadoProducto, descripcionProducto , usuarioId } = req.body;
  // Validar que los campos no estén vacíos
  if (!nombreProducto || !precioProducto) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  } else {
    try {
      const [result] = await pool.query(
        "UPDATE productos SET nombreProducto = ?, precioProducto = ?, estadoProducto = ?, descripcionProducto = ? WHERE idProducto = ?",
        [nombreProducto, precioProducto, estadoProducto, descripcionProducto, id]
      );

      // registrar auditoria
    const consultaAuditoria = `INSERT INTO auditoria (usuario_id, accion, modulo, descripcion) VALUES (?, ?, ?, ?)`;
    const [auditoria] = await pool.query(consultaAuditoria, [
      usuarioId,
      "Actualizar",
      "Productos",
      `Se actualizó el producto ${id}`,
    ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(200).json({
        message: "Producto actualizado con éxito",
        producto: { id, nombreProducto, precioProducto },
      });
    } catch (error) {
      console.log("error en catch de updateProductos", error);
      return res.status(500).json({
        message: "Error al actualizar el producto",
        error: error.message,
      });
    }
  }
}
