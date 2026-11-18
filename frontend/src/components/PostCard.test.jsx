import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './PostCard.jsx';
import { formatarData } from '../utils/formatar.js';

const post = {
  _id: 'p1',
  titulo: 'Vagas no projeto de robótica',
  conteudo: 'O laboratório está com 5 vagas abertas.',
  tipo: 'projeto',
  tags: ['robotica', 'estagio'],
  autorId: 'a1',
  autor: { _id: 'a1', nome: 'Larissa', papel: 'representante' },
  criadoEm: '2026-11-10T14:00:00.000Z',
};

const dono = { _id: 'a1', tipo: 'autor', papel: 'representante', nome: 'Larissa' };
const servidor = { _id: 's1', tipo: 'autor', papel: 'servidor', nome: 'Carlos' };
const leitor = { _id: 'l1', tipo: 'leitor', papel: 'leitor', nome: 'Maria' };

describe('PostCard', () => {
  it('mostra título, conteúdo, tipo, tags, autor e data', () => {
    render(<PostCard post={post} />);

    expect(screen.getByRole('heading', { name: post.titulo })).toBeInTheDocument();
    expect(screen.getByText(post.conteudo)).toBeInTheDocument();
    expect(screen.getByText('Projeto')).toBeInTheDocument();
    expect(screen.getByText('#robotica')).toBeInTheDocument();
    expect(screen.getByText('#estagio')).toBeInTheDocument();
    expect(screen.getByText('Larissa')).toBeInTheDocument();
    expect(screen.getByText(formatarData(post.criadoEm))).toBeInTheDocument();
  });

  it('mostra "Autor removido" quando o post não traz o autor', () => {
    render(<PostCard post={{ ...post, autor: undefined }} />);

    expect(screen.getByText('Autor removido')).toBeInTheDocument();
  });

  it('não mostra Editar nem Excluir para visitante', () => {
    render(<PostCard post={post} usuario={null} />);

    expect(screen.queryByRole('button', { name: 'Editar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Excluir' })).toBeNull();
  });

  it('não mostra Editar nem Excluir para leitor', () => {
    render(<PostCard post={post} usuario={leitor} />);

    expect(screen.queryByRole('button', { name: 'Editar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Excluir' })).toBeNull();
  });

  it('mostra Editar e Excluir para o dono e chama os callbacks com o post', () => {
    const onEditar = vi.fn();
    const onExcluir = vi.fn();
    render(<PostCard post={post} usuario={dono} onEditar={onEditar} onExcluir={onExcluir} />);

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(onEditar).toHaveBeenCalledWith(post);
    expect(onExcluir).toHaveBeenCalledWith(post);
  });

  it('mostra só Excluir para um servidor que não é o dono', () => {
    render(<PostCard post={post} usuario={servidor} />);

    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Editar' })).toBeNull();
  });

  it('chama onAbrir ao clicar em "Ler e comentar"', () => {
    const onAbrir = vi.fn();
    render(<PostCard post={post} onAbrir={onAbrir} />);

    fireEvent.click(screen.getByRole('button', { name: /Ler e comentar/ }));

    expect(onAbrir).toHaveBeenCalledWith(post);
  });
});