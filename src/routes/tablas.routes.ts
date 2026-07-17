import { Router } from 'express';
import { getEstados, getSectores, getCentros, getCentrosBySector, getPuestos } from '../controllers/tablas.controller';
import { verificarToken } from '../middleware/auth.middleware';

// Crea el router de Express para los catálogos
// Cada línea asocia una URL con su función del controlador
const router = Router();

router.get('/estados', getEstados);
router.get('/sectores', getSectores);
router.get('/centros', getCentros);
router.get('/centros/:sectorId', getCentrosBySector);
router.get('/puestos', getPuestos);

export default router;