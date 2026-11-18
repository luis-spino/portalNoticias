import { describe, it, expect } from 'vitest';
import {
  podePublicar,
  podeEditarPost,
  podeExcluirPost,
  podeModerarComentarios,
  podeExcluirComentario,
  nomeComSelo,
  rotuloPapel,
} from './permissoes.js';

const servidor = { _id: 's1', tipo: 'autor', papel: 'servidor', nome: 'Carlos' };
const dona = { _id: 'r1', tipo: 'autor', papel: 'representante', nome: 'Larissa', sala: '3A' };
const outra = { _id: 'r2', tipo: 'autor', papel: 'representante', nome: 'Luis', sala: '3B' };
const leitor = { _id: 'l1', tipo: 'leitor', papel: 'leitor', nome: 'Maria' };

const post = { _id: 'p1', autorId: 'r1' };
const comentarioDoLeitor = { _id: 'c1', usuarioId: 'l1' };

describe('regras de publicação', () => {
  it('só autores publicam', () => {
    expect(podePublicar(servidor)).toBe(true);
    expect(podePublicar(dona)).toBe(true);
    expect(podePublicar(leitor)).toBe(false);
    expect(podePublicar(null)).toBe(false);
  });

  it('só o dono edita o post', () => {
    expect(podeEditarPost(dona, post)).toBe(true);
    expect(podeEditarPost(servidor, post)).toBe(false);
    expect(podeEditarPost(outra, post)).toBe(false);
  });

  it('o dono ou um servidor exclui o post', () => {
    expect(podeExcluirPost(dona, post)).toBe(true);
    expect(podeExcluirPost(servidor, post)).toBe(true);
    expect(podeExcluirPost(outra, post)).toBe(false);
    expect(podeExcluirPost(leitor, post)).toBe(false);
  });
});

describe('regras de comentários', () => {
  it('o dono do post e o servidor moderam', () => {
    expect(podeModerarComentarios(dona, post)).toBe(true);
    expect(podeModerarComentarios(servidor, post)).toBe(true);
    expect(podeModerarComentarios(outra, post)).toBe(false);
    expect(podeModerarComentarios(leitor, post)).toBe(false);
  });

  it('quem comentou exclui o próprio comentário', () => {
    expect(podeExcluirComentario(leitor, comentarioDoLeitor, post)).toBe(true);
  });

  it('moderador exclui comentário de outra pessoa', () => {
    expect(podeExcluirComentario(dona, comentarioDoLeitor, post)).toBe(true);
    expect(podeExcluirComentario(servidor, comentarioDoLeitor, post)).toBe(true);
  });

  it('visitante e autor de outro post não excluem comentário alheio', () => {
    expect(podeExcluirComentario(null, comentarioDoLeitor, post)).toBe(false);
    expect(podeExcluirComentario(outra, comentarioDoLeitor, post)).toBe(false);
  });
});

describe('textos de identificação', () => {
  it('mostra o selo de verificado só para servidor', () => {
    expect(nomeComSelo(servidor)).toBe('Carlos ✔');
    expect(nomeComSelo(dona)).toBe('Larissa');
  });

  it('descreve o papel do usuário', () => {
    expect(rotuloPapel(servidor)).toBe('Servidor');
    expect(rotuloPapel(dona)).toBe('Representante da sala 3A');
    expect(rotuloPapel(leitor)).toBe('Leitor');
  });
});