import { describe, it, expect } from 'vitest';
import { validarCadastro, validarIdUsuario } from './validarUsuario.js';

describe('validarCadastro', () => {
  it('aceita um leitor com nome e e-mail', () => {
    expect(validarCadastro({ conta: 'leitor', nome: 'Maria', email: 'maria@aluno.br' })).toEqual({});
  });

  it('exige a sala só para representante', () => {
    const base = { nome: 'Larissa', email: 'l@aluno.br' };
    expect(validarCadastro({ ...base, conta: 'representante' }).sala).toBe('Informe a sala (ex.: 3A).');
    expect(validarCadastro({ ...base, conta: 'representante', sala: '3A' })).toEqual({});
    expect(validarCadastro({ ...base, conta: 'servidor' })).toEqual({});
  });

  it('rejeita e-mail sem formato válido', () => {
    expect(validarCadastro({ conta: 'leitor', nome: 'A', email: 'semarroba' }).email).toBe('Informe um e-mail válido.');
  });

  it('exige nome e e-mail', () => {
    expect(Object.keys(validarCadastro({ conta: 'leitor' }))).toEqual(['nome', 'email']);
  });
});

describe('validarIdUsuario', () => {
  it('aceita um ID de 24 caracteres hexadecimais', () => {
    expect(validarIdUsuario('6af677e156d52739654f9e54')).toBe('');
  });

  it('rejeita ID vazio, curto ou com caracteres inválidos', () => {
    expect(validarIdUsuario('')).toBe('Informe o seu ID.');
    expect(validarIdUsuario('abc')).toContain('24 caracteres');
    expect(validarIdUsuario('zzzzzzzzzzzzzzzzzzzzzzzz')).toContain('24 caracteres');
  });
});