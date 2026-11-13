import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ api: 'Portal de Notícias', status: 'ok' });
});

export default app;