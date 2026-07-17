import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/login: inicia sesión y devuelve el token JWT
router.post('/login', login);

export default router;