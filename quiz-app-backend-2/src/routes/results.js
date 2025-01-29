import express from 'express';
import { getAllResults, createResult, getResultById, updateResult, deleteResult } from '../controllers/resultController.js';

const router = express.Router();

router.get('/', getAllResults);
router.post('/', createResult);
router.get('/:id', getResultById);
router.put('/:id', updateResult);
router.delete('/:id', deleteResult);

export default router;
