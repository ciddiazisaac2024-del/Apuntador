import { Router } from 'express';
import { login, register, logout } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register); // Optional, useful for setup
router.post('/logout', logout);

export default router;
