# dti Digital - Technical Challenge (Online Order System)

Este repositório contém a avaliação prática para o Estágio DEV (Internship). É uma aplicação fullstack construída com um backend Node.js/Express  e um frontend React/Vite.

## 🗂️ Estrutura do Projeto

Este é um monorepo contendo duas aplicações separadas:

* `/backend`: A API REST Node.js (Express).
* `/frontend`: A aplicação cliente React (Vite).

Por favor, veja as instruções abaixo para rodar cada parte.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express, Sequelize, SQLite  164]
* **Frontend:** React (Vite), React Router, Framer Motion
* **Gerenciamento de Estado:** React Context API (para o Carrinho)
* **Estilização:** Tailwind CSS 
* **Notificações:** `react-hot-toast` 
* **Testes:** Jest, React Testing Library 

---

## 🚀 Como Rodar a Aplicação

(Esta é a seção que você já escreveu, está perfeita)

Você precisará de dois terminais separados para rodar este projeto.

### 1. Backend Setup (Node.js + Express)

O servidor backend é responsável por servir os dados do banco de dados SQLite.

1.  **Navegue até o backend:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Rode o Seeder do Banco de Dados (Uma Vez):**
    Isso irá criar o arquivo `db.sqlite3` em `/backend/database/` e populá-lo com os dados iniciais dos produtos.
    ```bash
    node src/seeders/seed.js
    ```

4.  **Rode o Servidor (Modo Dev):**
    Isso inicia o servidor em `http://localhost:3001` usando `nodemon`.
    ```bash
    npm run dev
    ```

#### ✅ Verificando o Backend

Para verificar se o backend está funcionando, abra seu navegador (ou um cliente de API) e vá para:
`http://localhost:3001/api/products`

Você deve ver um JSON array dos produtos (hambúrgueres, batatas, etc.).

---

### 2. Frontend Setup (React + Vite)

A aplicação frontend é o que o usuário vê. Ela consome a API do backend.

1.  **Abra um novo terminal.**
2.  **Navegue até o frontend:**
    ```bash
    cd frontend
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Rode o Cliente (Modo Dev):**
    Isso inicia o app React em `http://localhost:5173`.
    ```bash
    npm run dev
    ```

#### ✅ Verificando o Frontend

Abra seu navegador e vá para `http://localhost:5173`. Você deve ver a página principal do e-commerce com os produtos carregados.

---

## 🌟 Features Implementadas (Diferenciais)

Além dos requisitos mínimos, este projeto implementa vários dos "diferenciais" opcionais  para demonstrar qualidade de código e uma arquitetura robusta.

### Funcional
- [x] **Filtros e Busca de Produtos:** A `HomePage` inclui filtros funcionais de busca por nome e preço máximo, com *debounce* para performance.
- [x] **Feedback (Toasts):** Ações do usuário (como adicionar ao carrinho, finalizar pedido, erros) disparam notificações amigáveis usando `react-hot-toast`.
- [x] **Paginação:** A `HomePage` inclui um componente de paginação completo.
- [ ] *Persistência no LocalStorage:* (Não implementado, pois o `CartContext` foi projetado para carregar o carrinho da API).

### Técnico
- [x] **Componentização e Reutilização (DRY):** O código foi extensivamente refatorado. Lógica de UI repetida foi extraída em componentes reutilizáveis, como `Button`, `FormInput`, `GlassCard`, `PageLayout`, `OrderSummary`, `CardHeader` e `SectionHeader`. Isso segue o princípio DRY.
- [x] **Estilização com Framework:** O projeto usa **Tailwind CSS** para um design consistente e responsivo.
- [x] **Testes Unitários:** O projeto inclui testes de amostragem para componentes de UI (ex: `Button.test.jsx`) e lógica de página (ex: `HomePage.test.jsx`) usando Jest e React Testing Library.
- [x] **Organização de Pastas:** A estrutura de pastas segue boas práticas (ex: `components/common`, `components/layout`, `context`, `hooks`, `pages`).
- [x] **Documentação de API:** A API do backend está documentada abaixo.
- [x] **Uso do Git:** O projeto foi desenvolvido usando branches por feature (ex: `refactor/component-library`, `docs/api-documentation`) com commits descritivos.

### UX/UI
- [x] **Animações e Transições:** O app usa `framer-motion` para animações suaves de entrada de página e hover de componentes, criando uma experiência de usuário fluida.
- [x] **Layout Responsivo:** O uso de Tailwind CSS garante que o layout seja utilizável em dispositivos móveis (ex: o grid de produtos).
- [x] **Mensagens de Erro Amigáveis:** As mensagens de erro técnicas da API (ex: "Network Error") são traduzidas para mensagens amigáveis ao usuário (ex: "Oops! Could not add item.").

---

## 📐 Decisões de Design e Premissas

Esta seção aborda as principais decisões de arquitetura e premissas assumidas.

