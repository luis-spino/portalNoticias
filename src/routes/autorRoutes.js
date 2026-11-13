import { Router } from 'express';
import { AutorController } from '../controllers/autorController.js';

const router = Router();

router.post('/', AutorController.criar);
router.get('/', AutorController.listar);
router.get('/:id', AutorController.buscarPorId);
router.put('/:id', AutorController.atualizar);
router.delete('/:id', AutorController.remover);

export default router;