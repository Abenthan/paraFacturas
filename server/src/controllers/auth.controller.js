import { pool } from "../db.js";
import bcript from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const home = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE idUsuario = ?", [id]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json(["Ya existe el email"]);
    } else {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE username = ?",
        [username]
      );
      if (rows.length > 0) {
        return res.status(400).json(["Ya existe el username"]);
      } else {
        // Encriptar la contraseña
        const passwordHash = await bcript.hash(password, 10);

        //guardar usuario en la base de datos
        const result = await pool.query(
          "INSERT INTO usuarios (fullname, username, email, password) VALUES (?, ?, ?, ?)",
          [fullname, username, email, passwordHash]
        );

        // Crear el token
        const token = await createAccessToken({ id: result.insertId });
        // responder al frontend
        res.cookie("token", token);
        res.json({
          message: "Usuario creado",
          id: result.insertId,
          username,
          fullname,
          email
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Buscar el usuario en la base de datos
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [username]
    );

    // Si el usuario existe
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await bcript.compare(password, user.password);
      if (validPassword) {
        // Crear el token
        const token = await createAccessToken({ id: user.idUsuario });
        // responder al frontend
        res.cookie("token", token);
        res.json({
          message: "Usuario logueado.",
          id: user.idUsuario,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
        });
      } else {
        res.status(400).json(["Contraseña incorrecta"]);
      }
    } else {
      res.status(400).json(["Usuario no encontrado"]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Usuario deslogueado" });
};

export const verifyToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "¡Desautorizado!, No hay token " });
  }
  
  jwt.verify(token, TOKEN_SECRET, async(err, user) => {
    if (err) {
      return res.status(401).json({ message: "¡Desautorizado!, Token inválido" });
    }

    try {
      const [rows] = await pool.query("SELECT * FROM usuarios WHERE idUsuario = ?", [user.id]);
      if (rows.length === 0) {
        return res.status(401).json({ message: "¡Desautorizado!, Usuario no encontrado" });
      } else {
        console.log({message: "usuario autoriazado!"});
        return res.json({
          id: rows[0].idUsuario,
          username: rows[0].username,
          fullname: rows[0].fullname,
          email: rows[0].email
        });
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
      
    }
  });
 };

   