import { LeitorService } from '../services/leitorService.js';

export const LeitorController = {
  async criar(req, res) {
    const leitor = await LeitorService.criar(req.body);
    res.status(201).json(leitor);
  }
};