import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Filtros from './components/Filtros.jsx';
import PostCard from './components/PostCard.jsx';
import PostForm from './components/PostForm.jsx';

const POSTS_EXEMPLO = [
  {
    _id: '1',
    titulo: 'Vagas no projeto de robótica',
    conteudo: 'O laboratório está com 5 vagas abertas para alunos do 2º e 3º anos.',
    tipo: 'projeto',
    tags: ['robotica', 'estagio'],
    autor: { nome: 'Larissa', papel: 'representante' },
    criadoEm: '2026-11-10T14:00:00.000Z',
  },
  {
    _id: '2',
    titulo: 'Feira de Ciências 2026',
    conteudo: 'A feira acontece no dia 20, no ginásio, a partir das 9h.',
    tipo: 'evento',
    tags: ['feira', 'ciencias', 'estagio'],
    autor: { nome: 'Prof. Carlos ✔', papel: 'servidor' },
    criadoEm: '2026-11-12T09:30:00.000Z',
  },
  {
    _id: '3',
    titulo: 'Reunião de pais na sexta',
    conteudo: 'Reunião geral na sexta-feira, às 19h, no auditório.',
    tipo: 'anuncio',
    tags: ['reuniao'],
    autor: { nome: 'Prof. Carlos ✔', papel: 'servidor' },
    criadoEm: '2026-11-13T18:00:00.000Z',
  },
];

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Hero />

        <div className="layout">
          <PostForm />

          <section className="publicacoes" id="publicacoes">
            <h2 className="secao__titulo">Publicações</h2>
            <Filtros />
            <div className="grade">
              {POSTS_EXEMPLO.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="rodape">
        <p>Portal de Notícias · Projeto de PTAC4 · IFMS</p>
      </footer>
    </>
  );
}

export default App;