export function normalizarTexto(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarPosts(posts, { busca = '', tipo = 'todos', tag = '' } = {}) {
  if (!Array.isArray(posts)) {
    throw new TypeError('filtrarPosts espera uma lista de posts.');
  }

  const termo = normalizarTexto(busca);

  return posts.filter((post) => {
    if (tipo !== 'todos' && post.tipo !== tipo) return false;
    if (tag && !(post.tags ?? []).includes(tag)) return false;
    if (termo && !normalizarTexto(post.titulo).includes(termo)) return false;
    return true;
  });
}

export function listarTags(posts) {
  if (!Array.isArray(posts)) {
    throw new TypeError('listarTags espera uma lista de posts.');
  }
  const todas = posts.flatMap((post) => post.tags ?? []);
  return [...new Set(todas)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}