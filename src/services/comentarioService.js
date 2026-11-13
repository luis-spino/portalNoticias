import { ComentarioModel } from '../models/comentarioModel.js';
import { PostModel } from '../models/postModel.js';
import { AppError } from '../utils/AppError.js';

const STATUS = ['visivel', 'oculto'];

async function exigirPost(id) {
  const post = await PostModel.buscarPorId(id);
  if (!post) throw new AppError('Post não encontrado', 404);
  return post;
}

async function exigirComentario(id) {
  const comentario = await ComentarioModel.buscarPorId(id);
  if (!comentario) throw new AppError('Comentário não encontrado', 404);
  return comentario;
}

// Moderador = servidor (em qualquer post) ou o autor do próprio post
function podeModerar(usuario, post) {
  if (usuario.tipo !== 'autor') return false;
  return usuario.papel === 'servidor' || String(post.autorId) === String(usuario._id);
}

export const ComentarioService = {
  async criar(postId, { texto } = {}, usuario) {
    await exigirPost(postId);

    texto = String(texto ?? '').trim();
    if (!texto) throw new AppError('O comentário não pode ser vazio');
    if (texto.length > 500) throw new AppError('O comentário pode ter no máximo 500 caracteres');

    return ComentarioModel.inserir({
      postId,
      usuarioId: usuario._id,
      usuarioTipo: usuario.tipo,
      usuarioNome: usuario.papel === 'servidor' ? `${usuario.nome} ✔` : usuario.nome,
      texto,
      status: 'visivel',
      criadoEm: new Date()
    });
  },

  // público: só os comentários visíveis
  async listar(postId) {
    await exigirPost(postId);
    return ComentarioModel.listarPorPost(postId, { status: 'visivel' });
  },

  // moderação: todos, inclusive os ocultos
  async listarTodos(postId, usuario) {
    const post = await exigirPost(postId);
    if (!podeModerar(usuario, post)) {
      throw new AppError('Só o autor do post ou um servidor pode ver os comentários ocultos', 403);
    }
    return ComentarioModel.listarPorPost(postId);
  },

  async moderar(id, status, usuario) {
    if (!STATUS.includes(status)) {
      throw new AppError('Status deve ser "visivel" ou "oculto"');
    }

    const comentario = await exigirComentario(id);
    const post = await PostModel.buscarPorId(comentario.postId);
    if (!post || !podeModerar(usuario, post)) {
      throw new AppError('Só o autor do post ou um servidor pode moderar comentários', 403);
    }

    return ComentarioModel.atualizarStatus(id, status);
  },

  async remover(id, usuario) {
    const comentario = await exigirComentario(id);
    const ehDono = String(comentario.usuarioId) === String(usuario._id);

    if (!ehDono) {
      const post = await PostModel.buscarPorId(comentario.postId);
      if (!post || !podeModerar(usuario, post)) {
        throw new AppError('Você não pode excluir este comentário', 403);
      }
    }

    await ComentarioModel.remover(id);
  }
};