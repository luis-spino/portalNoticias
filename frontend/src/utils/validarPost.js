export const TIPOS = ['projeto', 'evento', 'anuncio'];

export function validarPost({ titulo = '', conteudo = '', tipo = '' } = {}) {
  const erros = {};
  if (!titulo.trim()) erros.titulo = 'Informe o título.';
  if (!conteudo.trim()) erros.conteudo = 'Escreva o conteúdo da publicação.';
  if (!TIPOS.includes(tipo)) erros.tipo = 'Escolha um tipo válido.';
  return erros;
}