// CONTROLADOR DE TABLAS
// Estos endpoints devuelven las listas fijas de la base de datos
// que Angular usará para rellenar los desplegables del formulario:
// estados, sectores, centros y puestos

import { Request, Response } from 'express';
import pool from '../config/conexion-bbdd';

// Devuelve todos los estados posibles de un candidato
export const getEstados = async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query('SELECT * FROM estado');
  res.json(rows);
};

// Devuelve todos los sectores de la empresa
export const getSectores = async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query('SELECT * FROM sector');
  res.json(rows);
};

// Devuelve todos los centros con su sector incluido usando JOIN
export const getCentros = async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query(`
    SELECT c.id, c.nombre, s.nombre AS sector
    FROM centro c
    JOIN sector s ON s.id = c.sector_id
  `);
  res.json(rows);
};

// Devuelve solo los centros de un sector concreto
// para filtrar el desplegable de centros según el sector elegido
export const getCentrosBySector = async (req: Request, res: Response): Promise<void> => {
  const { sectorId } = req.params;
  const [rows] = await pool.query(`
    SELECT c.id, c.nombre, s.nombre AS sector
    FROM centro c
    JOIN sector s ON s.id = c.sector_id
    WHERE c.sector_id = ?
  `, [sectorId]);
  res.json(rows);
};

// Devuelve todos los puestos de trabajo disponibles
export const getPuestos = async (req: Request, res: Response): Promise<void> => {
  const [rows] = await pool.query('SELECT * FROM puesto');
  res.json(rows);
};