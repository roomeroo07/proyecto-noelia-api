import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importa la conexión a la base de datos para que se establezca al arrancar
import './config/conexion-bbdd';

// Importa las rutas de cada módulo
import contactoRoutes from './routes/contacto.routes'
import tablasRoutes from './routes/tablas.routes';
import authRoutes from './routes/auth.routes';
import evaluacionRoutes from './routes/evaluacion.routes';
import procesoRoutes from './routes/proceso.routes';
import configuracionRoutes from './routes/configuracion.routes';

// Carga las variables del archivo .env
dotenv.config();

// Crea la aplicación Express
const app: Application = express();
 
// Permite que Angular, en el puerto 4200, pueda hacer peticiones a esta API
// Sin esto el navegador bloquearía las peticiones
app.use(cors({
  origin: 'http://localhost:4200'
}));
// Permite que la API entienda JSON en el cuerpo de las peticiones (POST, PUT)
app.use(express.json());
// Ruta raíz para comprobar que el servidor está vivo
app.get('/', (req: Request, res: Response) => {
  res.json({ mensaje: 'API Proyecto-Noelia está funcionando' });
});

// Registra las rutas con su prefijo de URL:
// /api/contactos: todo lo relacionado con los contactos
// /api/tablas: listas de estados, centros, puestos, sectores
app.use('/api/contactos', contactoRoutes)
app.use('/api/tablas', tablasRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/evaluaciones', evaluacionRoutes)
app.use('/api/procesos', procesoRoutes)
app.use('/api/configuracion', configuracionRoutes);

// Arranca el servidor en el puerto definido en .env (por defecto 3000)
const PORT = process.env.PORT || 3520;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exportamos variable app
export default app;