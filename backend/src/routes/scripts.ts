import { Router } from 'express';
import { searchScripts } from '../controllers/scriptsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All routes here are protected and require 'ejecutivo' role
router.use(requireAuth);
router.use(requireRole('ejecutivo'));

router.get('/search', searchScripts);

export default router;
