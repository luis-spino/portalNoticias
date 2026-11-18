import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api.js';
import {
  validarComentario,
  LIMITE_COMENTARIO,
} from '../utils/validarComentario.js';
import { formatarData } from '../utils/formatar.js';
import Sticker from './Sticker.jsx';

function Comentarios({ postId, usuario = null }) {
  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [texto, setTexto] = useState('');
  const [erroTexto, setErroTexto] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  //carrega os comentários visíveis do post
  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        setCarregando(true);
        setErro('');
        const resposta = await apiGet(`/posts/${postId}/comentarios`, {
          signal: controller.signal,
        });
        setComentarios(Array.isArray(resposta) ? resposta : (resposta.data ?? []));
      } catch (e) {
        if (e.name === 'AbortError') return;
        setErro(e.message);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();

    return () => controller.abort();
  }, [postId]);

  async function enviar(evento) {
    evento.preventDefault();

    const mensagem = validarComentario(texto);
    setErroTexto(mensagem);
    setErroApi('');

    // validação falhou, não chama a API
    if (mensagem) return;

    try {
      setEnviando(true);
      const novo = await apiPost(
        `/posts/${postId}/comentarios`,
        { texto: texto.trim() },
        { usuarioId: usuario._id },
      );
      // a API lista do mais antigo para o mais novo
      setComentarios((atuais) => [...atuais, novo]);
      setTexto('');
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="comentarios" aria-label="Comentários">
      <h3 className="comentarios__titulo">
        <Sticker nome="comentario" tamanho={36} />
        Comentários ({comentarios.length})
      </h3>

      {carregando && <p className="estado">Carregando comentários...</p>}

      {!carregando && erro && (
        <p className="estado estado--erro" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && comentarios.length === 0 && (
        <p className="estado">Ainda não há comentários. Seja o primeiro!</p>
      )}

      {!carregando && !erro && comentarios.length > 0 && (
        <ul className="comentarios__lista">
          {comentarios.map((comentario) => (
            <li key={comentario._id} className="comentario">
              <div className="comentario__cabecalho">
                <strong>{comentario.usuarioNome}</strong>
                <span>{formatarData(comentario.criadoEm)}</span>
              </div>
              <p className="comentario__texto">{comentario.texto}</p>
            </li>
          ))}
        </ul>
      )}

      {usuario ? (
        <form onSubmit={enviar} noValidate className="comentarios__form">
          <div className="campo">
            <label htmlFor="novo-comentario">Escreva um comentário</label>
            <textarea
              id="novo-comentario"
              rows="3"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Participe da conversa"
            />
            <small className="contador">
              {texto.length}/{LIMITE_COMENTARIO}
            </small>
            {erroTexto && <small className="erro-campo">{erroTexto}</small>}
          </div>

          {erroApi && (
            <p className="aviso-erro" role="alert">
              {erroApi}
            </p>
          )}

          <button type="submit" className="botao botao--primario" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      ) : (
        <p className="comentarios__aviso">
          Entre como leitor ou autor, no painel de identificação, para comentar.
        </p>
      )}
    </section>
  );
}

export default Comentarios;