import { Router } from 'express';
import { login, register, logout, me } from '../controllers/authController';
import { requireAuth, requireRole } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authLimiter, login);  // ✅ Protegido
router.post('/register', requireAuth, requireRole('supervisor'), authLimiter, register); // ✅ Protegido solo para supervisores
router.post('/logout', logout);
router.get('/me', requireAuth, me); // ✅ Endpoint para validar sesión

export default router;
