import { Router } from 'express';
import { getCases, createCase, updateCase, deleteCase } from '../controllers/casesController';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { caseSchema } from '../schemas';
import { auditMiddleware } from '../middleware/auditMiddleware';

const router = Router();

// All routes here are protected and require 'supervisor' role
router.use(requireAuth);
router.use(requireRole('supervisor'));

router.get('/', getCases);
router.post('/', validate(caseSchema), auditMiddleware('CREATE_CASE'), createCase);
router.put('/:id', validate(caseSchema), auditMiddleware('UPDATE_CASE'), updateCase);
router.delete('/:id', auditMiddleware('DELETE_CASE'), deleteCase);

export default router;
