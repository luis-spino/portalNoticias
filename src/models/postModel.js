import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

const colecao = () => getDb().collection('posts');

export const PostModel = {
    async inserir(post) {
    const doc = { ...post, autorId: new ObjectId(post.autorId) };
    const resultado = await colecao().insertOne(doc);
    return { _id: resultado.insertedId, ...doc };
  },
  
  listar(filtro = {}) {
    return colecao().find(filtro).sort({ criadoEm: -1 }).toArray();
  },

  buscarPorId(id) {
    return colecao().findOne({ _id: new ObjectId(id) });
  },

  contarDesde(autorId, data) {
    return colecao().countDocuments({ autorId: new ObjectId(autorId), criadoEm: { $gte: data } });
  },

  atualizar(id, dados) {
    return colecao().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dados },
      { returnDocument: 'after' }
    );
  },

  async remover(id) {
    const resultado = await colecao().deleteOne({ _id: new ObjectId(id) });
    return resultado.deletedCount > 0;
  },

  removerPorAutor(autorId) {
    return colecao().deleteMany({ autorId: new ObjectId(autorId) });
  }
};