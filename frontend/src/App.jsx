import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Filtros from './components/Filtros.jsx';
import PostCard from './components/PostCard.jsx';
import PostForm from './components/PostForm.jsx';

function App() {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroAcao, setErroAcao] = useState('');
  const [postEmEdicao, setPostEmEdicao] = useState(null);
  const [usuarioId, setUsuarioId] = useState('');

  //carrega a lista uma vez, no primeiro render
  useEffect(() => {
    const controller = new AbortController();

    async function carregarPosts() {
      try {
        setErro('');
        const resposta = await apiGet('/posts', { signal: controller.signal });
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

  //cria ou edita, atualizando o estado sem novo GET
  async function salvarPost(dados) {
    setErroAcao('');
    const opcoes = { usuarioId: usuarioId.trim() };

    if (postEmEdicao) {
      const atualizado = await apiPut(`/posts/${postEmEdicao._id}`, dados, opcoes);
      setPosts((atuais) =>
        atuais.map((p) => (p._id === atualizado._id ? atualizado : p)),
      );
      setPostEmEdicao(null);
    } else {
      const novo = await apiPost('/posts', dados, opcoes);
      setPosts((atuais) => [novo, ...atuais]);
    }
  }

  function iniciarEdicao(post) {
    setErroAcao('');
    setPostEmEdicao(post);
    document.getElementById('publicar')?.scrollIntoView({ behavior: 'smooth' });
  }

  // exclui e tira o post do estado com filter
  async function excluirPost(post) {
    if (!usuarioId.trim()) {
      setErroAcao('Informe o seu ID de autor no formulário para excluir.');
      return;
    }
    if (!window.confirm(`Excluir "${post.titulo}"?`)) return;

    try {
      setErroAcao('');
      await apiDelete(`/posts/${post._id}`, { usuarioId: usuarioId.trim() });
      setPosts((atuais) => atuais.filter((p) => p._id !== post._id));
      if (postEmEdicao?._id === post._id) setPostEmEdicao(null);
    } catch (e) {
      setErroAcao(e.message);
    }
  }

  return (
    <>
      <Header />
      <main className="container">
        <Hero />

        <div className="layout">
          <PostForm
            postEmEdicao={postEmEdicao}
            usuarioId={usuarioId}
            onUsuarioIdChange={setUsuarioId}
            onSalvar={salvarPost}
            onCancelar={() => setPostEmEdicao(null)}
          />

          <section className="publicacoes" id="publicacoes">
            <h2 className="secao__titulo">Publicações</h2>
            <Filtros />

            {erroAcao && (
              <p className="estado estado--erro" role="alert">
                {erroAcao}
              </p>
            )}

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
                  <PostCard
                    key={post._id}
                    post={post}
                    onEditar={iniciarEdicao}
                    onExcluir={excluirPost}
                  />
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