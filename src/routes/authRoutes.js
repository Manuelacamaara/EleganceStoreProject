import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// NOVO: Rota que o usuário acessa ao clicar no e-mail
router.get('/verify/:token', verifyEmail);

export default router;