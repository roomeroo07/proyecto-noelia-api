// Hacer imports de las consultas del controlador de contactos y de la librería Router de node express
import { Router } from 'express';
import { getContactos, getContactoById, createContacto, updateContacto, deleteContacto, getContactosIncorporados } from '../controllers/contacto.controller';
import { verificarToken } from '../middleware/auth.middleware';
import { getHistorial } from '../controllers/contacto.controller';


// Crear variable router
const router = Router();


// Llamar a nuestra variable router con cada método para realizar nuestra CRUD pasándole por la ruta el id correspondiente
// para que las queries sepan que contacto es
// Añadimos el middleware verificarToken para que solo puedan acceder a estas rutas los usuarios autenticados
router.get('/', verificarToken, getContactos);
router.get('/incorporados', verificarToken, getContactosIncorporados);
router.get('/:id', verificarToken, getContactoById);
router.post('/', verificarToken, createContacto);
router.put('/:id', verificarToken, updateContacto);
router.delete('/:id', verificarToken, deleteContacto);
router.get('/historial/reciente', verificarToken, getHistorial);

export default router;