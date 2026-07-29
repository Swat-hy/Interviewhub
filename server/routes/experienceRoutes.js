import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  toggleLike,
  addComment,
  getMyExperiences,
  deleteExperience
} from '../controllers/experienceController.js';

const router = express.Router();

router.route('/')
  .post(protect, createExperience)
  .get(getAllExperiences);

router.route('/my')
  .get(protect, getMyExperiences);

router.route('/:id')
  .get(getExperienceById)
  .delete(protect, deleteExperience);

router.route('/:id/like')
  .post(protect, toggleLike);

router.route('/:id/comment')
  .post(protect, addComment);

export default router;
