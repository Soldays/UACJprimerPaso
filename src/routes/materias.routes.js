// src/routes/materias.routes.js

import { Router } from 'express';
import { listarMateriasTips } from '../controllers/materias.controller.js';

const router = Router();

router.get('/tips', listarMateriasTips);

export default router;
