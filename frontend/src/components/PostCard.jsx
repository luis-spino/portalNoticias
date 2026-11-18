import Sticker from './Sticker.jsx';
import { formatarData } from '../utils/formatar.js';
import { podeEditarPost, podeExcluirPost } from '../utils/permissoes.js';

const ROTULOS = {
  projeto: 'Projeto',
  evento: 'Evento',
  anuncio: 'Anúncio',
};

function PostCard({
  post,
  usuario = null,
  onEditar = () => {},
  onExcluir = () => {},
}) {
  const podeEditar = podeEditarPost(usuario, post);
  const podeExcluir = podeExcluirPost(usuario, post);

  return (
    <article className={`card card--${post.tipo}`}>
      <div className="card__topo">
        <Sticker nome={post.tipo} tamanho={44} />
        <span className="card__tipo">{ROTULOS[post.tipo]}</span>
      </div>

      <h3 className="card__titulo">{post.titulo}</h3>
      <p className="card__texto">{post.conteudo}</p>

      <ul className="tags">
        {post.tags.map((tag) => (
          <li key={tag} className="tag">
            #{tag}
          </li>
        ))}
      </ul>

      <footer className="card__rodape">
        <div className="card__autor">
          <strong>{post.autor?.nome ?? 'Autor removido'}</strong>
          <span>{formatarData(post.criadoEm)}</span>
        </div>

        {(podeEditar || podeExcluir) && (
          <div className="card__acoes">
            {podeEditar && (
              <button
                type="button"
                className="botao botao--pequeno"
                onClick={() => onEditar(post)}
              >
                Editar
              </button>
            )}
            {podeExcluir && (
              <button
                type="button"
                className="botao botao--pequeno botao--perigo"
                onClick={() => onExcluir(post)}
              >
                Excluir
              </button>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}

export default PostCard;