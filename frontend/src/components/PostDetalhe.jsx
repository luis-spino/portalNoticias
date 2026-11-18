import Sticker from './Sticker.jsx';
import Comentarios from './Comentarios.jsx';
import { formatarData } from '../utils/formatar.js';

const ROTULOS = {
  projeto: 'Projeto',
  evento: 'Evento',
  anuncio: 'Anúncio',
};

function PostDetalhe({ post, usuario = null, onVoltar = () => {} }) {
  return (
    <article className={`detalhe detalhe--${post.tipo}`}>
      <button type="button" className="botao botao--pequeno" onClick={onVoltar}>
        ← Voltar às publicações
      </button>

      <div className="card__topo detalhe__topo">
        <Sticker nome={post.tipo} tamanho={52} />
        <span className="card__tipo">{ROTULOS[post.tipo]}</span>
      </div>

      <h2 className="detalhe__titulo">{post.titulo}</h2>

      <p className="detalhe__meta">
        Por <strong>{post.autor?.nome ?? 'Autor removido'}</strong> ·{' '}
        {formatarData(post.criadoEm)}
      </p>

      <p className="detalhe__texto">{post.conteudo}</p>

      <ul className="tags">
        {post.tags.map((tag) => (
          <li key={tag} className="tag">
            #{tag}
          </li>
        ))}
      </ul>

    <Comentarios post={post} usuario={usuario} />
    </article>
  );
}

export default PostDetalhe;