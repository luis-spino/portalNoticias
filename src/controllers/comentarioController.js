import { ComentarioService } from '../services/comentarioService.js';

export const ComentarioController = {
  async criar(req, res) {
    const comentario = await ComentarioService.criar(req.params.postId, req.body, req.usuario);
    res.status(201).json(comentario);
  },

  async listar(req, res) {
    res.json(await ComentarioService.listar(req.params.postId));
  },

  async listarTodos(req, res) {
    res.json(await ComentarioService.listarTodos(req.params.postId, req.usuario));
  },

  async moderar(req, res) {
    res.json(await ComentarioService.moderar(req.params.id, req.body.status, req.usuario));
  },

  async remover(req, res) {
    await ComentarioService.remover(req.params.id, req.usuario);
    res.json({ mensagem: 'Comentário removido' });
  }
};