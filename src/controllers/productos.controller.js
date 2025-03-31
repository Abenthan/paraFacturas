import { pool } from "../db.js";
export const createProducto = async (req, res) => {
    const { nombreProducto, precioProducto } = req.body;

    // Validar que los campos no estén vacíos
    if (!nombreProducto || !precioProducto) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    } else {
        // guardar producto en base de datos
        try {
            const result = await pool.query("INSERT INTO productos (nombreProducto, precioProducto) VALUES (?, ?)", [nombreProducto, precioProducto]);
            return res.status(201).json({ message: "Producto creado con éxito", producto: { id: result.insertId, nombreProducto, precioProducto } });
                
            
        } catch (error) {
            console.log("error en catch de createProducto", error);
            return res.status(500).json({ message: error.message });
       
        }
    }
};
