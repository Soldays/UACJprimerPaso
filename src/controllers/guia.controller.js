// src/controllers/guia.controller.js

import { pool } from '../config/db.js';

// GET /api/guia
export async function listarGuia(req, res) {

    try {

        const [filas] = await pool.query(`
            SELECT id, paso, titulo, descripcion, video_url, requisitos_json
            FROM guia_videos
            ORDER BY orden ASC
        `);

        const pasos = filas.map(fila => ({
            id: fila.id,
            paso: fila.paso,
            titulo: fila.titulo,
            descripcion: fila.descripcion,
            video_url: fila.video_url,
            requisitos: fila.requisitos_json ? JSON.parse(fila.requisitos_json) : []
        }));

        res.json(pasos);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Error al consultar la guía de ingreso.' });

    }

}
