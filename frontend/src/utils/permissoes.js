export function ehAutor(usuario) {
  return usuario?.tipo === 'autor';
}

export function ehServidor(usuario) {
  return ehAutor(usuario) && usuario.papel === 'servidor';
}

export function ehDonoDoPost(usuario, post) {
  return ehAutor(usuario) && String(post?.autorId) === String(usuario._id);
}

export function podePublicar(usuario) {
  return ehAutor(usuario);
}

export function podeEditarPost(usuario, post) {
  return ehDonoDoPost(usuario, post);
}

export function podeExcluirPost(usuario, post) {
  return ehDonoDoPost(usuario, post) || ehServidor(usuario);
}

export function podeModerarComentarios(usuario, post) {
  return ehServidor(usuario) || ehDonoDoPost(usuario, post);
}

export function nomeComSelo(usuario) {
  if (!usuario) return '';
  return ehServidor(usuario) ? `${usuario.nome} ✔` : usuario.nome;
}

export function rotuloPapel(usuario) {
  if (!usuario) return '';
  if (usuario.tipo === 'leitor') return 'Leitor';
  if (usuario.papel === 'servidor') return 'Servidor';
  return usuario.sala ? `Representante da sala ${usuario.sala}` : 'Representante';
}