1.  **Arquitetura de Componentes (DRY):**
    * **Premissa:** Um código limpo e fácil de manter é crucial.
    * **Decisão:** Em vez de repetir JSX e lógica em várias páginas (como `CheckoutPage` e `SuccessPage`), optei por uma refatoração pesada. Criei uma biblioteca de componentes "burros" reutilizáveis (ex: `Button`, `FormInput`) e componentes "inteligentes" (ex: `OrderSummary`, que busca seu próprio estado do `CartContext`). Isso torna as páginas (`CheckoutPage`) apenas "contêineres" que organizam os componentes.

2.  **Gerenciamento de Estado (Context API):**
    * **Premissa:** O estado do carrinho é global e precisa ser acessado por múltiplos componentes (Header, `ProductCard`, `CheckoutPage`, `OrderSummary`).
    * **Decisão:** O `CartContext` atua como a "única fonte da verdade" para o carrinho, gerenciando toda a lógica de API (CRUD) e estado de carregamento. Estados locais (como filtros da `HomePage`) são mantidos nos próprios componentes, evitando complexidade desnecessária no estado global.

3.  **Experiência do Usuário (Feedback):**
    * **Premissa:** O usuário nunca deve ficar em dúvida se uma ação funcionou.
    * **Decisão:** Cada ação assíncrona (Adicionar ao Carrinho, Finalizar Pedido) dispara um feedback triplo: 1) Um toast de "loading", 2) Um estado de `disabled` no botão, e 3) Um toast final de "success" ou "error" amigável.

---

## 🧪 Testes Unitários

Para demonstrar as boas práticas de teste, o projeto inclui testes de amostragem no frontend. A estratégia foi:

* **Testar Componentes:** Validar a renderização e os estados dos componentes reutilizáveis (ex: `Button.test.jsx` verifica se o botão fica `disabled` corretamente).
* **Testar Páginas (Mockando Hooks):** Validar a lógica da página (ex: `HomePage.test.jsx` "mocka" o hook `useProducts` para simular estados de "Loading" e "Error" e verifica se as mensagens corretas são exibidas na tela).

---

## 🤖 Uso de IA (Conforme Solicitado)

Sim, uma ferramenta de IA (Gemini) foi utilizada neste desafio, conforme permitido.

* **Como foi utilizada:** A IA foi usada como uma parceira de programação (pair-programming) focada em **refatoração e qualidade de código**.
* **Exemplos de Prompts:**
    * "Eu tenho este código repetido nas minhas páginas `CheckoutPage` e `SuccessPage`. Qual é a melhor forma de extraí-lo para um componente `Button` reutilizável?"
    * "Meu filtro de busca está chamando a API a cada tecla. Qual é o bug no meu `debounce` com `useState`?" (O que nos levou a usar `useRef`).
    * "Gere a documentação Markdown para estas rotas do Express."
    * "Gere um exemplo de teste unitário com Jest para este componente `Button`."

A IA não escreveu a lógica central do desafio, mas atuou como uma consultora sênior para identificar "code smells", sugerir padrões de design (como a extração de componentes) e acelerar tarefas repetitivas (como escrever documentação e testes).

---

## 📖 Documentação da API (Endpoints)

<details>
<summary>Clique para expandir a documentação da API</summary>

### 📦 Produtos

Controlado por `productController.js`.
Prefixo da Rota: `/api/products`

* **`GET /api/products/`**
    * **Descrição:** Busca a lista de produtos.
    * **Controlador:** `productController.list`
    * **Query Params (Opcionais):**
        * `page` (Number): O número da página. Default: 1.
        * `search` (String): Termo de busca para o nome do produto.
        * `category` (String): Filtra por uma categoria exata.
        * `maxPrice` (Number): Retorna produtos com preço menor ou igual a este.

---

### 🛒 Carrinho (Cart)

Controlado por `cartController.js`.
Prefixo da Rota: `/api/cart`

* **`GET /api/cart/`**
    * **Descrição:** Busca o conteúdo atual do carrinho.
    * **Controlador:** `cartController.getCart`

* **`POST /api/cart/`**
    * **Descrição:** Adiciona um item ao carrinho.
    * **Controlador:** `cartController.addItem`
    * **Body (JSON):**
        ```json
        {
          "productId": 123,
          "quantity": 1
        }
        ```

* **`DELETE /api/cart/:id`**
    * **Descrição:** Remove um item específico (baseado no `id`) do carrinho.
    * **Controlador:** `cartController.removeItem`

* **`PUT /api/cart/:id`**
    * **Descrição:** Atualiza a quantidade de um item específico (baseado no `id`) no carrinho.
    * **Controlador:** `cartController.updateItemQuantity`
    * **Body (JSON):**
        ```json
        {
          "quantity": 2
        }
        ```

---

### 🧾 Pedidos (Orders)

Controlado por `orderController.js`.
Prefixo da Rota: `/api/orders`

* **`POST /api/orders/`**
    * **Descrição:** Simula um checkout (finaliza um pedido).
    * **Controlador:** `orderController.checkout`
    * **Notas:** Este endpoint recebe o carrinho (implicitamente, pela sessão/usuário) e retorna uma mensagem de sucesso.

</details>