// src/routes/guia.routes.js

import { Router } from 'express';
import { listarGuia } from '../controllers/guia.controller.js';

const router = Router();

router.get('/', listarGuia);

export default router;
