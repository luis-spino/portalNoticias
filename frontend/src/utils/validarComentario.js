export const LIMITE_COMENTARIO = 500;

export function validarComentario(texto = '') {
  const limpo = String(texto).trim();
  if (!limpo) return 'Escreva um comentário.';
  if (limpo.length > LIMITE_COMENTARIO) {
    return `O comentário pode ter no máximo ${LIMITE_COMENTARIO} caracteres.`;
  }
  return '';
}