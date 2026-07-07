// src/middlewares/requireAuth.js
//
// Se pone antes de cualquier endpoint que solo deba verse
// con sesión activa (ej. las materias/horario de la Etapa 2).

export function requireAuth(req, res, next) {

    if (!req.session.usuarioId) {

        return res.status(401).json({ error: 'Necesitas iniciar sesión para ver esto.' });

    }

    next();

}
