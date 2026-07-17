import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extiende la interfaz Request de Express para añadir el campo usuario
// Así TypeScript sabe que req.usuario existe después de pasar por este middleware
export interface RequestConUsuario extends Request {
  usuario?: any;
}

// Middleware de autenticación
// Se ejecuta ANTES del controlador en los endpoints protegidos
// Si el token no es válido, corta la petición y devuelve 401
// Si es válido, deja pasar y añade los datos del usuario a req.usuario
export const verificarToken = (
  req: RequestConUsuario,
  res: Response,
  next: NextFunction
): void => {
  // El token viene en la cabecera Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Acceso denegado, token requerido' });
    return;
  }

  try {
    // Verifica que el token es válido y no ha expirado
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.usuario = decoded;
    next(); // Token válido, continúa al controlador
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};