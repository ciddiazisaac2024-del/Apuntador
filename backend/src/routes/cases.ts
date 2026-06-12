import { Router } from 'express';
import { getCases, createCase, updateCase, deleteCase } from '../controllers/casesController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { caseSchema } from '../schemas';

const router = Router();

// All routes here are protected and require 'supervisor' role
router.use(requireAuth);
router.use(requireRole('supervisor'));

router.get('/', getCases);
router.post('/', validate(caseSchema), createCase);
router.put('/:id', validate(caseSchema), updateCase);
router.delete('/:id', deleteCase);

export default router;
