import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

const colecao = () => getDb().collection('autores');

export const AutorModel = {
  async inserir(autor) {
    const resultado = await colecao().insertOne(autor);
    return { _id: resultado.insertedId, ...autor };
  },

  listar() {
    return colecao().find().toArray();
  },

  buscarPorId(id) {
    return colecao().findOne({ _id: new ObjectId(id) });
  },

  buscarPorEmail(email) {
    return colecao().findOne({ email });
  },

  buscarRepresentanteDaSala(sala) {
    return colecao().findOne({ papel: 'representante', sala });
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
  }
};