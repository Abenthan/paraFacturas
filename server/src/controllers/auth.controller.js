import { pool } from "../db.js";
import bcript from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

const COLUMNAS_USUARIO = "idUsuario, fullname, username, email, rol";

export const home = async (req, res) => {
  const { id } = req.user;
  try {
    const [rows] = await pool.query(
      `SELECT ${COLUMNAS_USUARIO} FROM usuarios WHERE idUsuario = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// #4 — Listar todos los usuarios (solo admin)
export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ${COLUMNAS_USUARIO} FROM usuarios ORDER BY idUsuario ASC`
    );
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// #3 — Registro sin auto-login + #8 SELECT específico + #9 rol
export const register = async (req, res) => {
  const { fullname, username, email, password, rol = "operador" } = req.body;
  try {
    const [byEmail] = await pool.query(
      "SELECT idUsuario FROM usuarios WHERE email = ?",
      [email]
    );
    if (byEmail.length > 0) {
      return res.status(400).json(["Ya existe el email"]);
    }

    const [byUsername] = await pool.query(
      "SELECT idUsuario FROM usuarios WHERE username = ?",
      [username]
    );
    if (byUsername.length > 0) {
      return res.status(400).json(["Ya existe el username"]);
    }

    const passwordHash = await bcript.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (fullname, username, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [fullname, username, email, passwordHash, rol]
    );

    // #3 — No se inicia sesión automáticamente
    res.json({
      message: "Usuario creado exitosamente",
      id: result.insertId,
      username,
      fullname,
      email,
      rol,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      `SELECT ${COLUMNAS_USUARIO}, password FROM usuarios WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json(["Usuario no encontrado"]);
    }

    const user = rows[0];
    const validPassword = await bcript.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json(["Contraseña incorrecta"]);
    }

    // #9 — Incluir rol en el token
    const token = await createAccessToken({ id: user.idUsuario, rol: user.rol });
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    res.json({
      message: "Usuario logueado.",
      id: user.idUsuario,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      rol: user.rol,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Usuario deslogueado" });
};

// #5 — Eliminar usuario (solo admin)
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    return res.status(400).json({ message: "No puedes eliminar tu propio usuario." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT idUsuario FROM usuarios WHERE idUsuario = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await pool.query("DELETE FROM usuarios WHERE idUsuario = ?", [id]);
    res.json({ message: "Usuario eliminado." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// #6 — Cambiar contraseña
export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { passwordActual, passwordNueva } = req.body;

  if (!passwordActual || !passwordNueva) {
    return res.status(400).json({ message: "Debe enviar la contraseña actual y la nueva." });
  }
  if (passwordNueva.length < 8) {
    return res.status(400).json({ message: "La nueva contraseña debe tener al menos 8 caracteres." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT idUsuario, password FROM usuarios WHERE idUsuario = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const valid = await bcript.compare(passwordActual, rows[0].password);
    if (!valid) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta." });
    }

    const nuevoHash = await bcript.hash(passwordNueva, 10);
    await pool.query("UPDATE usuarios SET password = ? WHERE idUsuario = ?", [nuevoHash, id]);
    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "¡Desautorizado!, No hay token" });
  }

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "¡Desautorizado!, Token inválido" });
    }

    try {
      const [rows] = await pool.query(
        `SELECT ${COLUMNAS_USUARIO} FROM usuarios WHERE idUsuario = ?`,
        [decoded.id]
      );
      if (rows.length === 0) {
        return res.status(401).json({ message: "¡Desautorizado!, Usuario no encontrado" });
      }
      return res.json({
        id: rows[0].idUsuario,
        username: rows[0].username,
        fullname: rows[0].fullname,
        email: rows[0].email,
        rol: rows[0].rol,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};
