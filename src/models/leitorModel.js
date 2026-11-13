import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

const colecao = () => getDb().collection('leitores');

export const LeitorModel = {
  async inserir(leitor) {
    const resultado = await colecao().insertOne(leitor);
    return { _id: resultado.insertedId, ...leitor };
  },

  buscarPorId(id) {
    return colecao().findOne({ _id: new ObjectId(id) });
  },

  buscarPorEmail(email) {
    return colecao().findOne({ email });
  }
};