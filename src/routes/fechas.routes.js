// src/routes/fechas.routes.js

import { Router } from 'express';
import { listarFechas } from '../controllers/fechas.controller.js';

const router = Router();

router.get('/', listarFechas);

export default router;
