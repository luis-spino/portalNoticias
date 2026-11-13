import { AutorService } from '../services/autorService.js';

export const AutorController = {
  async criar(req, res) {
    const autor = await AutorService.criar(req.body);
    res.status(201).json(autor);
  },

  async listar(req, res) {
    res.json(await AutorService.listar());
  },

  async buscarPorId(req, res) {
    res.json(await AutorService.buscarPorId(req.params.id));
  },

    async atualizar(req, res) {
    res.json(await AutorService.atualizar(req.params.id, req.body, req.usuario));
  },

  async remover(req, res) {
    await AutorService.remover(req.params.id, req.usuario);
    res.json({ mensagem: 'Autor removido' });
  }
};