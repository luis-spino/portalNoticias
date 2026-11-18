# Portal de Notícias - Frontend

Trabalho prático de **PTAC4** (IFMS).

**Equipe:** Larissa Prado e Luis Gustavo

---

## Sumário

1. [Descrição do projeto](#1-descrição-do-projeto)
2. [Tema, recurso e opção de API](#2-tema-recurso-e-opção-de-api)
3. [Tecnologias](#3-tecnologias)
4. [Requisitos atendidos](#4-requisitos-atendidos)
5. [Base URL e diferenças em relação ao enunciado](#5-base-url-e-diferenças-em-relação-ao-enunciado)
6. [Campos e rotas](#6-campos-e-rotas)
7. [Documento real retornado pela API](#7-documento-real-retornado-pela-api)
8. [NoSQL vs SQL: documento, coleção e `_id`](#8-nosql-vs-sql-documento-coleção-e-_id)
9. [Como executar](#9-como-executar)
10. [Testes](#10-testes)
11. [Estrutura de pastas](#11-estrutura-de-pastas)
12. [Permissões refletidas na interface](#12-permissões-refletidas-na-interface)
13. [Limitações conhecidas](#13-limitações-conhecidas)

---

## 1. Descrição do projeto

Interface web (React) do **Portal de Notícias** institucional. Alunos representantes de sala e servidores publicam projetos com vagas abertas, eventos que estão se aproximando e anúncios gerais. Os leitores acompanham as publicações e participam pelos comentários, que podem ser moderados.

Este repositório contém o **frontend**. O backend (API REST em Express + MongoDB) fica na raiz do mesmo repositório e está descrito no README principal.

---

## 2. Tema, recurso e opção de API

- **Tema declarado:** Portal de notícias.
- **O que o aplicativo gerencia:** o aplicativo gerencia **publicações (posts)** de projetos, eventos e anúncios da instituição, consumindo o recurso **`/api/posts`** da API do portal.
- **Opção de API utilizada:** API própria da equipe (Express + MongoDB), desenvolvida na disciplina de Aplicações e Tecnologia para Aplicação Servidor. Não usa JSONPlaceholder.

---

## 3. Tecnologias

| Tecnologia | Uso |
|---|---|
| Vite | Servidor de desenvolvimento e build |
| React 18 | Interface, com componentes funcionais |
| Hooks `useState` e `useEffect` | Estado e carregamento de dados |
| `fetch` + `async/await` + `try/catch/finally` | Consumo da API (somente em `src/api.js`) |
| CSS puro | Estilo (arquivo `src/index.css`) |
| Vitest, React Testing Library, jest-dom e jsdom | Testes |

O `@testing-library/dom` também está instalado porque é dependência exigida pelo React Testing Library.

Não são usados Axios, Tailwind, Bootstrap, bibliotecas de interface nem biblioteca de rotas.

---

## 4. Requisitos atendidos

| Requisito | Onde está |
|---|---|
| **RF01** Listagem | `App.jsx`: `useEffect` com `AbortController` (erro `AbortError` filtrado), estados de carregando, erro e vazio, cartões em `PostCard.jsx` |
| **RF02** Cadastro | `PostForm.jsx` (formulário controlado) + `salvarPost` em `App.jsx`: POST, limpa o formulário e atualiza a lista pelo estado, sem novo GET |
| **RF03** Edição | Botão Editar, formulário preenchido, PUT e atualização com `map`; botão Cancelar edição |
| **RF04** Exclusão | Botão Excluir, DELETE e atualização com `filter`; resposta sem corpo tratada em `api.js` |
| **RF05** Busca | `utils/filtrarPosts.js` (função pura) usada em `App.jsx`, sem nova requisição; também filtra por tipo e tag |
| **RF06** Validação | `utils/validarPost.js` e `utils/tags.js`: mensagens no formulário e nenhuma chamada à API quando inválido |
| **RF07** Helper de API | `src/api.js`: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, base URL, `response.ok`, erros e mensagens por status. Nenhum `fetch` fora desse arquivo |
| **RF08** Testes unitários | `src/utils/*.test.js` (Vitest, com `toThrow`) |
| **RF09** Testes de componentes | `PostCard.test.jsx` e `PostForm.test.jsx` (React Testing Library, sem chamadas reais à API) |
| **RF10** README | Este arquivo |

Além do CRUD de posts, o portal tem: cadastro e entrada de usuários, página individual do post, comentários e moderação de comentários.

O layout tem cabeçalho, formulário (lateral) e lista de publicações.

---

## 5. Base URL e diferenças em relação ao enunciado

**Base URL no frontend:** `/api`

Em desenvolvimento, o Vite repassa (proxy) as chamadas `/api` para `http://localhost:3000` (configurado em `vite.config.js`). Isso evita o bloqueio de CORS, já que o frontend roda na porta 5173 e a API na 3000.

O enunciado descreve um formato de API diferente do que o nosso backend usa:

| Ponto | Enunciado | Nosso backend | O que o frontend faz |
|---|---|---|---|
| Prefixo das rotas | `/api/v1` | `/api` | Base URL `/api` |
| Listagem | `{ data, meta }` | Array direto | Aceita os dois formatos: `Array.isArray(resposta) ? resposta : resposta.data` |
| Erros | `{ type, message }` | `{ "erro": "mensagem" }` | O helper lê o campo `erro` e usa uma mensagem por status quando ele não existe |
| Resposta do DELETE | Pode vir sem corpo | `{ "mensagem": "..." }` | O helper lê o corpo como texto e devolve `null` se vier vazio |
| Identificação | Não prevista | Header `x-usuario-id` | O helper envia o header quando recebe `usuarioId` |

---

## 6. Campos e rotas

### Campos de um post (recurso `posts`)

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | string (ObjectId) | Identificador gerado pelo MongoDB |
| `titulo` | string | Título da publicação |
| `conteudo` | string | Texto da publicação |
| `tipo` | string | Categoria: `projeto`, `evento` ou `anuncio` |
| `tags` | lista de strings | Em minúsculas e sem repetição |
| `autorId` | string | `_id` do autor |
| `autor` | objeto | `{ _id, nome, papel }`, com ✔ no nome se for servidor |
| `criadoEm` | string (data ISO) | Data de criação |
| `atualizadoEm` | string (data ISO) | Data da última edição |

### Rotas usadas pelo frontend

Base: `/api`. Rotas marcadas com **header** exigem `x-usuario-id: <_id do usuário>`.

| Método | Rota | Header | Uso na interface | Sucesso |
|---|---|---|---|---|
| GET | `/posts` | não | Listagem (RF01) | 200, array |
| POST | `/posts` | sim | Cadastro (RF02) | 201, o post criado |
| PUT | `/posts/:id` | sim | Edição (RF03) | 200, o post atualizado |
| DELETE | `/posts/:id` | sim | Exclusão (RF04) | 200, `{ mensagem }` |
| POST | `/autores` | não | Cadastro de representante ou servidor | 201 |
| GET | `/autores/:id` | não | Entrar como autor | 200 |
| POST | `/leitores` | não | Cadastro de leitor | 201 |
| GET | `/posts/:postId/comentarios` | não | Comentários visíveis | 200, array |
| GET | `/posts/:postId/comentarios/todos` | sim | Comentários, inclusive ocultos (moderação) | 200, array |
| POST | `/posts/:postId/comentarios` | sim | Comentar | 201 |
| PATCH | `/comentarios/:id/moderar` | sim | Ocultar ou reexibir | 200 |
| DELETE | `/comentarios/:id` | sim | Excluir comentário | 200 |

Erros (formato `{ "erro": "..." }`): `400` dados inválidos, `401` não identificado, `403` sem permissão, `404` não encontrado, `409` duplicado, `429` limite semanal de posts, `500` erro do servidor.

---

## 7. Documento real retornado pela API

Documento retornado por `GET /api/posts` (um item da lista):

```json
SUBSTITUIR PELO JSON REAL DO PASSO 1
```

---

## 8. NoSQL vs SQL: documento, coleção e `_id`

No MongoDB, a unidade básica de armazenamento é o **documento**: um objeto parecido com JSON (guardado internamente em BSON) que reúne todos os dados de um item. Um post, por exemplo, é um único documento que já carrega a lista de `tags` dentro dele, sem precisar de uma tabela extra.

Os documentos são agrupados em **coleções** (`posts`, `autores`, `leitores` e `comentarios`), que fazem o papel das tabelas do SQL, mas **sem esquema fixo**: o banco não obriga todos os documentos a terem as mesmas colunas. A estrutura, portanto, é garantida pelo nosso código (models e services) e não pelo banco.

Outra diferença é o identificador. Em bancos SQL e no JSONPlaceholder, o `id` é um número sequencial (1, 2, 3...), previsível e gerado por um contador. No MongoDB, o `_id` é um `ObjectId`: um valor de 12 bytes exibido como texto de 24 caracteres hexadecimais (por exemplo, `6af677e156d52739654f9e54`), gerado automaticamente na inserção, único e que embute a data de criação. Na API ele chega ao frontend como **string**, por isso usamos `post._id` (e não `post.id`) como `key` no React e nas rotas (`/posts/:id`).

Por fim, sem `JOIN` obrigatório, a relação entre post e autor é uma referência (`autorId`) que o backend resolve e devolve como o objeto `autor`. Regras como apagar os posts de um autor excluído ficam no código do service, e não em uma chave estrangeira do banco.

---

## 9. Como executar

### Pré-requisitos

Node.js 18.11 ou superior, Docker e o repositório clonado.

### 1) API (na raiz do repositório)

```bash
cp .env.example .env     # primeira vez
npm install              # primeira vez
npm run db:up            # sobe o MongoDB (Docker)
npm run dev              # API em http://localhost:3000
```

Mais detalhes no README da raiz.

### 2) Frontend (em outro terminal)

```bash
cd frontend
npm install              # primeira vez
npm run dev              # http://localhost:5173
```

No Codespaces, abra pela aba **Portas**, na porta **5173**.

### 3) Build de produção

```bash
cd frontend
npm run build            # gera a pasta dist
npm run preview          # opcional: serve o build
```

---

## 10. Testes

```bash
cd frontend
npm test                 # roda todos os testes uma vez (Vitest)
npm run test:watch       # modo contínuo, durante o desenvolvimento
```

**Testes unitários (RF08)**, em `src/utils/`, para funções puras: `filtrarPosts` e `listarTags` (busca, tipo, tag e `toThrow` para entrada inválida), `validarPost`, `converterTags` (com `toThrow`), `permissoes`, `validarCadastro` e `validarIdUsuario`, `validarComentario` e `formatarData`.

**Testes de componentes (RF09)**, em `src/components/`, com React Testing Library (`render`, `screen` e `fireEvent`):

- `PostCard`: mostra os dados do post e exibe os botões Editar e Excluir conforme a permissão de quem está usando.
- `PostForm`: mostra as mensagens de validação quando enviado vazio, envia os dados normalizados, preenche o formulário na edição e exibe o erro devolvido pela API.

Os componentes testados não dependem da API: o `onSalvar` é uma função simulada.

---

## 11. Estrutura de pastas

```
frontend/
├── index.html
├── package.json
├── vite.config.js           (proxy /api e configuração do Vitest)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── api.js               (único lugar com fetch)
    ├── index.css
    ├── setupTests.js
    ├── components/          (Header, Hero, Identificacao, Filtros, PostCard,
    │                         PostDetalhe, PostForm, Comentarios, Sticker + testes)
    ├── servicos/
    │   └── usuarios.js      (cadastro e entrada de usuários)
    └── utils/               (filtrarPosts, validarPost, tags, permissoes,
                              validarUsuario, validarComentario, formatar,
                              sessao + testes)
```

---

## 12. Permissões refletidas na interface

A interface espelha as regras do backend (que também as valida):

| Ação | Visitante | Leitor | Representante | Servidor |
|---|---|---|---|---|
| Ver publicações e comentários | sim | sim | sim | sim |
| Comentar | não | sim | sim | sim |
| Publicar | não | não | sim (2 por semana) | sim (sem limite) |
| Editar post | não | não | só o próprio | só o próprio |
| Excluir post | não | não | só o próprio | qualquer um |
| Moderar comentários | não | não | nos próprios posts | em qualquer post |
| Excluir comentário | não | só o próprio | o próprio ou nos próprios posts | qualquer um |

---

## 13. Limitações conhecidas

- **Sem login com senha:** a identificação é pelo `_id` do usuário (header `x-usuario-id`), guardado no `localStorage`. Foi uma escolha para manter o escopo do conteúdo visto em aula.
- **Entrada de leitor:** o backend não tem rota para consultar um leitor por ID, então o ID do leitor só é verificado quando ele faz uma ação, como comentar.
- **Cadastro de servidor:** o backend não exige código ou aprovação, então qualquer pessoa pode se cadastrar como servidor.
- **Sem biblioteca de rotas:** a página do post é um estado do `App`, e o botão Voltar do navegador não retorna da página do post para a lista (usa-se o botão "Voltar" da própria tela).
- **Sem paginação:** a API devolve todos os posts.