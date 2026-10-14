import express from 'express';
import { menu } from '../data/menu.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(menu);
});

export default router;