import { Router } from 'express';
import { getEvaluaciones, getEvaluacionById, createEvaluacion, updateEvaluacion, deleteEvaluacion } from '../controllers/evaluacion.controller';
import { verificarToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', verificarToken, getEvaluaciones);
router.get('/:id', verificarToken, getEvaluacionById);
router.post('/', verificarToken, createEvaluacion);
router.put('/:id', verificarToken, updateEvaluacion);
router.delete('/:id', verificarToken, deleteEvaluacion);

export default router;