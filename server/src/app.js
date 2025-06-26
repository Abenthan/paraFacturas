import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import suscripcionesRoutes from "./routes/suscripciones.routes.js";
import novedadesRoutes from "./routes/novedades.routes.js";
import facturacionRoutes from "./routes/facturacion.routes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://parafacturasclient.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin (como Postman o curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("No permitido por CORS: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", clientesRoutes);
app.use("/api", productosRoutes);
app.use("/api", suscripcionesRoutes);
app.use("/api", novedadesRoutes);
app.use("/api", facturacionRoutes);

export default app;
