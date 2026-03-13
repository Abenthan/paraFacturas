import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No hay token, Autorizacion denegada." });
  }
  jwt.verify(token, TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({ message: "Token no válido" });
    }
    req.user = user;
    next();
  });
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol administrador." });
  }
  next();
};
