import { AutorModel } from '../models/autorModel.js';
import { PostModel } from '../models/postModel.js';
import { AppError } from '../utils/AppError.js';

const PAPEIS = ['representante', 'servidor'];

function formatar(autor) {
  return { ...autor, nomeExibicao: autor.verificado ? `${autor.nome} ✔` : autor.nome };
}

async function exigirAutor(id) {
  const autor = await AutorModel.buscarPorId(id);
  if (!autor) throw new AppError('Autor não encontrado', 404);
  return autor;
}

export const AutorService = {
  async criar({ nome, email, papel, sala } = {}) {
    if (!nome || !email || !papel) {
      throw new AppError('Campos obrigatórios: nome, email, papel');
    }
    if (!PAPEIS.includes(papel)) {
      throw new AppError('Papel deve ser "representante" ou "servidor"');
    }
    if (papel === 'representante' && !sala) {
      throw new AppError('Representante precisa informar a sala');
    }

    email = email.trim().toLowerCase();
    if (await AutorModel.buscarPorEmail(email)) {
      throw new AppError('E-mail já cadastrado', 409);
    }
    if (papel === 'representante' && (await AutorModel.buscarRepresentanteDaSala(sala))) {
      throw new AppError('Esta sala já tem um representante', 409);
    }

    const autor = await AutorModel.inserir({
      nome: nome.trim(),
      email,
      papel,
      sala: papel === 'representante' ? sala : null,
      verificado: papel === 'servidor',
      criadoEm: new Date()
    });
    return formatar(autor);
  },

  async listar() {
    const autores = await AutorModel.listar();
    return autores.map(formatar);
  },

  async buscarPorId(id) {
    return formatar(await exigirAutor(id));
  },

  async atualizar(id, { nome, email, sala } = {}, usuario) {
    if (usuario.tipo !== 'autor' || String(usuario._id) !== String(id)) {
      throw new AppError('Você só pode editar o seu próprio cadastro', 403);
    }

    const autor = await exigirAutor(id);
    const dados = {};

    if (nome) dados.nome = nome.trim();

    if (email) {
      email = email.trim().toLowerCase();
      const outro = await AutorModel.buscarPorEmail(email);
      if (outro && String(outro._id) !== String(autor._id)) {
        throw new AppError('E-mail já cadastrado', 409);
      }
      dados.email = email;
    }

    if (sala && autor.papel === 'representante') {
      const outro = await AutorModel.buscarRepresentanteDaSala(sala);
      if (outro && String(outro._id) !== String(autor._id)) {
        throw new AppError('Esta sala já tem um representante', 409);
      }
      dados.sala = sala;
    }

    if (Object.keys(dados).length === 0) {
      throw new AppError('Nenhum campo válido para atualizar (nome, email, sala)');
    }

    dados.atualizadoEm = new Date();
    return formatar(await AutorModel.atualizar(id, dados));
  },

  async remover(id, usuario) {
    const ehDono = usuario.tipo === 'autor' && String(usuario._id) === String(id);
    if (!ehDono && usuario.papel !== 'servidor') {
      throw new AppError('Você só pode excluir o seu próprio cadastro', 403);
    }

    await exigirAutor(id);
    await PostModel.removerPorAutor(id); 
    await AutorModel.remover(id);
  }
};