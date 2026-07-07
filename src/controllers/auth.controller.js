// src/controllers/auth.controller.js
//
// Aquí vive la lógica de la Etapa 2: el alumno NO se registra,
// solo se valida que ya exista en la tabla `usuario` (el padrón).

import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

// POST /api/auth/login
// Recibe { matricula, contrasena } y verifica contra la base de datos.
export async function login(req, res) {

    try {

        const { matricula, contrasena } = req.body;

        if (!matricula || !contrasena) {

            return res.status(400).json({ error: 'Faltan la matrícula o la contraseña.' });

        }

        const [filas] = await pool.query(
            'SELECT id, nombre, matricula, contrasena_hash, numero_creditos FROM usuario WHERE matricula = ?',
            [matricula]
        );

        // Si no hay ningún usuario con esa matrícula, no existe en el padrón.
        if (filas.length === 0) {

            return res.status(401).json({ error: 'Matrícula no encontrada. Verifica tu número o contacta a servicios escolares.' });

        }

        const usuario = filas[0];

        // TEMPORAL (debug): compara en texto plano, SIN bcrypt.
        // TODO: quitar esta línea y volver a `await bcrypt.compare(contrasena, usuario.contrasena_hash)`
        // cuando termines de depurar. Mientras esto esté activo, `contrasena_hash` debe
        // contener la contraseña tal cual (ej. "123"), NO un hash bcrypt.
        const coincide = (contrasena === usuario.contrasena_hash);

        if (!coincide) {

            return res.status(401).json({ error: 'Contraseña incorrecta.' });

        }

        // Guarda en la sesión quién inició sesión (el servidor lo va a recordar
        // mientras el navegador tenga la cookie de sesión).
        req.session.usuarioId = usuario.id;

        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            matricula: usuario.matricula,
            numero_creditos: usuario.numero_creditos
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión.' });

    }

}

// POST /api/auth/logout
export function logout(req, res) {

    req.session.destroy(() => {

        res.json({ mensaje: 'Sesión cerrada.' });

    });

}

// GET /api/auth/me
// Le dice al frontend "¿hay alguien con sesión activa ahorita?"
export async function quienSoy(req, res) {

    if (!req.session.usuarioId) {

        return res.status(401).json({ error: 'No hay sesión activa.' });

    }

    try {

        const [filas] = await pool.query(
            'SELECT id, nombre, matricula, numero_creditos FROM usuario WHERE id = ?',
            [req.session.usuarioId]
        );

        if (filas.length === 0) {

            return res.status(401).json({ error: 'No hay sesión activa.' });

        }

        res.json(filas[0]);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Error al consultar la sesión.' });

    }

}
