import Sticker from './Sticker.jsx';
import { formatarData } from '../utils/formatar.js';

const ROTULOS = {
  projeto: 'Projeto',
  evento: 'Evento',
  anuncio: 'Anúncio',
};

function PostCard({ post }) {
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
        <div className="card__acoes">
          <button type="button" className="botao botao--pequeno">
            Editar
          </button>
          <button type="button" className="botao botao--pequeno botao--perigo">
            Excluir
          </button>
        </div>
      </footer>
    </article>
  );
}

export default PostCard;