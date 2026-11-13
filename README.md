# Portal de Notícias - Backend

Projeto da disciplina **Aplicações e Tecnologia para Aplicação Servidor**.

**Equipe:** Larissa Prado e Luis Gustavo

---

## Sumário

1. [Sobre o projeto](#1-sobre-o-projeto)
2. [Tecnologias](#2-tecnologias)
3. [Conteúdos da disciplina aplicados](#3-conteúdos-da-disciplina-aplicados)
4. [Arquitetura](#4-arquitetura)
5. [Estrutura de pastas](#5-estrutura-de-pastas)
6. [Entidades e banco de dados](#6-entidades-e-banco-de-dados)
7. [Regras de negócio](#7-regras-de-negócio)
8. [Autenticação e permissões](#8-autenticação-e-permissões)
9. [Middlewares](#9-middlewares)
10. [Como rodar o projeto](#10-como-rodar-o-projeto)
11. [Endpoints](#11-endpoints)
12. [Formato das respostas e códigos de status](#12-formato-das-respostas-e-códigos-de-status)
13. [Como testar no Postman](#13-como-testar-no-postman)
14. [Limitações conhecidas](#14-limitações-conhecidas)

---

## 1. Sobre o projeto

**Tema:** Portal de notícias.

**Problema:** oferecer um portal para a postagem de notícias por alunos e servidores da instituição. As postagens são de três tipos:

- **Projetos com vagas abertas**
- **Eventos que estão se aproximando**
- **Anúncios gerais dos servidores**

**Casos de uso:** publicar posts, editar posts, moderar comentários e buscar posts por tag.

**Escopo desta entrega:** somente o **backend** (API REST em JSON), que pode ser testada integralmente pelo Postman.

---

## 2. Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 18.11 ou superior | Ambiente de execução (ES Modules) |
| Express.js | ^5.3.0 | Servidor HTTP, rotas e middlewares |
| MongoDB | 7 (imagem Docker `mongo:7`) | Banco de dados não relacional orientado a documentos |
| `mongodb` (driver oficial) | ^7.9.0 | Conexão e consultas (`MongoClient`) |
| dotenv | ^18.0.10 | Variáveis de ambiente |
| Docker | - | Execução do MongoDB |
| Postman | - | Testes da API |

O projeto usa ES Modules (`"type": "module"` no `package.json`), com `import`/`export`. O script `npm run dev` usa `node --watch`, que reinicia o servidor ao salvar um arquivo.

---

## 3. Conteúdos da disciplina aplicados

| Conteúdo | Onde aparece no projeto |
|---|---|
| Servidor HTTP | `server.js` sobe o servidor na porta definida no `.env`; os status codes (200, 201, 400, 401, 403, 404, 409, 429) e as respostas em JSON seguem o padrão visto em aula |
| Express.js | Rotas por método e URL, `req.params`, `req.query`, `req.body`, `req.headers` |
| Middlewares | `express.json()`, `express.Router()`, middlewares próprios globais e por rota, array de middlewares em ordem e middleware de erro |
| Padrões de projeto | MVC adaptado para API, com camada de Service (Routes -> Controllers -> Services -> Models) |
| MongoDB | Driver `mongodb` com `MongoClient`, `db()`, `collection()`, quatro coleções, índices e variáveis de ambiente |

---

## 4. Arquitetura

O projeto segue o padrão **MVC adaptado a APIs**, em que a View é substituída pela resposta em JSON, com uma camada de **Service** entre o Controller e o Model.

```
Requisição -> Rota -> [Middlewares] -> Controller -> Service -> Model -> MongoDB
```

| Camada | Pasta | Responsabilidade | Não faz |
|---|---|---|---|
| Rotas | `src/routes/` | Liga método + URL aos middlewares e ao controller | Regra de negócio |
| Middlewares | `src/middlewares/` | Log, identificação do usuário, permissão, validação do corpo e tratamento de erros | Acessar regras de domínio |
| Controllers | `src/controllers/` | Lê o `req`, chama o service e monta a resposta (status + JSON) | Acessar o banco ou conter regra de negócio |
| Services | `src/services/` | Regras de negócio e validações de domínio | Conhecer `req` e `res` |
| Models | `src/models/` | Acesso ao banco, uma coleção por model | Conter regra de negócio |

Pontos importantes:

- `server.js` apenas conecta ao banco e chama `listen`. O `src/app.js` configura o Express, os middlewares e as rotas.
- Os erros são lançados pelos services com a classe `AppError` (mensagem + status) e tratados em um único lugar, o middleware `errorHandler`. O Express 5 encaminha automaticamente para ele os erros de funções `async`, por isso os controllers não precisam de `try/catch`.
- O `MongoClient` é criado uma única vez em `src/config/db.js` e reutilizado por todos os models por meio de `getDb()`.

---

## 5. Estrutura de pastas

```
portalNoticias/
├── server.js                      Conecta ao banco, cria os índices e sobe o servidor
├── package.json
├── .env                           Variáveis de ambiente (não versionado)
├── .env.example                   Modelo do .env
├── .gitignore
├── README.md
└── src/
    ├── app.js                     Configura o Express, middlewares globais e rotas
    ├── config/
    │   ├── db.js                  MongoClient, conectarBanco() e getDb()
    │   └── indices.js             Criação dos índices das coleções
    ├── routes/
    │   ├── autorRoutes.js
    │   ├── postRoutes.js
    │   ├── leitorRoutes.js
    │   └── comentarioRoutes.js
    ├── middlewares/
    │   ├── logger.js              Log de cada requisição (global)
    │   ├── autenticar.js          Identifica o usuário pelo header x-usuario-id
    │   ├── permissoes.js          somenteAutores
    │   ├── validarCampos.js       Confere campos obrigatórios do body
    │   └── errorHandler.js        Tratamento centralizado de erros
    ├── controllers/
    │   ├── autorController.js
    │   ├── postController.js
    │   ├── leitorController.js
    │   └── comentarioController.js
    ├── services/
    │   ├── autorService.js
    │   ├── postService.js
    │   ├── leitorService.js
    │   └── comentarioService.js
    ├── models/
    │   ├── autorModel.js
    │   ├── postModel.js
    │   ├── leitorModel.js
    │   └── comentarioModel.js
    └── utils/
        ├── AppError.js            Erro com mensagem e status HTTP
        └── datas.js               inicioDaSemana()
```

---

## 6. Entidades e banco de dados

Banco: `portal_noticias`. Quatro coleções:

### Coleção `autores`

Quem pode publicar posts. Há dois papéis: `representante` (aluno representante de uma sala) e `servidor`.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador |
| `nome` | string | Nome do autor |
| `email` | string | Único, salvo em minúsculas |
| `papel` | string | `representante` ou `servidor` |
| `sala` | string ou null | Obrigatória para representante; `null` para servidor |
| `verificado` | boolean | `true` para servidor, `false` para representante |
| `criadoEm` | Date | Data de criação |
| `atualizadoEm` | Date | Data da última edição |

Nas respostas, o autor também traz `nomeExibicao`, que é o nome com o selo de verificado para servidores (ex.: `Prof. Carlos ✔`).

### Coleção `leitores`

Quem só pode comentar.

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador |
| `nome` | string | Nome do leitor |
| `email` | string | Único, salvo em minúsculas |
| `criadoEm` | Date | Data de criação |

### Coleção `posts`

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador |
| `titulo` | string | Título |
| `conteudo` | string | Texto do post |
| `tipo` | string | Categoria: `projeto`, `evento` ou `anuncio` |
| `tags` | array de string | Em minúsculas, sem espaços nas pontas e sem repetição |
| `autorId` | ObjectId | Referência ao autor |
| `criadoEm` | Date | Data de criação |
| `atualizadoEm` | Date | Data da última edição |

Nas respostas, o post traz também o objeto `autor` com `_id`, `nome` (com ✔ se for servidor) e `papel`.

### Coleção `comentarios`

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador |
| `postId` | ObjectId | Referência ao post |
| `usuarioId` | ObjectId | Quem comentou (leitor ou autor) |
| `usuarioTipo` | string | `leitor` ou `autor` |
| `usuarioNome` | string | Nome de quem comentou (com ✔ se for servidor) |
| `texto` | string | Até 500 caracteres |
| `status` | string | `visivel` ou `oculto` |
| `criadoEm` | Date | Data de criação |

### Índices (criados na inicialização do servidor)

| Coleção | Índice | Motivo |
|---|---|---|
| `autores` | `email` (único) | Impede e-mail repetido |
| `leitores` | `email` (único) | Impede e-mail repetido |
| `posts` | `tags` | Acelera a busca por tag |
| `comentarios` | `postId` | Acelera a listagem de comentários de um post |

### Categorias e tags

- A **categoria** do post é o campo `tipo` (`projeto`, `evento`, `anuncio`).
- As **tags** são livres, enviadas em lista (`["robotica", "estagio"]`), e servem para a busca.

---

## 7. Regras de negócio

**Autores e papéis**

- Cada sala tem **um único aluno representante**. Cadastrar um segundo representante na mesma sala retorna `409`.
- O representante precisa informar a `sala` no cadastro.
- O **servidor** é sempre `verificado` e seu nome aparece com o selo ✔.
- O `papel` não pode ser alterado depois do cadastro (evita um aluno virar servidor por edição).
- O e-mail é único entre os autores e também entre os leitores.

**Publicação**

- O **representante** pode publicar no máximo **2 posts por semana**. A semana começa na **segunda-feira às 00:00**. Ao tentar o 3º post, a API retorna `429`.
- O **servidor** publica sem limite.
- Os **leitores** (demais alunos) **não publicam**: só podem comentar.
- O autor do post é sempre quem está identificado no header; um `autorId` enviado no body é ignorado.

**Edição e exclusão**

- Cada autor só edita o **próprio cadastro** e os **próprios posts**.
- **Excluir post:** o próprio autor ou qualquer servidor (moderação).
- **Excluir cadastro de autor:** o próprio autor ou qualquer servidor. Ao excluir um autor, os posts dele também são excluídos.

**Comentários e moderação**

- Qualquer usuário identificado (leitor ou autor) pode comentar em qualquer post.
- O comentário não pode ser vazio e tem no máximo 500 caracteres.
- **Moderadores:** o autor do post e qualquer servidor. Eles podem ocultar e reexibir comentários, ver os comentários ocultos e excluir comentários.
- Comentário **oculto** não aparece na listagem pública, mas continua no banco e pode ser reexibido.
- Quem escreveu o comentário também pode excluí-lo.

**Busca**

- A busca por tag não diferencia maiúsculas de minúsculas.
- Os filtros `tag` e `tipo` podem ser combinados.
- Posts são listados do mais novo para o mais antigo; comentários, do mais antigo para o mais novo.

---

## 8. Autenticação e permissões

Não há login com senha. A identificação é simplificada: quem faz a requisição informa o `_id` do seu autor ou leitor no header:

```
x-usuario-id: <_id do autor ou do leitor>
```

O middleware `autenticar` procura esse `_id` primeiro em `autores` e depois em `leitores`, e guarda o resultado em `req.usuario` (com `tipo` e `papel`).

- Header ausente: `401`.
- Id com formato inválido: `400` (`ID inválido`).
- Id que não existe: `401`.

**Resumo de permissões**

| Ação | Leitor | Representante | Servidor |
|---|---|---|---|
| Ler posts, autores e comentários visíveis | sim | sim | sim |
| Comentar | sim | sim | sim |
| Publicar post | não | sim (2 por semana) | sim (sem limite) |
| Editar post | não | só o próprio | só o próprio |
| Excluir post | não | só o próprio | qualquer um |
| Editar cadastro de autor | não | só o próprio | só o próprio |
| Excluir cadastro de autor | não | só o próprio | qualquer um |
| Moderar comentários | não | só nos próprios posts | em qualquer post |
| Excluir comentário | só o próprio | o próprio ou nos próprios posts | qualquer um |

---

## 9. Middlewares

| Middleware | Escopo | O que faz |
|---|---|---|
| `express.json()` | Global | Lê o corpo das requisições em JSON |
| `logger` | Global | Registra no terminal método, URL, status e tempo de cada requisição |
| `autenticar` | Por rota | Identifica o usuário pelo header `x-usuario-id` |
| `somenteAutores` | Por rota | Bloqueia leitores (`403`) |
| `validarCampos(...)` | Por rota | Confere os campos obrigatórios do body (`400`) |
| `errorHandler` | Global (último) | Converte qualquer erro em uma resposta JSON com o status correto |

Nas rotas protegidas, os middlewares são passados como **array em ordem**, formando o pipeline: **autenticação -> permissão -> validação -> controller**.

Exemplo (`src/routes/postRoutes.js`):

```js
router.post(
  '/',
  [autenticar, somenteAutores, validarCampos('titulo', 'conteudo', 'tipo')],
  PostController.criar
);
```

Exemplo de linha de log:

```
2026-11-13T14:09:48.799Z POST /api/posts -> 201 (25ms)
```

---

## 10. Como rodar o projeto

### Pré-requisitos

- Node.js 18.11 ou superior
- Docker
- Postman

### Passo a passo

**1. Clonar o repositório e entrar na pasta**

```bash
git clone <url-do-repositorio>
cd portalNoticias
```

**2. Subir o MongoDB com Docker**

```bash
docker run -d --name mongo-portal -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=senha_dev_123 \
  mongo:7
```

Confira com `docker ps`. Se o container já existir e estiver parado: `docker start mongo-portal`.

**3. Criar o arquivo `.env` na raiz** (copie do `.env.example`)

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta do servidor (padrão 3000) |
| `MONGO_USER` | Usuário do MongoDB |
| `MONGO_PASSWORD` | Senha do MongoDB |
| `MONGO_DB` | Nome do banco |
| `MONGODB_URI` | String de conexão (`authSource=admin` é necessário) |

O `.env` não é versionado (está no `.gitignore`).

**4. Instalar as dependências**

```bash
npm install
```

**5. Iniciar o servidor**

```bash
npm run dev
```

(ou `npm start`, que não reinicia ao salvar). O terminal deve mostrar:

```
MongoDB conectado
Servidor rodando em http://localhost:3000
```

**6. Testar** com `GET http://localhost:3000/`, que responde:

```json
{ "api": "Portal de Notícias", "status": "ok" }
```

### Problemas comuns

| Erro | Causa provável |
|---|---|
| `ECONNREFUSED` | O container do MongoDB não está rodando (`docker ps`) |
| `Authentication failed` | Usuário/senha do `.env` diferentes do `docker run`, ou falta `?authSource=admin` na URI |
| `Cannot find package 'dotenv'` | Falta rodar `npm install` |
| Variáveis vazias / erro de URI | O `.env` não está na **raiz** do projeto |
| `404` em HTML no Postman | A rota não existe ou o arquivo não foi salvo (o servidor reinicia sozinho ao salvar) |

---

## 11. Endpoints

URL base: `http://localhost:3000`. Em requisições com corpo, use `Content-Type: application/json`. Identificação: header `x-usuario-id` quando a rota exigir.

### 11.1 Autores

| Método | Rota | Acesso |
|---|---|---|
| POST | `/api/autores` | Público (cadastro) |
| GET | `/api/autores` | Público |
| GET | `/api/autores/:id` | Público |
| PUT | `/api/autores/:id` | O próprio autor |
| DELETE | `/api/autores/:id` | O próprio autor ou servidor |

**POST `/api/autores`** - campos: `nome`, `email`, `papel` (`representante` ou `servidor`) e `sala` (obrigatória para representante).

```json
{ "nome": "Prof. Carlos", "email": "carlos@escola.br", "papel": "servidor" }
```

```json
{ "nome": "Larissa", "email": "larissa@aluno.br", "papel": "representante", "sala": "3A" }
```

Resposta `201`:

```json
{
  "_id": "6af677e156d52739654f9e54",
  "nome": "Prof. Carlos",
  "email": "carlos@escola.br",
  "papel": "servidor",
  "sala": null,
  "verificado": true,
  "criadoEm": "2026-11-13T14:00:00.000Z",
  "nomeExibicao": "Prof. Carlos ✔"
}
```

Erros: `400` (campos obrigatórios, papel inválido, representante sem sala), `409` (e-mail já cadastrado ou sala que já tem representante).

**PUT `/api/autores/:id`** - header obrigatório; só o próprio autor. Campos aceitos: `nome`, `email`, `sala` (a sala só vale para representante). O `papel` não muda.

```json
{ "nome": "Larissa Prado" }
```

Erros: `401` (sem header), `403` (não é o próprio cadastro), `404`, `409`, `400` (nenhum campo válido).

**DELETE `/api/autores/:id`** - header obrigatório; o próprio autor ou servidor. Remove também os posts do autor. Resposta `200`: `{ "mensagem": "Autor removido" }`.

### 11.2 Leitores

| Método | Rota | Acesso |
|---|---|---|
| POST | `/api/leitores` | Público (cadastro) |

```json
{ "nome": "Maria", "email": "maria@aluno.br" }
```

Resposta `201` com `_id`, `nome`, `email` e `criadoEm`. Erros: `400` (campos obrigatórios), `409` (e-mail já cadastrado).

### 11.3 Posts

| Método | Rota | Acesso |
|---|---|---|
| GET | `/api/posts` | Público |
| GET | `/api/posts?tag=estagio` | Público - busca por tag |
| GET | `/api/posts?tipo=evento` | Público - filtro por tipo |
| GET | `/api/posts?tag=estagio&tipo=projeto` | Público - filtros combinados |
| GET | `/api/posts/:id` | Público |
| POST | `/api/posts` | Autores (representante com limite semanal) |
| PUT | `/api/posts/:id` | O autor do post |
| DELETE | `/api/posts/:id` | O autor do post ou servidor |

**POST `/api/posts`** - header obrigatório (autor). Campos: `titulo`, `conteudo`, `tipo` (`projeto`, `evento` ou `anuncio`) e `tags` (lista, opcional). O autor vem do header.

```json
{
  "titulo": "Vagas no projeto de robótica",
  "conteudo": "Estamos com 5 vagas abertas.",
  "tipo": "projeto",
  "tags": ["robotica", "estagio"]
}
```

Resposta `201`:

```json
{
  "_id": "6af67a0b156d52739654f9f1",
  "titulo": "Vagas no projeto de robótica",
  "conteudo": "Estamos com 5 vagas abertas.",
  "tipo": "projeto",
  "tags": ["robotica", "estagio"],
  "autorId": "6af677e156d52739654f9e54",
  "criadoEm": "2026-11-13T14:10:00.000Z",
  "atualizadoEm": "2026-11-13T14:10:00.000Z",
  "autor": { "_id": "6af677e156d52739654f9e54", "nome": "Prof. Carlos ✔", "papel": "servidor" }
}
```

Erros: `401` (sem header ou usuário inexistente), `403` (leitor tentando publicar), `400` (campos obrigatórios, tipo inválido, `tags` que não é lista), `429` (representante acima de 2 posts na semana).

**GET `/api/posts`** - parâmetros opcionais de query: `tag` e `tipo`. Retorna uma lista (vazia se nada for encontrado), do mais novo para o mais antigo.

**PUT `/api/posts/:id`** - só o autor do post. Campos aceitos: `titulo`, `conteudo`, `tipo`, `tags`.

```json
{ "titulo": "Vagas abertas - robótica", "tags": ["robotica"] }
```

Erros: `403` (não é o autor), `404`, `400` (tipo inválido ou nenhum campo válido).

**DELETE `/api/posts/:id`** - o autor do post ou qualquer servidor. Resposta `200`: `{ "mensagem": "Post removido" }`.

### 11.4 Comentários

| Método | Rota | Acesso |
|---|---|---|
| GET | `/api/posts/:postId/comentarios` | Público (só os visíveis) |
| GET | `/api/posts/:postId/comentarios/todos` | Autor do post ou servidor (inclui ocultos) |
| POST | `/api/posts/:postId/comentarios` | Qualquer usuário identificado |
| PATCH | `/api/comentarios/:id/moderar` | Autor do post ou servidor |
| DELETE | `/api/comentarios/:id` | Quem comentou, autor do post ou servidor |

**POST `/api/posts/:postId/comentarios`** - header obrigatório (leitor ou autor).

```json
{ "texto": "Quero participar!" }
```

Resposta `201`:

```json
{
  "_id": "6af67b3c156d52739654fa02",
  "postId": "6af67a0b156d52739654f9f1",
  "usuarioId": "6af67ab0156d52739654f9fa",
  "usuarioTipo": "leitor",
  "usuarioNome": "Maria",
  "texto": "Quero participar!",
  "status": "visivel",
  "criadoEm": "2026-11-13T14:20:00.000Z"
}
```

Erros: `401`, `404` (post inexistente), `400` (texto vazio ou com mais de 500 caracteres).

**PATCH `/api/comentarios/:id/moderar`** - header obrigatório; só autores (o autor do post ou servidor).

```json
{ "status": "oculto" }
```

Valores aceitos: `visivel` ou `oculto`. Erros: `400` (status inválido), `403` (leitor ou autor de outro post), `404`.

**DELETE `/api/comentarios/:id`** - quem escreveu o comentário, o autor do post ou um servidor. Resposta `200`: `{ "mensagem": "Comentário removido" }`.

---

## 12. Formato das respostas e códigos de status

**Erros** seguem sempre o mesmo formato:

```json
{ "erro": "Limite de 2 posts por semana atingido" }
```

| Código | Significado | Exemplo |
|---|---|---|
| `200` | Sucesso | Listagem, edição, exclusão |
| `201` | Criado | Autor, leitor, post ou comentário cadastrado |
| `400` | Dados inválidos | Campo obrigatório faltando, tipo inválido, ID com formato inválido |
| `401` | Não identificado | Header `x-usuario-id` ausente ou usuário inexistente |
| `403` | Sem permissão | Leitor tentando publicar, editar post de outro autor |
| `404` | Não encontrado | Post, autor ou comentário inexistente; rota inexistente |
| `409` | Conflito | E-mail já cadastrado, sala que já tem representante |
| `429` | Limite excedido | Representante tentando o 3º post da semana |
| `500` | Erro interno | Erro inesperado (registrado no terminal) |

---

## 13. Como testar no Postman

### Requisição manual

1. Escolha o método (GET, POST, PUT, PATCH, DELETE) e digite a URL.
2. Em requisições com corpo (POST, PUT, PATCH): aba **Body** -> **raw** -> **JSON**, e cole o JSON.
3. Nas rotas protegidas: aba **Headers** -> chave `x-usuario-id` e valor igual ao `_id` do usuário.
4. Clique em **Send** e confira o status e o corpo da resposta.

### Roteiro sugerido (ordem)

1. Criar um **servidor** e um **representante** (`POST /api/autores`) e guardar os `_id`.
2. Criar um **leitor** (`POST /api/leitores`).
3. Publicar posts com o servidor e com o representante (`POST /api/posts`).
4. Publicar o 3º post do representante e conferir o `429`.
5. Buscar por tag e tipo (`GET /api/posts?tag=...&tipo=...`).
6. Comentar com o leitor, ocultar com o servidor ou com o autor do post e conferir a lista pública.
7. Testar as negativas: sem header (`401`), leitor publicando (`403`), editar post de outro (`403`).

### Para repetir os testes do zero

Os e-mails são únicos, então limpe as coleções antes de repetir (isso mantém os índices):

```bash
docker exec mongo-portal mongosh -u admin -p senha_dev_123 --authenticationDatabase admin portal_noticias \
  --eval "db.autores.deleteMany({}); db.leitores.deleteMany({}); db.posts.deleteMany({}); db.comentarios.deleteMany({})"
```

---

## 14. Limitações conhecidas

- **Identificação simplificada:** não há login com senha nem token; qualquer pessoa que conheça um `_id` pode usá-lo no header. Foi uma escolha para manter o escopo do conteúdo visto em aula.
- **Cota semanal:** o limite de 2 posts conta os posts que existem. Se o representante excluir um post, a vaga volta na mesma semana.
- **Comentários órfãos:** ao excluir um post ou um autor, os comentários dos posts removidos continuam no banco, mas deixam de ser acessíveis pela API.
- **Fuso horário:** o início da semana (segunda 00:00) usa o horário do servidor.
- **Sem paginação:** as listagens retornam todos os registros.
- **Somente backend:** o frontend será feito em uma etapa futura.