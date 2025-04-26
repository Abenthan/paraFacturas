import { Router } from "express";
import { getFacturasPendientes } from "../controllers/facturacion.controller.js";

const router = Router();

router.get("/prefacturacion", getFacturasPendientes);

export default router;
