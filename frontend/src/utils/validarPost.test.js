import { describe, it, expect } from 'vitest';
import { validarPost } from './validarPost.js';

describe('validarPost', () => {
  it('não devolve erros para um post válido', () => {
    expect(validarPost({ titulo: 'Feira', conteudo: 'No ginásio', tipo: 'evento' })).toEqual({});
  });

  it('exige título e conteúdo', () => {
    const erros = validarPost({ titulo: '', conteudo: '', tipo: 'evento' });
    expect(erros.titulo).toBe('Informe o título.');
    expect(erros.conteudo).toBe('Escreva o conteúdo da publicação.');
  });

  it('trata texto só com espaços como vazio', () => {
    expect(validarPost({ titulo: '   ', conteudo: 'ok', tipo: 'projeto' }).titulo).toBe('Informe o título.');
  });

  it('aceita apenas os tipos projeto, evento e anuncio', () => {
    expect(validarPost({ titulo: 'a', conteudo: 'b', tipo: 'noticia' }).tipo).toBe('Escolha um tipo válido.');
    expect(validarPost({ titulo: 'a', conteudo: 'b', tipo: 'anuncio' })).toEqual({});
  });

  it('funciona mesmo sem receber argumentos', () => {
    expect(Object.keys(validarPost())).toEqual(['titulo', 'conteudo', 'tipo']);
  });
});