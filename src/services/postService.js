import { PostModel } from '../models/postModel.js';
import { AutorModel } from '../models/autorModel.js';
import { AppError } from '../utils/AppError.js';
import { inicioDaSemana } from '../utils/datas.js';

const TIPOS = ['projeto', 'evento', 'anuncio'];
const LIMITE_SEMANAL = 2;

function normalizarTags(tags) {
  if (tags === undefined) return [];
  if (!Array.isArray(tags)) {
    throw new AppError('tags deve ser uma lista, ex.: ["estagio", "tecnologia"]');
  }
  const limpas = tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  return [...new Set(limpas)]; // remove repetidas
}

// acrescenta os dados do autor (com o selo ✔ para servidor)
async function comAutor(post) {
  const autor = await AutorModel.buscarPorId(post.autorId);
  if (!autor) return post;
  return {
    ...post,
    autor: {
      _id: autor._id,
      nome: autor.verificado ? `${autor.nome} ✔` : autor.nome,
      papel: autor.papel
    }
  };
}

async function exigirPost(id) {
  const post = await PostModel.buscarPorId(id);
  if (!post) throw new AppError('Post não encontrado', 404);
  return post;
}

export const PostService = {
  async criar({ titulo, conteudo, tipo, tags, autorId } = {}) {
    if (!titulo || !conteudo || !tipo || !autorId) {
      throw new AppError('Campos obrigatórios: titulo, conteudo, tipo, autorId');
    }
    if (!TIPOS.includes(tipo)) {
      throw new AppError('Tipo deve ser "projeto", "evento" ou "anuncio"');
    }

    const autor = await AutorModel.buscarPorId(autorId);
    if (!autor) throw new AppError('Autor não encontrado', 404);

    // Regra de negócio: representante publica no máximo 2 posts por semana
    if (autor.papel === 'representante') {
      const total = await PostModel.contarDesde(autorId, inicioDaSemana());
      if (total >= LIMITE_SEMANAL) {
        throw new AppError(`Limite de ${LIMITE_SEMANAL} posts por semana atingido`, 429);
      }
    }

    const post = await PostModel.inserir({
      titulo: titulo.trim(),
      conteudo,
      tipo,
      tags: normalizarTags(tags),
      autorId,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    });
    return comAutor(post);
  },

  async listar({ tag, tipo } = {}) {
    const filtro = {};
    if (tag) filtro.tags = String(tag).trim().toLowerCase();
    if (tipo) filtro.tipo = tipo;

    const posts = await PostModel.listar(filtro);
    return Promise.all(posts.map(comAutor));
  },

  async buscarPorId(id) {
    return comAutor(await exigirPost(id));
  },

  async atualizar(id, { titulo, conteudo, tipo, tags } = {}) {
    await exigirPost(id);
    const dados = {};

    if (titulo) dados.titulo = titulo.trim();
    if (conteudo) dados.conteudo = conteudo;
    if (tipo) {
      if (!TIPOS.includes(tipo)) {
        throw new AppError('Tipo deve ser "projeto", "evento" ou "anuncio"');
      }
      dados.tipo = tipo;
    }
    if (tags !== undefined) dados.tags = normalizarTags(tags);

    if (Object.keys(dados).length === 0) {
      throw new AppError('Nenhum campo válido para atualizar (titulo, conteudo, tipo, tags)');
    }

    dados.atualizadoEm = new Date();
    return comAutor(await PostModel.atualizar(id, dados));
  },

  async remover(id) {
    await exigirPost(id);
    await PostModel.remover(id);
  }
};