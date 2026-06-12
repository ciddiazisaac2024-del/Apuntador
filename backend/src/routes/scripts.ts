import { Router } from 'express';
import { searchScripts } from '../controllers/scriptsController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { searchScriptsSchema } from '../schemas';

const router = Router();

// All routes here are protected and require 'ejecutivo' role
router.use(requireAuth);
router.use(requireRole('ejecutivo'));

router.get('/search', validate(searchScriptsSchema), searchScripts);

export default router;
