import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/conexion-bbdd';

// Comprueba las credenciales y devuelve un token JWT
// Angular guardará este token y lo mandará en cada petición protegida
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, contrasena } = req.body;

    // Busca el usuario en la base de datos
    const [rows]: any = await pool.query('SELECT * FROM usuario WHERE nombre = ?', [nombre]);
    if (rows.length === 0) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      return;
    }

    const usuario = rows[0];

    // Compara la contraseña introducida con el hash guardado en la BD
    const valida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valida) {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      return;
    }

    // Genera el token JWT con los datos del usuario
    // El token expira en 10 horas
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, tipo: usuario.tipo },
      process.env.JWT_SECRET as string,
      { expiresIn: '10h' }
    );

    res.json({ token, nombre: usuario.nombre, tipo: usuario.tipo });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(401).json({ error: 'Token requerido' });
      return;
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const nuevoToken = jwt.sign(
      { id: decoded.id, nombre: decoded.nombre, tipo: decoded.tipo },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );
    res.json({ token: nuevoToken });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};