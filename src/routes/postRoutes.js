import { Router } from 'express';
import { PostController } from '../controllers/postController.js';
import { autenticar } from '../middlewares/autenticar.js';
import { somenteAutores } from '../middlewares/permissoes.js';
import { validarCampos } from '../middlewares/validarCampos.js';

const router = Router();

router.get('/', PostController.listar);
router.get('/:id', PostController.buscarPorId);

router.post(
  '/',
  [autenticar, somenteAutores, validarCampos('titulo', 'conteudo', 'tipo')],
  PostController.criar
);
router.put('/:id', [autenticar, somenteAutores], PostController.atualizar);
router.delete('/:id', [autenticar, somenteAutores], PostController.remover);

export default router;