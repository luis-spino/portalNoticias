import { Router } from 'express';
import { LeitorController } from '../controllers/leitorController.js';

const router = Router();

router.post('/', LeitorController.criar);

export default router;