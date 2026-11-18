import 'dotenv/config';
import app from './src/app.js';
import { conectarBanco } from './src/config/db.js';
import { criarIndices } from './src/config/indices.js';

const PORTA = process.env.PORT || 3000;

try {
  await conectarBanco();
  await criarIndices();
} catch (erro) {
  console.error('Não foi possível iniciar a API:', erro.message);
  process.exit(1);
}

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});