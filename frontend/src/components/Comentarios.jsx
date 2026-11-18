import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../api.js';
import {
  validarComentario,
  LIMITE_COMENTARIO,
} from '../utils/validarComentario.js';
import {
  podeModerarComentarios,
  podeExcluirComentario,
} from '../utils/permissoes.js';
import { formatarData } from '../utils/formatar.js';
import Sticker from './Sticker.jsx';

function Comentarios({ post, usuario = null }) {
  const postId = post._id;
  const usuarioId = usuario?._id;
  const moderador = podeModerarComentarios(usuario, post);

  const [comentarios, setComentarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroAcao, setErroAcao] = useState('');
  const [texto, setTexto] = useState('');
  const [erroTexto, setErroTexto] = useState('');
  const [erroApi, setErroApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  //moderador carrega todos (inclusive ocultos); os demais, só os visíveis
  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        setCarregando(true);
        setErro('');
        const caminho = moderador
          ? `/posts/${postId}/comentarios/todos`
          : `/posts/${postId}/comentarios`;
        const resposta = await apiGet(caminho, {
          signal: controller.signal,
          usuarioId: moderador ? usuarioId : undefined,
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
  }, [postId, moderador, usuarioId]);

  async function enviar(evento) {
    evento.preventDefault();

    const mensagem = validarComentario(texto);
    setErroTexto(mensagem);
    setErroApi('');

    //validação falhou, não chama a API
    if (mensagem) return;

    try {
      setEnviando(true);
      const novo = await apiPost(
        `/posts/${postId}/comentarios`,
        { texto: texto.trim() },
        { usuarioId },
      );
      setComentarios((atuais) => [...atuais, novo]);
      setTexto('');
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setEnviando(false);
    }
  }

  //alterna entre visível e oculto e troca o item com map
  async function alternarStatus(comentario) {
    const novoStatus = comentario.status === 'oculto' ? 'visivel' : 'oculto';

    try {
      setErroAcao('');
      const atualizado = await apiPatch(
        `/comentarios/${comentario._id}/moderar`,
        { status: novoStatus },
        { usuarioId },
      );
      setComentarios((atuais) =>
        atuais.map((c) => (c._id === atualizado._id ? atualizado : c)),
      );
    } catch (e) {
      setErroAcao(e.message);
    }
  }

  //DELETE e tira o item com filter
  async function excluir(comentario) {
    if (!window.confirm('Excluir este comentário?')) return;

    try {
      setErroAcao('');
      await apiDelete(`/comentarios/${comentario._id}`, { usuarioId });
      setComentarios((atuais) => atuais.filter((c) => c._id !== comentario._id));
    } catch (e) {
      setErroAcao(e.message);
    }
  }

  const ocultos = comentarios.filter((c) => c.status === 'oculto').length;
  const visiveis = comentarios.length - ocultos;

  return (
    <section className="comentarios" aria-label="Comentários">
      <h3 className="comentarios__titulo">
        <Sticker nome="comentario" tamanho={36} />
        Comentários ({visiveis})
        {moderador && ocultos > 0 && (
          <span className="comentarios__ocultos">
            · {ocultos} {ocultos === 1 ? 'oculto' : 'ocultos'}
          </span>
        )}
      </h3>

      {moderador && (
        <p className="comentarios__moderacao">
          Moderação: você também vê os comentários ocultos.
        </p>
      )}

      {erroAcao && (
        <p className="aviso-erro" role="alert">
          {erroAcao}
        </p>
      )}

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
          {comentarios.map((comentario) => {
            const oculto = comentario.status === 'oculto';
            const podeExcluir = podeExcluirComentario(usuario, comentario, post);

            return (
              <li
                key={comentario._id}
                className={oculto ? 'comentario comentario--oculto' : 'comentario'}
              >
                <div className="comentario__cabecalho">
                  <strong>{comentario.usuarioNome}</strong>
                  {oculto && <span className="selo-oculto">Oculto</span>}
                  <span>{formatarData(comentario.criadoEm)}</span>
                </div>

                <p className="comentario__texto">{comentario.texto}</p>

                {(moderador || podeExcluir) && (
                  <div className="comentario__acoes">
                    {moderador && (
                      <button
                        type="button"
                        className="botao botao--pequeno"
                        onClick={() => alternarStatus(comentario)}
                      >
                        {oculto ? 'Reexibir' : 'Ocultar'}
                      </button>
                    )}
                    {podeExcluir && (
                      <button
                        type="button"
                        className="botao botao--pequeno botao--perigo"
                        onClick={() => excluir(comentario)}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
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