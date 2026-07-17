import { Request, Response } from 'express';
import pool from '../config/conexion-bbdd';

export const getEvaluaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.nombre AS contacto, est.estado AS estado_contacto,
             ce.nombre AS centro, p.descripcion AS puesto
      FROM evaluacion e
      LEFT JOIN contacto c   ON c.id   = e.contacto_id
      LEFT JOIN estado est   ON est.id = c.estado_id
      LEFT JOIN centro ce    ON ce.id  = c.centro_id
      LEFT JOIN puesto p     ON p.id   = c.puesto_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error getEvaluaciones:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
};

export const getEvaluacionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query(`
      SELECT e.*, e.contacto_id, e.centro_id,
             c.nombre AS contacto, est.estado AS estado_contacto,
             ce.nombre AS centro, p.descripcion AS puesto
      FROM evaluacion e
      LEFT JOIN contacto c   ON c.id   = e.contacto_id
      LEFT JOIN estado est   ON est.id = c.estado_id
      LEFT JOIN centro ce    ON ce.id  = e.centro_id
      LEFT JOIN puesto p     ON p.id   = c.puesto_id
      WHERE e.id = ?
    `, [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Evaluación no encontrada' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error getEvaluacionById:', error);
    res.status(500).json({ error: 'Error al obtener la evaluación' });
  }
};

export const createEvaluacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const {
      contacto_id, categoria, fecha_incorporacion,
      fecha_evaluacion_inicio, fecha_evaluacion_3meses,
      estado, realizada_por, fecha_baja
    } = req.body;
    const [result]: any = await pool.query(
      `INSERT INTO evaluacion (
        contacto_id, categoria, fecha_incorporacion,
        fecha_evaluacion_inicio, fecha_evaluacion_3meses,
        estado, realizada_por, fecha_baja
      ) VALUES (?,?,?,?,?,?,?,?)`,
      [
        n(contacto_id), n(categoria), n(fecha_incorporacion),
        n(fecha_evaluacion_inicio), n(fecha_evaluacion_3meses),
        n(estado), n(realizada_por), n(fecha_baja)
      ]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Evaluación creada' });
  } catch (error) {
    console.error('Error createEvaluacion:', error);
    res.status(500).json({ error: 'Error al crear la evaluación' });
  }
};

export const updateEvaluacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const { id } = req.params;
    const {
      contacto_id, categoria, fecha_incorporacion,
      fecha_evaluacion_inicio, fecha_evaluacion_3meses,
      estado, realizada_por, fecha_baja
    } = req.body;
    await pool.query(
      `UPDATE evaluacion SET
        contacto_id=?, categoria=?, fecha_incorporacion=?,
        fecha_evaluacion_inicio=?, fecha_evaluacion_3meses=?,
        estado=?, realizada_por=?, fecha_baja=?
      WHERE id=?`,
      [
        n(contacto_id), n(categoria), n(fecha_incorporacion),
        n(fecha_evaluacion_inicio), n(fecha_evaluacion_3meses),
        n(estado), n(realizada_por), n(fecha_baja), id
      ]
    );
    res.json({ mensaje: 'Evaluación actualizada' });
  } catch (error) {
    console.error('Error updateEvaluacion:', error);
    res.status(500).json({ error: 'Error al actualizar la evaluación' });
  }
};

export const deleteEvaluacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM evaluacion WHERE id = ?', [id]);
    res.json({ mensaje: 'Evaluación eliminada' });
  } catch (error) {
    console.error('Error deleteEvaluacion:', error);
    res.status(500).json({ error: 'Error al eliminar la evaluación' });
  }
};