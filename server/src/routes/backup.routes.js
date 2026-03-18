import { Router } from "express";
import { generarBackup } from "../controllers/backup.controller.js";
import { authRequired, requireAdmin } from "../middlewares/validateToken.js";

const router = Router();

router.get("/backup", authRequired, requireAdmin, generarBackup);

export default router;
