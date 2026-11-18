export function converterTags(texto) {
  if (typeof texto !== 'string') {
    throw new TypeError('As tags devem ser um texto separado por vírgulas.');
  }
  const tags = texto
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(tags)];
}

export function tagsParaTexto(tags = []) {
  return tags.join(', ');
}