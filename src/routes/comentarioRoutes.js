import { Router } from 'express';
import { ComentarioController } from '../controllers/comentarioController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { somenteAutores } from '../middlewares/permissoes.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = Router();

// comentários de um post
router.get('/posts/:postId/comentarios', ComentarioController.listar);
router.get('/posts/:postId/comentarios/todos', autenticar, ComentarioController.listarTodos);
router.post(
  '/posts/:postId/comentarios',
  [autenticar, validarCampos('texto')],
  ComentarioController.criar
);

// moderação e exclusão
router.patch(
  '/comentarios/:id/moderar',
  [autenticar, somenteAutores, validarCampos('status')],
  ComentarioController.moderar
);
router.delete('/comentarios/:id', autenticar, ComentarioController.remover);

export default router;