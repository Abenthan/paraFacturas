import {Router} from 'express';
import { home, login, register, logout, verifyToken } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

router.get('/', authRequired, home);
router.post('/register',validateSchema(registerSchema) , register);
router.post('/login',validateSchema(loginSchema), login);
router.post('/logout', logout);
router.get('/verify', verifyToken);


export default router;
