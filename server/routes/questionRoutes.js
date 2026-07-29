import express from 'express';
import { addQuestion, getQuestions } from '../controllers/questionController.js';

const router = express.Router();

// Route: POST /api/questions and GET /api/questions
router.post('/', addQuestion);
router.get('/', getQuestions);

export default router;
