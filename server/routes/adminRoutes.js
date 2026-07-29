import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getPendingExperiences,
  approveExperience,
  rejectExperience
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/pending', protect, adminOnly, getPendingExperiences);
router.put('/approve/:id', protect, adminOnly, approveExperience);
router.delete('/reject/:id', protect, adminOnly, rejectExperience);

export default router;
