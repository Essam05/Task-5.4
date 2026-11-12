import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { doubleCsrfProtection } from '../middleware/csrf.js';
import { rateLimit } from 'express-rate-limit';
import {
  getAllRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest
} from '../controllers/maintenanceController.js';

const router = Router();

const maintenanceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many maintenance requests, please try again later.' }
});

router.use(maintenanceLimiter);

// Reading is public; writing requires both an authenticated user and a valid
// CSRF token. All maintenance traffic is rate-limited per client.
router.get('/', getAllRequests);
router.get('/:id', getRequest);
router.post('/', requireAuth, doubleCsrfProtection, createRequest);
router.patch('/:id', requireAuth, doubleCsrfProtection, updateRequest);
router.delete('/:id', requireAuth, doubleCsrfProtection, deleteRequest);

export default router;
