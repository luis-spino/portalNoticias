const BASE_URL = '/api';

const MENSAGENS = {
  400: 'Os dados enviados são inválidos.',
  401: 'Identifique-se para continuar.',
  403: 'Você não tem permissão para fazer isso.',
  404: 'Não encontramos o que você procurou.',
  409: 'Esse registro já existe.',
  429: 'Limite de publicações da semana atingido.',
  500: 'Erro no servidor. Tente novamente em instantes.',
};

export class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function lerCorpo(resposta) {
  const texto = await resposta.text();
  if (!texto) return null;
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

async function requisitar(metodo, caminho, { corpo, signal, usuarioId } = {}) {
  const headers = {};
  if (corpo !== undefined) headers['Content-Type'] = 'application/json';
  if (usuarioId) headers['x-usuario-id'] = usuarioId;

  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal,
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new ApiError('Não foi possível conectar ao servidor.', 0);
  }

  const dados = await lerCorpo(resposta);

  if (!resposta.ok) {
    const mensagem =
      dados?.erro || MENSAGENS[resposta.status] || 'Ocorreu um erro inesperado.';
    throw new ApiError(mensagem, resposta.status);
  }

  return dados;
}

export const apiGet = (caminho, opcoes) => requisitar('GET', caminho, opcoes);

export const apiPost = (caminho, corpo, opcoes) =>
  requisitar('POST', caminho, { ...opcoes, corpo });

export const apiPut = (caminho, corpo, opcoes) =>
  requisitar('PUT', caminho, { ...opcoes, corpo });

export const apiPatch = (caminho, corpo, opcoes) =>
  requisitar('PATCH', caminho, { ...opcoes, corpo });

export const apiDelete = (caminho, opcoes) =>
  requisitar('DELETE', caminho, opcoes);