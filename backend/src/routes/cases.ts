import { Router } from 'express';
import { getCases, createCase, updateCase, deleteCase } from '../controllers/casesController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// All routes here are protected and require 'supervisor' role
router.use(requireAuth);
router.use(requireRole('supervisor'));

router.get('/', getCases);
router.post('/', createCase);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

export default router;
