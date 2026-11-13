import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

const colecao = () => getDb().collection('comentarios');

export const ComentarioModel = {
  async inserir(comentario) {
    const resultado = await colecao().insertOne(comentario);
    return { _id: resultado.insertedId, ...comentario };
  },

  listarPorPost(postId, filtro = {}) {
    return colecao()
      .find({ postId: new ObjectId(postId), ...filtro })
      .sort({ criadoEm: 1 })
      .toArray();
  },

  buscarPorId(id) {
    return colecao().findOne({ _id: new ObjectId(id) });
  },

  atualizarStatus(id, status) {
    return colecao().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );
  },

  async remover(id) {
    const resultado = await colecao().deleteOne({ _id: new ObjectId(id) });
    return resultado.deletedCount > 0;
  }
};