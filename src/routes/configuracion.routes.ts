import { Router } from 'express';
import {
  getCentros, createCentro, updateCentro, deleteCentro,
  getPuestos, createPuesto, updatePuesto, deletePuesto
} from '../controllers/configuracion.controller';
import { verificarToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/centros',        verificarToken, getCentros);
router.post('/centros',       verificarToken, createCentro);
router.put('/centros/:id',    verificarToken, updateCentro);
router.delete('/centros/:id', verificarToken, deleteCentro);

router.get('/puestos',        verificarToken, getPuestos);
router.post('/puestos',       verificarToken, createPuesto);
router.put('/puestos/:id',    verificarToken, updatePuesto);
router.delete('/puestos/:id', verificarToken, deletePuesto);

export default router;