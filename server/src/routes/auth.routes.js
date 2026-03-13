import { Router } from "express";
import {
  home,
  login,
  register,
  logout,
  verifyToken,
  getUsuarios,
  deleteUsuario,
  changePassword,
} from "../controllers/auth.controller.js";
import { authRequired, requireAdmin } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.get("/", authRequired, home);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verifyToken);

// Gestión de usuarios — requiere autenticación
router.post("/register", authRequired, requireAdmin, validateSchema(registerSchema), register);
router.get("/usuarios", authRequired, requireAdmin, getUsuarios);
router.delete("/usuario/:id", authRequired, requireAdmin, deleteUsuario);
router.put("/usuario/:id/password", authRequired, changePassword);

export default router;
