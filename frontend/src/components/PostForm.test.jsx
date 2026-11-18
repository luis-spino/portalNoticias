import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostForm from './PostForm.jsx';

function preencherObrigatorios() {
  fireEvent.change(screen.getByLabelText('Título'), {
    target: { value: 'Feira de Ciências' },
  });
  fireEvent.change(screen.getByLabelText('Conteúdo'), {
    target: { value: 'No ginásio, às 9h.' },
  });
}

describe('PostForm', () => {
  it('mostra mensagens de validação quando enviado vazio e não chama onSalvar', () => {
    const onSalvar = vi.fn();
    render(<PostForm onSalvar={onSalvar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(screen.getByText('Informe o título.')).toBeInTheDocument();
    expect(screen.getByText('Escreva o conteúdo da publicação.')).toBeInTheDocument();
    expect(onSalvar).not.toHaveBeenCalled();
  });

  it('envia os dados normalizados e limpa o formulário', async () => {
    const onSalvar = vi.fn().mockResolvedValue();
    render(<PostForm onSalvar={onSalvar} />);

    fireEvent.change(screen.getByLabelText('Título'), {
      target: { value: '  Feira de Ciências  ' },
    });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'evento' } });
    fireEvent.change(screen.getByLabelText('Conteúdo'), {
      target: { value: 'No ginásio, às 9h.' },
    });
    fireEvent.change(screen.getByLabelText('Tags'), {
      target: { value: 'Feira, ciencias, FEIRA' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(onSalvar).toHaveBeenCalledWith({
      titulo: 'Feira de Ciências',
      conteudo: 'No ginásio, às 9h.',
      tipo: 'evento',
      tags: ['feira', 'ciencias'],
    });

    // espera o botão voltar de "enviando..." para "Publicar"
    await screen.findByRole('button', { name: 'Publicar' });
    expect(screen.getByLabelText('Título')).toHaveValue('');
  });

  it('preenche o formulário ao editar e permite cancelar', () => {
    const onCancelar = vi.fn();
    const post = {
      _id: 'p1',
      titulo: 'Feira de Ciências 2026',
      conteudo: 'No ginásio.',
      tipo: 'evento',
      tags: ['feira', 'ciencias'],
    };
    render(<PostForm postEmEdicao={post} onSalvar={vi.fn()} onCancelar={onCancelar} />);

    expect(screen.getByRole('heading', { name: 'Editar publicação' })).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toHaveValue('Feira de Ciências 2026');
    expect(screen.getByLabelText('Tags')).toHaveValue('feira, ciencias');
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar edição' }));

    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

  it('mostra a mensagem de erro quando a API recusa', async () => {
    const onSalvar = vi
      .fn()
      .mockRejectedValue(new Error('Limite de 2 posts por semana atingido'));
    render(<PostForm onSalvar={onSalvar} />);

    preencherObrigatorios();
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Limite de 2 posts por semana atingido',
    );
  });
});