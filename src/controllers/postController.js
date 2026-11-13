import { PostService } from '../services/postService.js';

export const PostController = {
  async criar(req, res) {
    const post = await PostService.criar({ ...req.body, autorId: req.usuario._id });
    res.status(201).json(post);
  },

  async listar(req, res) {
    res.json(await PostService.listar(req.query));
  },

  async buscarPorId(req, res) {
    res.json(await PostService.buscarPorId(req.params.id));
  },

  async atualizar(req, res) {
    res.json(await PostService.atualizar(req.params.id, req.body, req.usuario));
  },

  async remover(req, res) {
    await PostService.remover(req.params.id, req.usuario);
    res.json({ mensagem: 'Post removido' });
  }
};