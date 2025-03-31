import { Router } from "express";
import { createProducto } from "../controllers/productos.controller.js";

const router = Router();

router.post("/crearProducto", createProducto);

export default router;


