import { Router } from 'express';
import { AutorController } from '../controllers/autorController.js';
import { autenticar } from '../middlewares/autenticar.js';

const router = Router();

router.post('/', AutorController.criar);
router.get('/', AutorController.listar);
router.get('/:id', AutorController.buscarPorId);
router.put('/:id', autenticar, AutorController.atualizar);
router.delete('/:id', autenticar, AutorController.remover);

export default router;