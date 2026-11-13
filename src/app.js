import express from 'express';
import autorRoutes from './routes/autorRoutes.js';
import postRoutes from './routes/postRoutes.js';
import leitorRoutes from './routes/leitorRoutes.js';
import comentarioRoutes from './routes/comentarioRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ api: 'Portal de Notícias', status: 'ok' });
});

app.use('/api/autores', autorRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/leitores', leitorRoutes);
app.use('/api', comentarioRoutes);

app.use(errorHandler);

export default app;