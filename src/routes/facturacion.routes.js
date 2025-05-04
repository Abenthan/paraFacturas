import { Router } from "express";
import {
  getFacturasPendientes,
  crearFacturas,
  getFacturas,
  getFactura,
  registrarPago,
  getPagos,
  getPago
} from "../controllers/facturacion.controller.js";

const router = Router();

router.get("/prefacturacion", getFacturasPendientes);

router.post("/facturas", crearFacturas);

router.get("/facturas", getFacturas);

router.get("/factura/:id", getFactura);

router.post("/pagarFactura", registrarPago);

router.get("/pagos", getPagos);

router.get("/pago/:id", getPago);

export default router;
