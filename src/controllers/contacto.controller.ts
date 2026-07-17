import { Request, Response } from 'express';
import pool from '../config/conexion-bbdd';

export const getContactos = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_contacto');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
};

export const getContactoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query('SELECT * FROM v_contacto WHERE id = ?', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Contacto no encontrado' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contacto' });
  }
};

export const getContactosIncorporados = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.nombre 
      FROM contacto c
      JOIN estado e ON e.id = c.estado_id
      WHERE e.estado = 'INCORPORADO/A'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos incorporados' });
  }
};

export const createContacto = async (req: Request, res: Response): Promise<void> => {
  console.log('CREATE CONTACTO llamado', req.body);
  try {
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const {
      nombre, tipo_contacto, fecha_nacimiento, telefono, residencia,
      email, carnet_conducir, fecha_primer_contacto, fecha_entrevista,
      email_entrevista_presencial, email_candidatura_desestimada,
      disponibilidad_horaria, informacion, descripcion_perfil,
      formacion, experiencia, puesto_id, centro_id, estado_id,
      fecha_incorporacion, fecha_baja, motivo_baja, fuente_reclutamiento, referenciado_por
    } = req.body;

    // CORREGIDO: Se agregó un "?" extra al final para sumar exactamente los 24 valores necesarios
    const [result]: any = await pool.query(
      `INSERT INTO contacto (
        nombre, tipo_contacto, fecha_nacimiento, telefono, residencia,
        email, carnet_conducir, fecha_primer_contacto, fecha_entrevista,
        email_entrevista_presencial, email_candidatura_desestimada,
        disponibilidad_horaria, informacion, descripcion_perfil,
        formacion, experiencia, puesto_id, centro_id, estado_id,
        fecha_incorporacion, fecha_baja, motivo_baja, fuente_reclutamiento, referenciado_por
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        n(nombre), n(tipo_contacto), n(fecha_nacimiento), n(telefono), n(residencia),
        n(email), n(carnet_conducir), n(fecha_primer_contacto), n(fecha_entrevista),
        email_entrevista_presencial ?? 0, email_candidatura_desestimada ?? 0,
        n(disponibilidad_horaria), n(informacion), n(descripcion_perfil),
        n(formacion), n(experiencia), n(puesto_id), n(centro_id), n(estado_id),
        n(fecha_incorporacion), n(fecha_baja), n(motivo_baja), n(fuente_reclutamiento), n(referenciado_por)
      ]
    );

    const contactoId = result.insertId;

    if (n(estado_id)) {
      const [estadoRows]: any = await pool.query(
        'SELECT estado FROM estado WHERE id = ?', [estado_id]
      );
      if (estadoRows.length > 0 && estadoRows[0].estado === 'INCORPORADO/A') {
        let categoriaEval = null;
        if (n(puesto_id)) {
          const [puestoRows]: any = await pool.query(
            'SELECT descripcion FROM puesto WHERE id = ?', [puesto_id]
          );
          if (puestoRows.length > 0) categoriaEval = puestoRows[0].descripcion;
        }
        await pool.query(
          `INSERT INTO evaluacion (contacto_id, categoria, fecha_incorporacion, centro_id, estado)
          VALUES (?, ?, ?, ?, 'Espera')`,
          [contactoId, categoriaEval, n(fecha_incorporacion), n(centro_id)]
        );
      }
    }

    res.status(201).json({ id: contactoId, mensaje: 'Contacto creado' });
  } catch (error) {
    console.error('Error createContacto:', error);
    res.status(500).json({ error: 'Error al crear el contacto' });
  }
};

export const updateContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const n = (v: any) => (v === '' || v === undefined) ? null : v;
    const { id } = req.params;
    const {
      nombre, tipo_contacto, fecha_nacimiento, telefono, residencia,
      email, carnet_conducir, fecha_primer_contacto, fecha_entrevista,
      email_entrevista_presencial, email_candidatura_desestimada,
      disponibilidad_horaria, informacion, descripcion_perfil,
      formacion, experiencia, puesto_id, centro_id, estado_id,
      fecha_incorporacion, fecha_baja, motivo_baja, fuente_reclutamiento, referenciado_por
    } = req.body;

    const [anteriorRows]: any = await pool.query(
      'SELECT estado_id FROM contacto WHERE id = ?', [id]
    );
    const estadoAnteriorId = anteriorRows[0]?.estado_id;

    await pool.query(
      `UPDATE contacto SET
        nombre=?, tipo_contacto=?, fecha_nacimiento=?, telefono=?, residencia=?,
        email=?, carnet_conducir=?, fecha_primer_contacto=?, fecha_entrevista=?,
        email_entrevista_presencial=?, email_candidatura_desestimada=?,
        disponibilidad_horaria=?, informacion=?, descripcion_perfil=?,
        formacion=?, experiencia=?, puesto_id=?, centro_id=?, estado_id=?,
        fecha_incorporacion=?, fecha_baja=?, motivo_baja=?, fuente_reclutamiento=?, referenciado_por=?
      WHERE id=?`,
      [
        n(nombre), n(tipo_contacto), n(fecha_nacimiento), n(telefono), n(residencia),
        n(email), n(carnet_conducir), n(fecha_primer_contacto), n(fecha_entrevista),
        email_entrevista_presencial ?? 0, email_candidatura_desestimada ?? 0,
        n(disponibilidad_horaria), n(informacion), n(descripcion_perfil),
        n(formacion), n(experiencia), n(puesto_id), n(centro_id), n(estado_id),
        n(fecha_incorporacion), n(fecha_baja), n(motivo_baja), n(fuente_reclutamiento), n(referenciado_por),
        id
      ]
    );

    if (n(estado_id) && n(estado_id) != estadoAnteriorId) {
      const [estadoRows]: any = await pool.query(
        'SELECT estado FROM estado WHERE id = ?', [estado_id]
      );
      if (estadoRows.length > 0 && estadoRows[0].estado === 'INCORPORADO/A') {
        const [evalExiste]: any = await pool.query(
          'SELECT id FROM evaluacion WHERE contacto_id = ?', [id]
        );
        if (evalExiste.length === 0) {
          let categoriaEval = null;
          if (n(puesto_id)) {
            const [puestoRows]: any = await pool.query(
              'SELECT descripcion FROM puesto WHERE id = ?', [puesto_id]
            );
            if (puestoRows.length > 0) categoriaEval = puestoRows[0].descripcion;
          }
          await pool.query(
            `INSERT INTO evaluacion (contacto_id, categoria, fecha_incorporacion, centro_id, estado)
            VALUES (?, ?, ?, ?, 'Espera')`,
            [id, categoriaEval, n(fecha_incorporacion), n(centro_id)]
          );
        }
      }
    }
    
    // Sincronizar centro_id, fecha_incorporacion y fecha_baja con la evaluación asociada
    await pool.query(
      `UPDATE evaluacion 
      SET centro_id = ?, fecha_incorporacion = ?, fecha_baja = ?
      WHERE contacto_id = ?`,
      [n(centro_id), n(fecha_incorporacion), n(fecha_baja), id]
    );
    res.status(200).json({ mensaje: 'Contacto actualizado' });
  } catch (error) {
    console.error('Error updateContacto:', error);
    res.status(500).json({ error: 'Error al actualizar el contacto' });
  }
};

export const deleteContacto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Primero eliminar las evaluaciones asociadas al contacto
    await pool.query('DELETE FROM evaluacion WHERE contacto_id = ?', [id]);
    // Luego eliminar el contacto
    await pool.query('DELETE FROM contacto WHERE id = ?', [id]);
    res.json({ mensaje: 'Contacto eliminado' });
  } catch (error) {
    console.error('Error deleteContacto:', error);
    res.status(500).json({ error: 'Error al eliminar el contacto' });
  }
};