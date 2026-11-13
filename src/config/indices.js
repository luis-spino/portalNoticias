import { getDb } from './db.js';

export async function criarIndices() {
  const db = getDb();
  await db.collection('autores').createIndex({ email: 1 }, { unique: true });
  await db.collection('leitores').createIndex({ email: 1 }, { unique: true });
  await db.collection('posts').createIndex({ tags: 1 });
  await db.collection('comentarios').createIndex({ postId: 1 });
}