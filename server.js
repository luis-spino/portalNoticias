import 'dotenv/config';
import app from './src/app.js';
import { conectarBanco } from './src/config/db.js';
import { criarIndices } from './src/config/indices.js';

const PORTA = process.env.PORT || 3000;

await conectarBanco();
await criarIndices();

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});