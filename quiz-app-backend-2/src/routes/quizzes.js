import express from 'express';
import { getAllQuizzes, createQuiz, getQuizById, updateQuiz, deleteQuiz } from '../controllers/quizController.js';

const router = express.Router();

router.get('/', getAllQuizzes);
router.post('/', createQuiz);
router.get('/:id', getQuizById);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

export default router;
