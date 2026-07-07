// src/routes/auth.routes.js

import { Router } from 'express';
import { login, logout, quienSoy } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', quienSoy);

export default router;
