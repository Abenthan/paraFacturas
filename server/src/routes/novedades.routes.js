import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    getNovedades,
    getNovedadesSuscripcion,
} from "../controllers/novedades.controller.js";

const router = Router();
// Rutas de novedades

router.get("/suscripciones/novedades/:idSuscripcion", authRequired, getNovedadesSuscripcion);
router.get("/novedades", authRequired, getNovedades);

export default router;