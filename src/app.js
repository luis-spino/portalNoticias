import express from 'express';
import { getDb } from './config/db.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ api: 'Portal de Notícias', status: 'ok' });
});

app.get('/status', async (req, res) => {
  const colecoes = await getDb().listCollections().toArray();
  res.json({ banco: getDb().databaseName, colecoes: colecoes.length });
});

export default app;