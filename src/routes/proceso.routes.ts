import { Router } from 'express';
import { getProcesos, getProcesoById, createProceso, updateProceso, deleteProceso } from '../controllers/proceso.controller';
import { verificarToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', verificarToken, getProcesos);
router.get('/:id', verificarToken, getProcesoById);
router.post('/', verificarToken, createProceso);
router.put('/:id', verificarToken, updateProceso);
router.delete('/:id', verificarToken, deleteProceso);

export default router;