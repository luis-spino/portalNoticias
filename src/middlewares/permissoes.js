import { AppError } from '../utils/AppError.js';

export function somenteAutores(req, res, next) {
  if (req.usuario.tipo !== 'autor') {
    throw new AppError('Apenas autores podem fazer isso', 403);
  }
  next();
}