import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function conectarBanco() {
  await client.connect();
  db = client.db(process.env.MONGO_DB);
  console.log('MongoDB conectado');
}

export function getDb() {
  if (!db) throw new Error('Banco não conectado');
  return db;
}