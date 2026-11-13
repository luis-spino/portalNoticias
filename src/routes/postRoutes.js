import { Router } from 'express';
import { PostController } from '../controllers/postController.js';

const router = Router();

router.post('/', PostController.criar);
router.get('/', PostController.listar);
router.get('/:id', PostController.buscarPorId);
router.put('/:id', PostController.atualizar);
router.delete('/:id', PostController.remover);

export default router;