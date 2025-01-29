import express from 'express';
import { getAllQuestions, createQuestion, getQuestionById, updateQuestion, deleteQuestion } from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getAllQuestions);
router.post('/', createQuestion);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
