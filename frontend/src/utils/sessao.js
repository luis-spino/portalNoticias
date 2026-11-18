const CHAVE = 'portal-noticias:usuario';

export function lerUsuarioSalvo() {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

export function salvarUsuario(usuario) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(usuario));
  } catch {
    //a identificação vale só nesta sessão
  }
}

export function limparUsuario() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    // nada a fazer
  }
}