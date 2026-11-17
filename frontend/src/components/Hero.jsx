import Sticker from './Sticker.jsx';

function Hero() {
  return (
    <section className="hero" id="inicio">
      <span className="hero__nota">bem-vindo(a)!</span>
      <h1 className="hero__titulo">
        Tudo o que acontece no campus, num só lugar.
      </h1>
      <p className="hero__texto">
        Projetos com vagas abertas, eventos que estão chegando e avisos dos
        servidores, publicados por quem vive a instituição.
      </p>
      <a className="botao botao--escuro" href="#publicacoes">
        Ver publicações
      </a>

      <div className="hero__adesivos" aria-hidden="true">
        <span className="adesivo adesivo--anuncio">
          <Sticker nome="anuncio" tamanho={88} />
        </span>
        <span className="adesivo adesivo--projeto">
          <Sticker nome="projeto" tamanho={76} />
        </span>
        <span className="adesivo adesivo--evento">
          <Sticker nome="evento" tamanho={72} />
        </span>
        <span className="estrela">Vagas abertas!</span>
      </div>
    </section>
  );
}

export default Hero;