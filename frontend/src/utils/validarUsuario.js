export const CONTAS = ['leitor', 'representante', 'servidor'];

export function validarCadastro({ conta = '', nome = '', email = '', sala = '' } = {}) {
  const erros = {};
  if (!CONTAS.includes(conta)) erros.conta = 'Escolha o tipo de conta.';
  if (!nome.trim()) erros.nome = 'Informe o seu nome.';
  if (!email.trim()) erros.email = 'Informe o e-mail.';
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) erros.email = 'Informe um e-mail válido.';
  if (conta === 'representante' && !sala.trim()) erros.sala = 'Informe a sala (ex.: 3A).';
  return erros;
}

export function validarIdUsuario(id = '') {
  if (!id.trim()) return 'Informe o seu ID.';
  if (!/^[0-9a-fA-F]{24}$/.test(id.trim())) {
    return 'O ID deve ter 24 caracteres (letras de a a f e números).';
  }
  return '';
}