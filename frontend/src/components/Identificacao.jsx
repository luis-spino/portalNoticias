import { useState } from 'react';
import { validarCadastro, validarIdUsuario } from '../utils/validarUsuario.js';
import { nomeComSelo, rotuloPapel } from '../utils/permissoes.js';

const CADASTRO_VAZIO = { conta: 'leitor', nome: '', email: '', sala: '' };

function Identificacao({ usuario = null, onCadastrar, onEntrar, onSair = () => {} }) {
  const [modo, setModo] = useState('entrar');
  const [cadastro, setCadastro] = useState(CADASTRO_VAZIO);
  const [entrada, setEntrada] = useState({ id: '', tipo: 'autor' });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return (
      <section className="identificacao">
        <p className="identificacao__nome">Olá, {nomeComSelo(usuario)}</p>
        <p className="identificacao__papel">{rotuloPapel(usuario)}</p>
        <button type="button" className="botao botao--pequeno" onClick={onSair}>
          Sair
        </button>
      </section>
    );
  }

  function trocarModo(novo) {
    setModo(novo);
    setErros({});
    setErroApi('');
  }

  function mudarCadastro(evento) {
    const { name, value } = evento.target;
    setCadastro({ ...cadastro, [name]: value });
  }

  function mudarEntrada(evento) {
    const { name, value } = evento.target;
    setEntrada({ ...entrada, [name]: value });
  }

  async function enviarCadastro(evento) {
    evento.preventDefault();
    const novosErros = validarCadastro(cadastro);
    setErros(novosErros);
    setErroApi('');
    if (Object.keys(novosErros).length > 0) return;

    try {
      setEnviando(true);
      await onCadastrar(cadastro);
      setCadastro(CADASTRO_VAZIO);
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setEnviando(false);
    }
  }

  async function enviarEntrada(evento) {
    evento.preventDefault();
    const mensagem = validarIdUsuario(entrada.id);
    setErros(mensagem ? { id: mensagem } : {});
    setErroApi('');
    if (mensagem) return;

    try {
      setEnviando(true);
      await onEntrar(entrada.id, entrada.tipo);
      setEntrada({ id: '', tipo: 'autor' });
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="identificacao">
      <h2 className="secao__titulo">Identificação</h2>

      <div className="filtros" role="group" aria-label="Escolher entre entrar e cadastrar">
        <button
          type="button"
          className={modo === 'entrar' ? 'pilula pilula--ativa' : 'pilula'}
          aria-pressed={modo === 'entrar'}
          onClick={() => trocarModo('entrar')}
        >
          Entrar
        </button>
        <button
          type="button"
          className={modo === 'cadastrar' ? 'pilula pilula--ativa' : 'pilula'}
          aria-pressed={modo === 'cadastrar'}
          onClick={() => trocarModo('cadastrar')}
        >
          Cadastrar
        </button>
      </div>

      {modo === 'entrar' ? (
        <form onSubmit={enviarEntrada} noValidate>
          <div className="campo">
            <label htmlFor="entrada-tipo">Sou</label>
            <select
              id="entrada-tipo"
              name="tipo"
              value={entrada.tipo}
              onChange={mudarEntrada}
            >
              <option value="autor">Autor (representante ou servidor)</option>
              <option value="leitor">Leitor</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="entrada-id">Meu ID</label>
            <input
              id="entrada-id"
              name="id"
              type="text"
              value={entrada.id}
              onChange={mudarEntrada}
              placeholder="Cole aqui o seu _id"
            />
            {erros.id && <small className="erro-campo">{erros.id}</small>}
          </div>

          {erroApi && (
            <p className="aviso-erro" role="alert">
              {erroApi}
            </p>
          )}

          <button type="submit" className="botao botao--primario" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      ) : (
        <form onSubmit={enviarCadastro} noValidate>
          <div className="campo">
            <label htmlFor="cad-conta">Tipo de conta</label>
            <select
              id="cad-conta"
              name="conta"
              value={cadastro.conta}
              onChange={mudarCadastro}
            >
              <option value="leitor">Leitor (comenta)</option>
              <option value="representante">Representante de sala</option>
              <option value="servidor">Servidor</option>
            </select>
            {erros.conta && <small className="erro-campo">{erros.conta}</small>}
          </div>

          <div className="campo">
            <label htmlFor="cad-nome">Nome</label>
            <input
              id="cad-nome"
              name="nome"
              type="text"
              value={cadastro.nome}
              onChange={mudarCadastro}
            />
            {erros.nome && <small className="erro-campo">{erros.nome}</small>}
          </div>

          <div className="campo">
            <label htmlFor="cad-email">E-mail</label>
            <input
              id="cad-email"
              name="email"
              type="email"
              value={cadastro.email}
              onChange={mudarCadastro}
            />
            {erros.email && <small className="erro-campo">{erros.email}</small>}
          </div>

          {cadastro.conta === 'representante' && (
            <div className="campo">
              <label htmlFor="cad-sala">Sala</label>
              <input
                id="cad-sala"
                name="sala"
                type="text"
                value={cadastro.sala}
                onChange={mudarCadastro}
                placeholder="Ex.: 3A"
              />
              {erros.sala && <small className="erro-campo">{erros.sala}</small>}
            </div>
          )}

          {erroApi && (
            <p className="aviso-erro" role="alert">
              {erroApi}
            </p>
          )}

          <button type="submit" className="botao botao--primario" disabled={enviando}>
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      )}
    </section>
  );
}

export default Identificacao;