import { useEffect, useState } from 'react';
import { apiGet } from './api.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Filtros from './components/Filtros.jsx';
import PostCard from './components/PostCard.jsx';
import PostForm from './components/PostForm.jsx';

function App() {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function carregarPosts() {
      try {
        setErro('');
        const resposta = await apiGet('/posts', { signal: controller.signal });
        // nossa API devolve o array direto; se vier { data, meta }, usa data
        setPosts(Array.isArray(resposta) ? resposta : (resposta.data ?? []));
      } catch (e) {
        if (e.name === 'AbortError') return;
        setErro(e.message);
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregarPosts();

    return () => controller.abort();
  }, []);

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

            {carregando && <p className="estado">Carregando publicações...</p>}

            {!carregando && erro && (
              <p className="estado estado--erro" role="alert">
                {erro}
              </p>
            )}

            {!carregando && !erro && posts.length === 0 && (
              <p className="estado">
                Nenhuma publicação ainda. Seja o primeiro a publicar!
              </p>
            )}

            {!carregando && !erro && posts.length > 0 && (
              <div className="grade">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
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