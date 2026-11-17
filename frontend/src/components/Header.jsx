function Header() {
  return (
    <header className="cabecalho">
      <div className="cabecalho__conteudo">
        <a href="#inicio" className="logo">
          <span className="logo__marca">PN</span>
          <span className="logo__texto">Portal de Notícias</span>
        </a>
        <nav className="menu" aria-label="Principal">
          <a href="#inicio">Início</a>
          <a href="#publicacoes">Publicações</a>
          <a href="#publicar">Publicar</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;