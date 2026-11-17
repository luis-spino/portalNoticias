function PostForm() {
  return (
    <section className="formulario" id="publicar">
      <h2 className="secao__titulo">Publicar</h2>

      <form onSubmit={(evento) => evento.preventDefault()}>
        <label className="campo">
          <span>Título</span>
          <input type="text" placeholder="Ex.: Vagas no projeto de robótica" />
        </label>

        <label className="campo">
          <span>Tipo</span>
          <select defaultValue="projeto">
            <option value="projeto">Projeto com vagas</option>
            <option value="evento">Evento</option>
            <option value="anuncio">Anúncio</option>
          </select>
        </label>

        <label className="campo">
          <span>Conteúdo</span>
          <textarea rows="5" placeholder="Conte os detalhes da publicação" />
        </label>

        <label className="campo">
          <span>Tags</span>
          <input type="text" placeholder="robotica, estagio" />
          <small>Separe as tags por vírgula.</small>
        </label>

        <button type="submit" className="botao botao--primario">
          Publicar
        </button>
      </form>
    </section>
  );
}

export default PostForm;