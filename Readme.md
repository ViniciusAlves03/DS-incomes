# Despesa Simples - Serviço de Receitas (Incomes Service)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Inversify](https://img.shields.io/badge/Inversify-2C5C85?style=for-the-badge)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

Este é o repositório do **Serviço de Receitas (Incomes Service)**, um microsserviço do sistema **Despesa Simples**.

Ele é responsável por gerenciar as **receitas (incomes)** dos usuários. Ele permite que usuários registrem, consultem, atualizem e removam suas transações de entrada de dinheiro, associando-as a um usuário (`userId`) e, opcionalmente, a uma categoria (`categoryId`).

Construído com TypeScript, este projeto segue princípios de **Clean Architecture** e **Domain-Driven Design (DDD)** para garantir um código desacoplado, testável e de fácil manutenção.

## ✨ Principais Funcionalidades

* **Gerenciamento de Receitas:**
    * CRUD completo para receitas (Incomes).
* **Consulta de Receitas por Usuário:**
    * Endpoints específicos para listar e gerenciar todas as receitas de um usuário específico.
    * Endpoints globais para consulta de receitas.
* **Remoção em Lote:**
    * Endpoint para remover múltiplas receitas de um usuário de uma só vez, enviando um array de IDs.
* **Comunicação:**
    * Expõe recursos via **RabbitMQ RPC** (Remote Procedure Call).
    * Fornece o recurso `incomes.findbyuserid` para que outros microsserviços possam consultar as receitas de um usuário de forma síncrona, porém desacoplada.
* **Validação de Dados:**
    * Validação robusta de IDs (Mongo ObjectIds), datas (formato YYYY-MM-DD) e campos obrigatórios.
* **Documentação de API:**
    * Geração automática de documentação **Swagger (OpenAPI 3.0)**.

## 🚀 Tecnologias Utilizadas

* **Core:** Node.js, TypeScript
* **Framework API:** Express.js
* **Injeção de Dependência:** InversifyJS
* **Banco de Dados:** MongoDB
* **ODM:** Mongoose
* **Mensageria:** RabbitMQ
* **Logging:** Winston
* **Documentação:** Swagger / OpenAPI

## 📋 Pré-requisitos

Para executar este projeto localmente, você precisará ter os seguintes serviços instalados e em execução:

* Node.js (v21.x ou superior)
* MongoDB
* RabbitMQ

## ⚙️ Instalação e Execução

Existem duas formas de rodar o projeto em desenvolvimento.

### Método 1: Rodando com Docker (Recomendado)

Este método é o mais simples, pois usa o Dockerfile para executar a aplicação, e Docker Compose para subir os serviços de banco de dados (MongoDB) e mensageria (RabbitMQ). A aplicação Node.js rodará localmente, conectando-se a eles.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/ViniciusAlves03/DS-incomes.git
    cd DS-incomes
    ```

2.  **Inicie os serviços (Mongo e RabbitMQ):**
    Use o arquivo `docker-compose.yml` (se fornecido no projeto) para iniciar os containers das dependências em background.
    ```bash
    docker-compose up -d
    ```
    * MongoDB estará disponível em: `localhost:27017`
    * RabbitMQ (admin) estará disponível em: `http://localhost:15672`

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`. Você pode usar o seguinte comando:
    ```bash
    cp .env.example .env
    ```

4.  **Construa a imagem da aplicação:**
    Usando o Dockerfile fornecido, construa a imagem do serviço de receitas.
    ```bash
    docker build -t DS-incomes:latest .
    ```

5.  **Rode o contêiner da aplicação:**
    Este comando inicia sua aplicação, a conecta na mesma rede das dependências (`exp-network`) e injeta as variáveis de ambiente do arquivo `.env`. (A porta `7000` é baseada na documentação do Swagger).
    ```bash
    docker run -d \
        --name exp-incomes-app \
        -p 7000:7000 \
        --network exp-network \
        --env-file .env \
        DS-incomes:latest
    ```
    A aplicação estará sendo executada em `http://localhost:7000`.

