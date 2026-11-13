import 'dotenv/config';
import app from './src/app.js';
import { conectarBanco } from './src/config/db.js';

const PORTA = process.env.PORT || 3000;

await conectarBanco();

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});