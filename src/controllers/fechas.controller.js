// src/controllers/fechas.controller.js

import { pool } from '../config/db.js';

// GET /api/fechas
// GET /api/fechas?categoria=registro
export async function listarFechas(req, res) {

    try {

        const { categoria } = req.query;

        let query = `
            SELECT
                id,
                DAY(fecha_inicio) AS dia,
                DATE_FORMAT(fecha_inicio, '%b') AS mes,
                categoria,
                titulo,
                descripcion
            FROM fechas_clave
        `;

        const params = [];

        if (categoria) {

            query += ' WHERE categoria = ?';
            params.push(categoria);

        }

        query += ' ORDER BY fecha_inicio ASC';

        const [filas] = await pool.query(query, params);

        res.json(filas);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Error al consultar fechas clave.' });

    }

}
