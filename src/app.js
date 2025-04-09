import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routes.js';


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

export default app;