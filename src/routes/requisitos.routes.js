// src/routes/requisitos.routes.js

import { Router } from 'express';
import { listarRequisitos } from '../controllers/requisitos.controller.js';

const router = Router();

router.get('/', listarRequisitos);

export default router;
