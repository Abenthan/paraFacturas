import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';
import suscripcionesRoutes from './routes/suscripciones.routes.js';
import facturacionRoutes from './routes/facturacion.routes.js';


const app = express();

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
)); 
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", clientesRoutes);
app.use("/api", productosRoutes);
app.use("/api", suscripcionesRoutes);
app.use("/api", facturacionRoutes);

export default app;