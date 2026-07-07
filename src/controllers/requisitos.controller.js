// src/controllers/requisitos.controller.js

import { pool } from '../config/db.js';

// GET /api/requisitos
export async function listarRequisitos(req, res) {

    try {

        const [filas] = await pool.query(`
            SELECT id, nombre, info, obligatorio
            FROM requisitos
            ORDER BY id ASC
        `);

        res.json(filas);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Error al consultar requisitos.' });

    }

}
