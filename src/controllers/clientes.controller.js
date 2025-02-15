import { pool } from "../db.js";
import { createAccessToken } from "../libs/jwt.js";

export const getClientes = async (req, res) => {
    res.json("Get Clientes");
};

export const createCliente = async (req, res) => {
    const { codigo, cedula, nombreCliente, emailCliente, telefono, direccion } = req.body;
    try {
        // Verificar si la cedula ya existe
        const verifyCedula = await pool.query("SELECT * FROM clientes WHERE cedula = ?", [cedula]);
        if (verifyCedula[0].length > 0) {
            return res.status(400).json({ message: "Ya existe un cliente con esa cedula" });
        } else {
            // Verificar si el codigo ya existe
            const verifyCodigo = await pool.query("SELECT * FROM clientes WHERE codigo = ?", [codigo]);
            if (verifyCodigo[0].length > 0) {
                return res.status(400).json({ message: "Ya existe un cliente con ese código" });
            } else {
                // Guardar cliente en la base de datos
                const result = await pool.query("INSERT INTO clientes (codigo, cedula, nombreCliente, emailCliente, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)", [codigo, cedula, nombreCliente, emailCliente, telefono, direccion]);
                // Crear el token
                const token = await createAccessToken({ id: result.insertId });
                // Responder al frontend
                res.cookie("token", token);
                res.json({
                    message: "Cliente creado",
                    idCliente: result.insertId,
                    codigo,
                    cedula,
                    nombreCliente,
                    emailCliente,
                    telefono,
                    direccion
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

};

