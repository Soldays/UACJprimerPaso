// src/app.js

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import fechasRoutes from './routes/fechas.routes.js';
import guiaRoutes from './routes/guia.routes.js';
import requisitosRoutes from './routes/requisitos.routes.js';
import authRoutes from './routes/auth.routes.js';
import materiasRoutes from './routes/materias.routes.js';
import horariosRoutes from './routes/horarios.routes.js';
import salonesRoutes from './routes/salones.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(cors({
    origin: true,
    credentials: true // necesario para que la cookie de sesión viaje al frontend
}));
app.use(express.json());

// Sesiones: guardan quién inició sesión usando una cookie en el navegador.
app.use(session({
    secret: process.env.SESSION_SECRET || 'uacj-portal-clave-secreta-cambiar-en-produccion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 8, // la sesión dura 8 horas
        httpOnly: true
    }
}));

// Sirve el frontend (carpeta public) desde el mismo servidor.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoints de la API (Etapa 1 - públicos)
app.use('/api/fechas', fechasRoutes);
app.use('/api/guia', guiaRoutes);
app.use('/api/requisitos', requisitosRoutes);

// Endpoints de autenticación (Etapa 2)
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/salones', salonesRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Si nada de lo anterior respondió, la ruta no existe.
// Para la API regresamos JSON, para el resto la página 404.
app.use((req, res) => {

    if (req.path.startsWith('/api/')) {

        return res.status(404).json({ error: 'Ruta no encontrada.' });

    }

    res.status(404).sendFile(path.join(__dirname, '..', 'public', '404.html'));

});
