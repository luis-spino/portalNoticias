import { describe, it, expect } from 'vitest';
import { filtrarPosts, listarTags, normalizarTexto } from './filtrarPosts.js';

const posts = [
  { _id: '1', titulo: 'Vagas no projeto de Robótica', tipo: 'projeto', tags: ['robotica', 'estagio'] },
  { _id: '2', titulo: 'Feira de Ciências 2026', tipo: 'evento', tags: ['feira', 'ciencias', 'estagio'] },
  { _id: '3', titulo: 'Reunião de pais', tipo: 'anuncio', tags: ['reuniao'] },
];

const ids = (lista) => lista.map((post) => post._id);

describe('filtrarPosts', () => {
  it('devolve todos os posts quando não há filtro', () => {
    expect(ids(filtrarPosts(posts))).toEqual(['1', '2', '3']);
  });

  it('busca pelo título ignorando acentos e maiúsculas', () => {
    expect(ids(filtrarPosts(posts, { busca: 'ROBÓTICA' }))).toEqual(['1']);
    expect(ids(filtrarPosts(posts, { busca: 'reuniao' }))).toEqual(['3']);
  });

  it('filtra por tipo', () => {
    expect(ids(filtrarPosts(posts, { tipo: 'evento' }))).toEqual(['2']);
  });

  it('filtra por tag', () => {
    expect(ids(filtrarPosts(posts, { tag: 'estagio' }))).toEqual(['1', '2']);
  });

  it('combina tipo, tag e busca', () => {
    expect(ids(filtrarPosts(posts, { tipo: 'projeto', tag: 'estagio', busca: 'vagas' }))).toEqual(['1']);
    expect(ids(filtrarPosts(posts, { tipo: 'projeto', tag: 'estagio', busca: 'feira' }))).toEqual([]);
  });

  it('não altera a lista original', () => {
    filtrarPosts(posts, { tipo: 'evento' });
    expect(posts).toHaveLength(3);
  });

  it('lança TypeError quando recebe algo que não é uma lista', () => {
    expect(() => filtrarPosts(null)).toThrow(TypeError);
    expect(() => filtrarPosts('abc')).toThrow('lista de posts');
  });
});

describe('listarTags', () => {
  it('junta as tags sem repetir e em ordem alfabética', () => {
    expect(listarTags(posts)).toEqual(['ciencias', 'estagio', 'feira', 'reuniao', 'robotica']);
  });

  it('devolve lista vazia quando não há posts', () => {
    expect(listarTags([])).toEqual([]);
  });

  it('lança TypeError quando recebe algo que não é uma lista', () => {
    expect(() => listarTags(undefined)).toThrow(TypeError);
  });
});

describe('normalizarTexto', () => {
  it('remove acentos, espaços nas pontas e deixa em minúsculas', () => {
    expect(normalizarTexto('  Ação Ótima ')).toBe('acao otima');
  });
});