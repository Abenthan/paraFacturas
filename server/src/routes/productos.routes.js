import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProductos, createProducto, getProducto, updateProducto } from "../controllers/productos.controller.js";

const router = Router();

router.get("/productos", authRequired, getProductos);
router.post("/crearProducto", authRequired, createProducto);
router.get("/producto/:id", authRequired, getProducto);
router.put("/producto/:id", authRequired, updateProducto);


export default router;


