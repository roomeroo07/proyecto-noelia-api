import { Router } from 'express';
import { login, refresh } from '../controllers/auth.controller';


const router = Router();

// POST /api/auth/login: inicia sesión y devuelve el token JWT
router.post('/login', login);
router.post('/refresh', refresh);

export default router;