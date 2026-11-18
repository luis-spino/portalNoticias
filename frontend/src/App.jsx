import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';
import { filtrarPosts, listarTags } from './utils/filtrarPosts.js';
import { podePublicar, podeExcluirPost } from './utils/permissoes.js';
import { lerUsuarioSalvo, salvarUsuario, limparUsuario } from './utils/sessao.js';
import { cadastrarUsuario, entrarComId } from './servicos/usuarios.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Identificacao from './components/Identificacao.jsx';
import Filtros from './components/Filtros.jsx';
import PostCard from './components/PostCard.jsx';
import PostDetalhe from './components/PostDetalhe.jsx';
import PostForm from './components/PostForm.jsx';

function App() {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroAcao, setErroAcao] = useState('');
  const [postEmEdicao, setPostEmEdicao] = useState(null);
  const [postAbertoId, setPostAbertoId] = useState(null);
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);

  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [tagFiltro, setTagFiltro] = useState('');

  // RF01: carrega a lista uma vez, no primeiro render
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

  // RF05: filtros calculados a partir do estado, sem nova requisição
  const tagsDisponiveis = listarTags(posts);
  const tagAtiva = tagsDisponiveis.includes(tagFiltro) ? tagFiltro : '';
  const postsFiltrados = filtrarPosts(posts, {
    busca,
    tipo: tipoFiltro,
    tag: tagAtiva,
  });

  // Post aberto na visualização individual (se foi excluído, volta para a lista)
  const postDetalhe = posts.find((p) => p._id === postAbertoId);

  function limparFiltros() {
    setBusca('');
    setTipoFiltro('todos');
    setTagFiltro('');
  }

  function abrirPost(post) {
    setErroAcao('');
    setPostAbertoId(post._id);
    document.getElementById('publicacoes')?.scrollIntoView({ behavior: 'smooth' });
  }

  //identificação
  function definirUsuario(novo) {
    setUsuario(novo);
    salvarUsuario(novo);
    setErroAcao('');
  }

  async function cadastrar(dados) {
    definirUsuario(await cadastrarUsuario(dados));
  }

  async function entrar(id, tipo) {
    definirUsuario(await entrarComId(id, tipo));
  }

  function sair() {
    setUsuario(null);
    limparUsuario();
    setPostEmEdicao(null);
    setErroAcao('');
  }

  //cria ou edita, atualizando o estado sem novo GET
  async function salvarPost(dados) {
    setErroAcao('');
    const opcoes = { usuarioId: usuario._id };

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

  //exclui (DELETE) e tira o post do estado com filter
  async function excluirPost(post) {
    if (!podeExcluirPost(usuario, post)) {
      setErroAcao('Você não tem permissão para excluir esta publicação.');
      return;
    }
    if (!window.confirm(`Excluir "${post.titulo}"?`)) return;

    try {
      setErroAcao('');
      await apiDelete(`/posts/${post._id}`, { usuarioId: usuario._id });
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
          <aside className="lateral">
            <Identificacao
              usuario={usuario}
              onCadastrar={cadastrar}
              onEntrar={entrar}
              onSair={sair}
            />

            {podePublicar(usuario) ? (
              <PostForm
                postEmEdicao={postEmEdicao}
                onSalvar={salvarPost}
                onCancelar={() => setPostEmEdicao(null)}
              />
            ) : (
              <section className="formulario" id="publicar">
                <h2 className="secao__titulo">Publicar</h2>
                <p>
                  {usuario
                    ? 'Leitores podem comentar, mas só autores publicam.'
                    : 'Entre como autor para publicar.'}
                </p>
              </section>
            )}
          </aside>

          <section className="publicacoes" id="publicacoes">
            {postDetalhe ? (
              <PostDetalhe
                post={postDetalhe}
                usuario={usuario}
                onVoltar={() => setPostAbertoId(null)}
              />
            ) : (
              <>
                <h2 className="secao__titulo">Publicações</h2>

                <Filtros
                  busca={busca}
                  onBuscaChange={setBusca}
                  tipo={tipoFiltro}
                  onTipoChange={setTipoFiltro}
                  tags={tagsDisponiveis}
                  tagAtiva={tagAtiva}
                  onTagChange={setTagFiltro}
                  onLimpar={limparFiltros}
                />

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

                {!carregando &&
                  !erro &&
                  posts.length > 0 &&
                  postsFiltrados.length === 0 && (
                    <p className="estado">
                      Nenhuma publicação encontrada com esses filtros.
                    </p>
                  )}

                {!carregando && !erro && postsFiltrados.length > 0 && (
                  <>
                    <p className="contagem">
                      {postsFiltrados.length}{' '}
                      {postsFiltrados.length === 1 ? 'publicação' : 'publicações'}
                    </p>
                    <div className="grade">
                      {postsFiltrados.map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          usuario={usuario}
                          onAbrir={abrirPost}
                          onEditar={iniciarEdicao}
                          onExcluir={excluirPost}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
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