import { Request, Response } from 'express';
import pool from '../config/conexion-bbdd';

// ---- CENTROS ----
export const getCentros = async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query(`
    SELECT c.id, c.nombre, s.nombre AS sector, c.sector_id
    FROM centro c LEFT JOIN sector s ON s.id = c.sector_id
    ORDER BY c.nombre
  `);
  res.json(rows);
};

export const createCentro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, sector_id } = req.body;
    const [result]: any = await pool.query(
      'INSERT INTO centro (nombre, sector_id) VALUES (?, ?)', [nombre, sector_id]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Centro creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el centro' });
  }
};

export const updateCentro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, sector_id } = req.body;
    await pool.query(
      'UPDATE centro SET nombre=?, sector_id=? WHERE id=?', [nombre, sector_id, id]
    );
    res.json({ mensaje: 'Centro actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el centro' });
  }
};

export const deleteCentro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM centro WHERE id=?', [id]);
    res.json({ mensaje: 'Centro eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el centro' });
  }
};

// ---- PUESTOS ----
export const getPuestos = async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query('SELECT * FROM puesto ORDER BY descripcion');
  res.json(rows);
};

export const createPuesto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { descripcion } = req.body;
    const [result]: any = await pool.query(
      'INSERT INTO puesto (descripcion) VALUES (?)', [descripcion]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Puesto creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el puesto' });
  }
};

export const updatePuesto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    await pool.query('UPDATE puesto SET descripcion=? WHERE id=?', [descripcion, id]);
    res.json({ mensaje: 'Puesto actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el puesto' });
  }
};

export const deletePuesto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM puesto WHERE id=?', [id]);
    res.json({ mensaje: 'Puesto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el puesto' });
  }
};