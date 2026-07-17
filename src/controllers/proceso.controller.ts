import { Request, Response } from 'express';
import pool from '../config/conexion-bbdd';

export const getProcesos = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT pa.id, pa.prioridad, pa.comentario,
             p.descripcion AS puesto,
             c.nombre      AS centro,
             s.nombre      AS sector
      FROM proceso_activo pa
      LEFT JOIN puesto p  ON p.id  = pa.puesto_id
      LEFT JOIN centro c  ON c.id  = pa.centro_id
      LEFT JOIN sector s  ON s.id  = c.sector_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error getProcesos:', error);
    res.status(500).json({ error: 'Error al obtener procesos' });
  }
};

export const getProcesoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query(`
      SELECT pa.id, pa.puesto_id, pa.centro_id, pa.prioridad, pa.comentario,
             p.descripcion AS puesto,
             c.nombre      AS centro,
             s.nombre      AS sector
      FROM proceso_activo pa
      LEFT JOIN puesto p  ON p.id  = pa.puesto_id
      LEFT JOIN centro c  ON c.id  = pa.centro_id
      LEFT JOIN sector s  ON s.id  = c.sector_id
      WHERE pa.id = ?
    `, [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Proceso no encontrado' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getProcesoById:', error);
    res.status(500).json({ error: 'Error al obtener el proceso' });
  }
};

export const createProceso = async (req: Request, res: Response): Promise<void> => {
  try {
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const { puesto_id, centro_id, prioridad, comentario } = req.body;
    const [result]: any = await pool.query(
      'INSERT INTO proceso_activo (puesto_id, centro_id, prioridad, comentario) VALUES (?,?,?,?)',
      [n(puesto_id), n(centro_id), n(prioridad), n(comentario)]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Proceso creado' });
  } catch (error) {
    console.error('Error createProceso:', error);
    res.status(500).json({ error: 'Error al crear el proceso' });
  }
};

export const updateProceso = async (req: Request, res: Response): Promise<void> => {
  try {
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const { id } = req.params;
    const { puesto_id, centro_id, prioridad, comentario } = req.body;
    await pool.query(
      'UPDATE proceso_activo SET puesto_id=?, centro_id=?, prioridad=?, comentario=? WHERE id=?',
      [n(puesto_id), n(centro_id), n(prioridad), n(comentario), id]
    );
    res.json({ mensaje: 'Proceso actualizado' });
  } catch (error) {
    console.error('Error updateProceso:', error);
    res.status(500).json({ error: 'Error al actualizar el proceso' });
  }
};

export const deleteProceso = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM proceso_activo WHERE id = ?', [id]);
    res.json({ mensaje: 'Proceso eliminado' });
  } catch (error) {
    console.error('Error deleteProceso:', error);
    res.status(500).json({ error: 'Error al eliminar el proceso' });
  }
};