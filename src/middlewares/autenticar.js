import { AutorModel } from '../models/autorModel.js';
import { LeitorModel } from '../models/leitorModel.js';
import { AppError } from '../utils/AppError.js';

export async function autenticar(req, res, next) {
  const id = req.headers['x-usuario-id'];
  if (!id) throw new AppError('Informe o header x-usuario-id', 401);

  const autor = await AutorModel.buscarPorId(id);
  if (autor) {
    req.usuario = { _id: autor._id, nome: autor.nome, tipo: 'autor', papel: autor.papel };
    return next();
  }

  const leitor = await LeitorModel.buscarPorId(id);
  if (leitor) {
    req.usuario = { _id: leitor._id, nome: leitor.nome, tipo: 'leitor', papel: 'leitor' };
    return next();
  }

  throw new AppError('Usuário não encontrado', 401);
}