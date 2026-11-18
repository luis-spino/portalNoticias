import { useEffect, useState } from 'react';
import { validarPost } from '../utils/validarPost.js';
import { converterTags, tagsParaTexto } from '../utils/tags.js';

const CAMPOS_VAZIOS = { titulo: '', tipo: 'projeto', conteudo: '', tags: '' };

function PostForm({
  postEmEdicao = null,
  usuarioId = '',
  onUsuarioIdChange = () => {},
  onSalvar,
  onCancelar = () => {},
}) {
  const [campos, setCampos] = useState(CAMPOS_VAZIOS);
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  const editando = Boolean(postEmEdicao);

  // Quando clica em "Editar" (ou cancela), o formulário é preenchido ou limpo
  useEffect(() => {
    if (postEmEdicao) {
      setCampos({
        titulo: postEmEdicao.titulo,
        tipo: postEmEdicao.tipo,
        conteudo: postEmEdicao.conteudo,
        tags: tagsParaTexto(postEmEdicao.tags),
      });
    } else {
      setCampos(CAMPOS_VAZIOS);
    }
    setErros({});
    setErroApi('');
  }, [postEmEdicao]);

  function aoMudar(evento) {
    const { name, value } = evento.target;
    setCampos({ ...campos, [name]: value });
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    const novosErros = validarPost(campos);
    if (!usuarioId.trim()) novosErros.usuarioId = 'Informe o seu ID de autor.';
    setErros(novosErros);
    setErroApi('');

    // Validação falhou, ele não chama a API
    if (Object.keys(novosErros).length > 0) return;

    const dados = {
      titulo: campos.titulo.trim(),
      conteudo: campos.conteudo.trim(),
      tipo: campos.tipo,
      tags: converterTags(campos.tags),
    };

    try {
      setEnviando(true);
      await onSalvar(dados);
      setCampos(CAMPOS_VAZIOS);
    } catch (e) {
      setErroApi(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="formulario" id="publicar">
      <h2 className="secao__titulo">
        {editando ? 'Editar publicação' : 'Publicar'}
      </h2>

      <form onSubmit={aoEnviar} noValidate>
        <div className="campo">
          <label htmlFor="usuarioId">Seu ID de autor</label>
          <input
            id="usuarioId"
            type="text"
            value={usuarioId}
            onChange={(e) => onUsuarioIdChange(e.target.value)}
            placeholder="Cole aqui o _id do autor"
          />
          <small>Provisório: na Etapa 6 isso vira identificação de verdade.</small>
          {erros.usuarioId && <small className="erro-campo">{erros.usuarioId}</small>}
        </div>

        <div className="campo">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={campos.titulo}
            onChange={aoMudar}
            placeholder="Ex.: Vagas no projeto de robótica"
          />
          {erros.titulo && <small className="erro-campo">{erros.titulo}</small>}
        </div>

        <div className="campo">
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" value={campos.tipo} onChange={aoMudar}>
            <option value="projeto">Projeto com vagas</option>
            <option value="evento">Evento</option>
            <option value="anuncio">Anúncio</option>
          </select>
          {erros.tipo && <small className="erro-campo">{erros.tipo}</small>}
        </div>

        <div className="campo">
          <label htmlFor="conteudo">Conteúdo</label>
          <textarea
            id="conteudo"
            name="conteudo"
            rows="5"
            value={campos.conteudo}
            onChange={aoMudar}
            placeholder="Conte os detalhes da publicação"
          />
          {erros.conteudo && <small className="erro-campo">{erros.conteudo}</small>}
        </div>

        <div className="campo">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={campos.tags}
            onChange={aoMudar}
            placeholder="robotica, estagio"
          />
          <small>Separe as tags por vírgula.</small>
        </div>

        {erroApi && (
          <p className="aviso-erro" role="alert">
            {erroApi}
          </p>
        )}

        <div className="formulario__acoes">
          <button type="submit" className="botao botao--primario" disabled={enviando}>
            {enviando ? 'Enviando...' : editando ? 'Salvar alterações' : 'Publicar'}
          </button>
          {editando && (
            <button type="button" className="botao" onClick={onCancelar}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default PostForm;