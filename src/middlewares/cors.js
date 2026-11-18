//origens do frontend liberadas (o Vite usa 5173 em desenvolvimento e 4173 no preview)
const ORIGENS_PADRAO = ['http://localhost:5173', 'http://localhost:4173'];

function origensPermitidas() {
  const configuradas = process.env.CORS_ORIGIN;
  if (!configuradas) return ORIGENS_PADRAO;
  return configuradas
    .split(',')
    .map((origem) => origem.trim())
    .filter(Boolean);
}

export function cors(req, res, next) {
  const origem = req.headers.origin;

  if (origem && origensPermitidas().includes(origem)) {
    res.setHeader('Access-Control-Allow-Origin', origem);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-usuario-id');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);

  next();
}