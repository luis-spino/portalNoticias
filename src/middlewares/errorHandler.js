export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let mensagem = err.message;

  if (err.name === 'BSONError') {
    status = 400;
    mensagem = 'ID inválido';
  } else if (err.code === 11000) {
    status = 409;
    mensagem = 'Registro duplicado';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ erro: mensagem });
}