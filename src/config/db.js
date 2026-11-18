import { MongoClient } from 'mongodb';

let client;
let db;

export async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI não definida. Crie o arquivo .env na raiz (cp .env.example .env).',
    );
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGO_DB);
  console.log('MongoDB conectado');
}

export function getDb() {
  if (!db) throw new Error('Banco não conectado');
  return db;
}