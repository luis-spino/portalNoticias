import Sticker from './Sticker.jsx';

const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'projeto', rotulo: 'Projetos' },
  { valor: 'evento', rotulo: 'Eventos' },
  { valor: 'anuncio', rotulo: 'Anúncios' },
];

function Filtros({
  busca = '',
  onBuscaChange = () => {},
  tipo = 'todos',
  onTipoChange = () => {},
  tags = [],
  tagAtiva = '',
  onTagChange = () => {},
  onLimpar = () => {},
}) {
  const temFiltro = busca !== '' || tipo !== 'todos' || tagAtiva !== '';

  return (
    <div className="barra">
      <div className="busca">
        <label htmlFor="busca" className="visualmente-oculto">
          Buscar publicações pelo título
        </label>
        <input
          id="busca"
          type="search"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          placeholder="Buscar pelo título..."
        />
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por tipo">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.valor}
            type="button"
            className={tipo === filtro.valor ? 'pilula pilula--ativa' : 'pilula'}
            aria-pressed={tipo === filtro.valor}
            onClick={() => onTipoChange(filtro.valor)}
          >
            {filtro.valor !== 'todos' && (
              <Sticker nome={filtro.valor} tamanho={22} />
            )}
            {filtro.rotulo}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="tags-filtro" role="group" aria-label="Filtrar por tag">
          <span>Tags:</span>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={
                tagAtiva === tag ? 'tag-filtro tag-filtro--ativa' : 'tag-filtro'
              }
              aria-pressed={tagAtiva === tag}
              onClick={() => onTagChange(tagAtiva === tag ? '' : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {temFiltro && (
        <button
          type="button"
          className="botao botao--pequeno"
          onClick={onLimpar}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

export default Filtros;