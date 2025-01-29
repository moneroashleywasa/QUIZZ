import express from 'express';
import { getLeaderboard, createLeaderboardEntry, updateLeaderboardEntry, deleteLeaderboardEntry } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.post('/', createLeaderboardEntry);
router.put('/:id', updateLeaderboardEntry);
router.delete('/:id', deleteLeaderboardEntry);

export default router;
