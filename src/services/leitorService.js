import { LeitorModel } from '../models/leitorModel.js';
import { AppError } from '../utils/AppError.js';

export const LeitorService = {
  async criar({ nome, email } = {}) {
    if (!nome || !email) {
      throw new AppError('Campos obrigatórios: nome, email');
    }

    email = email.trim().toLowerCase();
    if (await LeitorModel.buscarPorEmail(email)) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    return LeitorModel.inserir({
      nome: nome.trim(),
      email,
      criadoEm: new Date()
    });
  }
};