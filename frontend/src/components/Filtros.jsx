import Sticker from './Sticker.jsx';

const FILTROS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'projeto', rotulo: 'Projetos' },
  { valor: 'evento', rotulo: 'Eventos' },
  { valor: 'anuncio', rotulo: 'Anúncios' },
];

function Filtros() {
  return (
    <div className="barra">
      <div className="busca">
        <label htmlFor="busca" className="visualmente-oculto">
          Buscar publicações pelo título
        </label>
        <input id="busca" type="search" placeholder="Buscar pelo título..." />
      </div>

      <div className="filtros" role="group" aria-label="Filtrar por tipo">
        {FILTROS.map((filtro, indice) => (
          <button
            key={filtro.valor}
            type="button"
            className={indice === 0 ? 'pilula pilula--ativa' : 'pilula'}
          >
            {filtro.valor !== 'todos' && (
              <Sticker nome={filtro.valor} tamanho={22} />
            )}
            {filtro.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filtros;