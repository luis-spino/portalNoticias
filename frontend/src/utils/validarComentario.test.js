import { describe, it, expect } from 'vitest';
import { validarComentario, LIMITE_COMENTARIO } from './validarComentario.js';

describe('validarComentario', () => {
  it('aceita um comentário normal', () => {
    expect(validarComentario('Quero participar!')).toBe('');
  });

  it('rejeita comentário vazio ou só com espaços', () => {
    expect(validarComentario('')).toBe('Escreva um comentário.');
    expect(validarComentario('    ')).toBe('Escreva um comentário.');
  });

  it('aceita exatamente 500 caracteres e rejeita 501', () => {
    expect(validarComentario('a'.repeat(LIMITE_COMENTARIO))).toBe('');
    expect(validarComentario('a'.repeat(LIMITE_COMENTARIO + 1))).toBe(
      'O comentário pode ter no máximo 500 caracteres.',
    );
  });
});