---
### Método 2: Rodando Localmente (Sem Docker)

Este método exige que você tenha instâncias do **MongoDB** e **RabbitMQ** instaladas e rodando na sua máquina local.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/ViniciusAlves03/DS-incomes.git](https://github.com/ViniciusAlves03/DS-incomes.git)
    cd DS-incomes
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`. Você pode usar:
    ```bash
    cp .env.example .env
    ```

4.  **Compile o TypeScript:**
    ```bash
    npm run build
    ```

5.  **Inicie o servidor (modo de desenvolvimento):**
    ```bash
    npm run dev
    ```

6.  **Inicie o servidor (modo de produção):**
    ```bash
    npm start
    ```

## 🏗️ Estrutura do Projeto

```sh
src/
├── application/     # Camada de Aplicação (Lógica de negócio e casos de uso)
│   ├── domain/      # Entidades de domínio, modelos, validadores e exceções.
│   ├── port/        # Interfaces para serviços e repositórios.
│   └── service/     # Implementação dos serviços (casos de uso).
│
├── infrastructure/  # Camada de Infraestrutura (Detalhes de implementação)
│   ├── database/    # Configuração de DB, Schemas Mongoose.
│   ├── entity/      # Entidades de banco e Mappers.
│   ├── eventbus/    # Implementação do RabbitMQ.
│   ├── repository/  # Implementação dos repositórios (MongoDB).
│   └── port/        # Interfaces da camada de infraestrutura.
│
├── ui/              # Camada de Interface (Entrada e Saída)
│   ├── controllers/ # Controllers da API (Express).
│   ├── exception/   # Manipuladores de exceção da API.
│   └── swagger/     # Arquivo de definição do OpenAPI (api_1.0.0.yaml).
│
├── di/              # Configuração da Injeção de Dependência.
├── background/      # Serviços e tarefas em background.
├── utils/           # Utilitários (Logger, Config, Strings).
└── app.ts           # Ponto de entrada da aplicação Express.
```

## 📖 Visão Geral da API (Endpoints)

Abaixo está um resumo de todos os endpoints disponíveis neste microsserviço, agrupados por recurso.

Para uma documentação interativa completa, com detalhes de *schemas* e *body*, acesse a documentação do Swagger:
**`http://localhost:7000/v1/reference`**

### 💰 Expenses

Rotas para consultar receitas de forma global.

| Método | Rota (Path) | Descrição |
| :--- | :--- | :--- |
| `GET` | `/v1/incomes` | Lista todas as Receitas (paginado). |
| `GET` | `/v1/incomes/{income_id}` | Obtém uma Receita pelo seu ID. |

---

### 👤 Users (Receitas do Usuário)

Rotas para gerenciamento de receitas vinculadas a um usuário específico.

| Método | Rota (Path) | Descrição |
| :--- | :--- | :--- |
| `POST` | `/v1/users/{user_id}/incomes` | Adiciona uma nova Receita para um Usuário. |
| `GET` | `/v1/users/{user_id}/incomes` | Lista todas as Receitas de um Usuário (paginado). |
| `DELETE` | `/v1/users/{user_id}/incomes` | Remove Múltiplas Receitas de um Usuário (em lote). |
| `GET` | `/v1/users/{user_id}/incomes/{income_id}` | Obtém uma Receita específica de um Usuário. |
| `PATCH` | `/v1/users/{user_id}/incomes/{income_id}` | Atualiza uma Receita de um Usuário. |
| `DELETE` | `/v1/users/{user_id}/incomes/{income_id}` | Remove uma Receita de um Usuário. |

---

## 🧑‍💻 Autor <a id="autor"></a>

<p align="center">Desenvolvido por Vinícius Alves <strong><a href="https://github.com/ViniciusAlves03">(eu)</a></strong>.</p>

---
