import { Router } from "express";
import {
  getFacturasPendientes,
  crearFacturas,
  getFacturas,
  getFactura,
} from "../controllers/facturacion.controller.js";

const router = Router();

router.get("/prefacturacion", getFacturasPendientes);

router.post("/facturas", crearFacturas);

router.get("/facturas", getFacturas);

router.get("/factura/:id", getFactura);

export default router;
