// src/controllers/materias.controller.js

import { pool } from '../config/db.js';

// GET /api/materias/tips
export async function listarMateriasTips(req, res) {

    try {

        const [filas] = await pool.query(`
            SELECT id, tipo, titulo, descripcion, video_url, duracion
            FROM materias_tips
            ORDER BY orden ASC
        `);

        res.json(filas);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Error al consultar los tips de materias.' });

    }

}
