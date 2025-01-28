// src/routes/users.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users route is working!');
});

export default router;
