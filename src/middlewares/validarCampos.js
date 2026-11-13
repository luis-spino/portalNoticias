import { AppError } from '../utils/AppError.js';

export function validarCampos(...campos) {
  return (req, res, next) => {
    const faltando = campos.filter((c) => req.body?.[c] === undefined || req.body[c] === '');
    if (faltando.length) {
      throw new AppError(`Campos obrigatórios: ${faltando.join(', ')}`);
    }
    next();
  };
}