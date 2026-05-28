import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, logout } from '../controllers/authController';

const router = Router();

// ✅ Rate limiter específico para login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por IP en ese período
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true, // Devuelve info de rate limit en headers `RateLimit-*`
  legacyHeaders: false,  // Desactiva headers `X-RateLimit-*` (obsoletos)
});

router.post('/login', authLimiter, login);  // ✅ Protegido
router.post('/register', register);
router.post('/logout', logout);

export default router;
