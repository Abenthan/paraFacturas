import { Router } from "express";
import { getProductos, createProducto } from "../controllers/productos.controller.js";

const router = Router();

router.get("/productos", getProductos);
router.post("/crearProducto", createProducto);


export default router;


