# Documentação Completa de Endpoints - Pizzaria API

**API REST** desenvolvida em TypeScript com Express.js e Prisma ORM. Todos os endpoints requerem autenticação via JWT (exceto POST /users e POST /session), implementados com middleware `isAuthenticated`.

---

## Índice de Endpoints

1. [Usuários (User)](#usuários-user)
2. [Categorias (Category)](#categorias-category)
3. [Produtos (Product)](#produtos-product)
4. [Pedidos (Order)](#pedidos-order)
5. [Estrutura de Resposta](#estrutura-de-resposta)
6. [Códigos HTTP de Resposta](#códigos-http-de-resposta)

---

## Usuários (User)

### 1. Criar Usuário

**Endpoint:** `POST /users`

**Descrição:** Cria um novo usuário no sistema (sem necessidade de autenticação).

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Validações:**
- `name`: string, mínimo 3 caracteres (obrigatório)
- `email`: formato email válido (obrigatório)
- `password`: string, mínimo 6 caracteres (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "created_At": "2025-12-28T10:30:00.000Z",
  "updated_At": "2025-12-28T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `400 Bad Request`: Validação falhou (nome < 3 caracteres, email inválido, senha < 6 caracteres)
- `409 Conflict`: Email já existe no sistema

---

### 2. Autenticar Usuário (Login)

**Endpoint:** `POST /session`

**Descrição:** Autentica um usuário e retorna um token JWT.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Validações:**
- `email`: formato email válido (obrigatório)
- `password`: string não vazia (obrigatório)

**Resposta (200 OK):**
```json
{
  "auth": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "STAFF",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MDMyOTE4MDB9...."
  }
}
```

**Erros Possíveis:**
- `400 Bad Request`: Email ou senha inválidos
- `401 Unauthorized`: Credenciais incorretas

---

### 3. Obter Dados do Usuário Autenticado

**Endpoint:** `GET /me`

**Descrição:** Retorna os dados do usuário autenticado (requer token JWT).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros:** Nenhum

**Resposta (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "created_At": "2025-12-28T10:30:00.000Z",
  "updated_At": "2025-12-28T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401 Unauthorized`: Token ausente, inválido ou expirado

---

## Categorias (Category)

### 1. Criar Categoria

**Endpoint:** `POST /category`

**Descrição:** Cria uma nova categoria de produtos (requer autenticação e role ADMIN).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Pizzas Doces"
}
```

**Validações:**
- `name`: string, mínimo 2 caracteres (obrigatório)

**Middlewares:**
- `isAuthenticated` (requer JWT válido)
- `isAdmin` (requer role = ADMIN)

**Resposta (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Pizzas Doces",
  "created_At": "2025-12-28T10:35:00.000Z",
  "updated_At": "2025-12-28T10:35:00.000Z"
}
```

**Erros Possíveis:**
- `400 Bad Request`: Nome < 2 caracteres
- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Usuário não é administrador

---

### 2. Listar Categorias

**Endpoint:** `GET /category`

**Descrição:** Lista todas as categorias cadastradas, ordenadas por data de criação (descendente).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:** Nenhum

**Resposta (200 OK):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Doces",
    "created_At": "2025-12-28T10:35:00.000Z",
    "updated_At": "2025-12-28T10:35:00.000Z"
  },
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "Pizzas Salgadas",
    "created_At": "2025-12-28T10:30:00.000Z",
    "updated_At": "2025-12-28T10:30:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401 Unauthorized`: Token ausente ou inválido

---

## Produtos (Product)

### 1. Criar Produto

**Endpoint:** `POST /product`

**Descrição:** Cria um novo produto com upload de imagem/banner (requer autenticação e role ADMIN).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: multipart/form-data
```

**Body (Form-Data):**
```
name: "Pizza Margherita"
price: "45.50"
description: "Pizza clássica com tomate, mozzarela e manjericão"
category_id: "770e8400-e29b-41d4-a716-446655440002"
file: <arquivo de imagem>
```

**Validações:**
- `name`: string, mínimo 1 caractere (obrigatório)
- `price`: string numérica, mínimo 1 (obrigatório)
- `description`: string, mínimo 1 caractere (obrigatório)
- `category_id`: string UUID válido, mínimo 1 (obrigatório)
- `file`: arquivo de imagem (obrigatório, processado por Multer)

**Middlewares:**
- `isAuthenticated` (requer JWT válido)
- `isAdmin` (requer role = ADMIN)
- `upload.single('file')` (Multer - salva em `tmp/`)

**Resposta (200 OK):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "name": "Pizza Margherita",
  "price": 4550,
  "description": "Pizza clássica com tomate, mozzarela e manjericão",
  "banner": "http://localhost:3000/files/1735385400000-pizza.jpg",
  "disabled": false,
  "category_id": "770e8400-e29b-41d4-a716-446655440002",
  "created_At": "2025-12-28T10:40:00.000Z",
  "updated_At": "2025-12-28T10:40:00.000Z"
}
```

**Notas:**
- O preço é armazenado em centavos (45.50 → 4550)
- A URL do banner é gerada pelo Multer/servidor

**Erros Possíveis:**
- `400 Bad Request`: Validação falhou, arquivo inválido ou campo obrigatório ausente
- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Usuário não é administrador

---

### 2. Listar Produtos

**Endpoint:** `GET /products`

**Descrição:** Lista todos os produtos cadastrados com filtro opcional por status `disabled`.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:**
```
disabled=false  (opcional, string "true" ou "false", padrão: "false")
```

**Exemplos de URL:**
```
GET /products
GET /products?disabled=false
GET /products?disabled=true
```

**Resposta (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "name": "Pizza Margherita",
    "price": 4550,
    "description": "Pizza clássica com tomate, mozzarela e manjericão",
    "banner": "http://localhost:3000/files/1735385400000-pizza.jpg",
    "disabled": false,
    "category_id": "770e8400-e29b-41d4-a716-446655440002",
    "created_At": "2025-12-28T10:40:00.000Z",
    "updated_At": "2025-12-28T10:40:00.000Z"
  },
  {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "name": "Pizza Pepperoni",
    "price": 5000,
    "description": "Pizza com pepperoni e queijo derretido",
    "banner": "http://localhost:3000/files/1735385500000-pepperoni.jpg",
    "disabled": false,
    "category_id": "770e8400-e29b-41d4-a716-446655440002",
    "created_At": "2025-12-28T10:35:00.000Z",
    "updated_At": "2025-12-28T10:35:00.000Z"
  }
]
```

**Erros Possíveis:**
- `400 Bad Request`: Validação de query parameter falhou
- `401 Unauthorized`: Token ausente ou inválido

---

### 3. Listar Produtos por Categoria

**Endpoint:** `GET /category/product`

**Descrição:** Lista todos os produtos de uma categoria específica.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:**
```
category_id=<uuid>  (obrigatório)
```

**Exemplo de URL:**
```
GET /category/product?category_id=770e8400-e29b-41d4-a716-446655440002
```

**Resposta (200 OK):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "name": "Pizza Margherita",
    "price": 4550,
    "description": "Pizza clássica com tomate, mozzarela e manjericão",
    "banner": "http://localhost:3000/files/1735385400000-pizza.jpg",
    "disabled": false,
    "category_id": "770e8400-e29b-41d4-a716-446655440002",
    "created_At": "2025-12-28T10:40:00.000Z",
    "updated_At": "2025-12-28T10:40:00.000Z"
  }
]
```

**Erros Possíveis:**
- `400 Bad Request`: `category_id` ausente ou inválido
- `401 Unauthorized`: Token ausente ou inválido

---

### 4. Deletar Produto

**Endpoint:** `DELETE /product`

**Descrição:** Remove um produto do sistema (requer autenticação e role ADMIN).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "product_id": "880e8400-e29b-41d4-a716-446655440003"
}
```

**Middlewares:**
- `isAuthenticated` (requer JWT válido)
- `isAdmin` (requer role = ADMIN)

**Resposta (200 OK):**
```json
{
  "message": "Produto deletado com sucesso"
}
```

**Erros Possíveis:**
- `401 Unauthorized`: Token ausente ou inválido
- `403 Forbidden`: Usuário não é administrador
- `404 Not Found`: Produto não existe

---

## Pedidos (Order)

### 1. Criar Pedido

**Endpoint:** `POST /order`

**Descrição:** Cria um novo pedido (requer autenticação). Inicialmente em draft mode.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "table": 5
}
```

**Validações:**
- `table`: número inteiro, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "status": false,
  "draft": true,
  "name": null,
  "created_At": "2025-12-28T10:45:00.000Z",
  "updated_At": "2025-12-28T10:45:00.000Z"
}
```

**Campos:**
- `status`: `false` = pendente, `true` = pronto
- `draft`: `true` = ainda em edição, `false` = enviado para produção

**Erros Possíveis:**
- `400 Bad Request`: Validação falhou (table inválido)
- `401 Unauthorized`: Token ausente ou inválido

---

### 2. Listar Pedidos

**Endpoint:** `GET /orders`

**Descrição:** Lista todos os pedidos cadastrados.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:** Nenhum

**Resposta (200 OK):**
```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "table": 5,
    "status": false,
    "draft": true,
    "name": null,
    "created_At": "2025-12-28T10:45:00.000Z",
    "updated_At": "2025-12-28T10:45:00.000Z"
  },
  {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "table": 3,
    "status": true,
    "draft": false,
    "name": "João",
    "created_At": "2025-12-28T10:30:00.000Z",
    "updated_At": "2025-12-28T10:40:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401 Unauthorized`: Token ausente ou inválido

---

### 3. Obter Detalhes do Pedido

**Endpoint:** `GET /order/detail`

**Descrição:** Retorna todos os detalhes de um pedido específico, incluindo itens e informações dos produtos.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:**
```
order_id=<uuid>  (obrigatório)
```

**Exemplo de URL:**
```
GET /order/detail?order_id=aa0e8400-e29b-41d4-a716-446655440005
```

**Validações:**
- `order_id`: string UUID válido, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "status": false,
  "draft": true,
  "name": null,
  "created_At": "2025-12-28T10:45:00.000Z",
  "updated_At": "2025-12-28T10:45:00.000Z",
  "Items": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440007",
      "amount": 2,
      "product_id": "880e8400-e29b-41d4-a716-446655440003",
      "order_id": "aa0e8400-e29b-41d4-a716-446655440005",
      "created_At": "2025-12-28T10:46:00.000Z",
      "updated_At": "2025-12-28T10:46:00.000Z",
      "product": {
        "id": "880e8400-e29b-41d4-a716-446655440003",
        "name": "Pizza Margherita",
        "price": 4550,
        "description": "Pizza clássica com tomate, mozzarela e manjericão",
        "banner": "http://localhost:3000/files/1735385400000-pizza.jpg",
        "disabled": false,
        "category_id": "770e8400-e29b-41d4-a716-446655440002",
        "created_At": "2025-12-28T10:40:00.000Z",
        "updated_At": "2025-12-28T10:40:00.000Z"
      }
    },
    {
      "id": "dd0e8400-e29b-41d4-a716-446655440008",
      "amount": 1,
      "product_id": "990e8400-e29b-41d4-a716-446655440004",
      "order_id": "aa0e8400-e29b-41d4-a716-446655440005",
      "created_At": "2025-12-28T10:47:00.000Z",
      "updated_At": "2025-12-28T10:47:00.000Z",
      "product": {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "name": "Pizza Pepperoni",
        "price": 5000,
        "description": "Pizza com pepperoni e queijo derretido",
        "banner": "http://localhost:3000/files/1735385500000-pepperoni.jpg",
        "disabled": false,
        "category_id": "770e8400-e29b-41d4-a716-446655440002",
        "created_At": "2025-12-28T10:35:00.000Z",
        "updated_At": "2025-12-28T10:35:00.000Z"
      }
    }
  ]
}
```

**Erros Possíveis:**
- `400 Bad Request`: `order_id` ausente ou inválido
- `401 Unauthorized`: Token ausente ou inválido
- `404 Not Found`: Pedido não existe

---

### 4. Adicionar Item ao Pedido

**Endpoint:** `POST /order/add`

**Descrição:** Adiciona um produto ao pedido especificado (aumenta quantidade se já existe).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "order_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "product_id": "880e8400-e29b-41d4-a716-446655440003",
  "amount": 2
}
```

**Validações:**
- `order_id`: string UUID válido, mínimo 1 (obrigatório)
- `product_id`: string UUID válido, mínimo 1 (obrigatório)
- `amount`: número positivo, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "cc0e8400-e29b-41d4-a716-446655440007",
  "amount": 2,
  "product_id": "880e8400-e29b-41d4-a716-446655440003",
  "order_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "created_At": "2025-12-28T10:46:00.000Z",
  "updated_At": "2025-12-28T10:46:00.000Z"
}
```

**Erros Possíveis:**
- `400 Bad Request`: Validação falhou (amount inválido, IDs vazios)
- `401 Unauthorized`: Token ausente ou inválido
- `404 Not Found`: Produto ou pedido não existe

---

### 5. Remover Item do Pedido

**Endpoint:** `DELETE /order/item/remove`

**Descrição:** Remove um item específico de um pedido.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:**
```
item_id=<uuid>  (obrigatório)
```

**Exemplo de URL:**
```
DELETE /order/item/remove?item_id=cc0e8400-e29b-41d4-a716-446655440007
```

**Validações:**
- `item_id`: string UUID válido, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "cc0e8400-e29b-41d4-a716-446655440007",
  "amount": 2,
  "product_id": "880e8400-e29b-41d4-a716-446655440003",
  "order_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "created_At": "2025-12-28T10:46:00.000Z",
  "updated_At": "2025-12-28T10:46:00.000Z",
  "message": "Item removido com sucesso"
}
```

**Erros Possíveis:**
- `400 Bad Request`: `item_id` ausente ou inválido
- `401 Unauthorized`: Token ausente ou inválido
- `404 Not Found`: Item não existe

---

### 6. Enviar Pedido para Produção

**Endpoint:** `PUT /order/send`

**Descrição:** Marca um pedido como enviado para produção (draft → false) e define o nome.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "order_id": "aa0e8400-e29b-41d4-a716-446655440005",
  "name": "João"
}
```

**Validações:**
- `order_id`: string UUID válido, mínimo 1 (obrigatório)
- `name`: string não vazia, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "status": false,
  "draft": false,
  "name": "João",
  "created_At": "2025-12-28T10:45:00.000Z",
  "updated_At": "2025-12-28T10:48:00.000Z"
}
```

**Erros Possíveis:**
- `400 Bad Request`: Validação falhou (name vazio, order_id inválido)
- `401 Unauthorized`: Token ausente ou inválido
- `404 Not Found`: Pedido não existe

---

### 7. Finalizar Pedido

**Endpoint:** `PUT /order/finish`

**Descrição:** Marca um pedido como concluído (status → true).

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "order_id": "aa0e8400-e29b-41d4-a716-446655440005"
}
```

**Validações:**
- `order_id`: string UUID válido, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "status": true,
  "draft": false,
  "name": "João",
  "created_At": "2025-12-28T10:45:00.000Z",
  "updated_At": "2025-12-28T10:49:00.000Z"
}
```

**Erros Possíveis:**
- `400 Bad Request`: `order_id` ausente ou inválido
- `401 Unauthorized`: Token ausente ou inválido
- `404 Not Found`: Pedido não existe

---

### 8. Deletar Pedido

**Endpoint:** `DELETE /order`

**Descrição:** Remove um pedido e todos os seus itens do sistema.

**Headers:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parâmetros de Query:**
```
order_id=<uuid>  (obrigatório)
```

**Exemplo de URL:**
```
DELETE /order?order_id=aa0e8400-e29b-41d4-a716-446655440005
```

**Validações:**
- `order_id`: string UUID válido, mínimo 1 (obrigatório)

**Resposta (200 OK):**
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "table": 5,
  "status": true,
  "draft": false,
  "name": "João",
  "created_At": "2025-12-28T10:45:00.000Z",
  "updated_At": "2025-12-28T10:49:00.000Z",
  "message": "Pedido deletado com sucesso"
}
```

**Erros Possíveis:**
- `400 Bad Request`: `order_id` ausente ou inválido
- `401 Unauthorized`: Token ausente ou inválido
- `404 Not Found`: Pedido não existe

---

## Estrutura de Resposta

### Resposta de Sucesso (2xx)
Geralmente retorna o objeto criado/atualizado/listado:
```json
{
  "id": "...",
  "field1": "value1",
  "field2": "value2",
  ...
}
```

Ou para listas:
```json
[
  { "id": "...", ... },
  { "id": "...", ... }
]
```

### Resposta de Erro (4xx, 5xx)
Formato padrão de erro (quando disponível):
```json
{
  "error": "Descrição do erro",
  "message": "Mensagem detalhada"
}
```

Para erros de validação Zod (400):
```json
{
  "errors": [
    {
      "path": "body.name",
      "message": "O nome precisa ter no minimo 3 caracteres!",
      "code": "too_small"
    }
  ]
}
```

---

## Códigos HTTP de Resposta

| Código | Descrição |
|--------|-----------|
| **200** | OK - Requisição bem-sucedida |
| **201** | Created - Recurso criado com sucesso |
| **400** | Bad Request - Validação falhou, parâmetros inválidos |
| **401** | Unauthorized - Token JWT ausente, inválido ou expirado |
| **403** | Forbidden - Usuário não possui permissão (ex: não é admin) |
| **404** | Not Found - Recurso não encontrado |
| **409** | Conflict - Conflito (ex: email já existe) |
| **500** | Internal Server Error - Erro no servidor |

---

## Autenticação JWT

### Como obter token:
1. Criar usuário: `POST /users`
2. Fazer login: `POST /session`
3. Copiar o `token` da resposta

### Como usar o token:
Adicionar header em todas as requisições (exceto POST /users e POST /session):
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Formato do token (JWT):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MDMyOTE4MDB9.signature
```

**Payload contém:**
- `sub`: ID do usuário autenticado
- `iat`: Data de emissão do token

---

## Permissões e Roles

- **STAFF**: Usuário comum (padrão)
  - Pode criar, listar e interagir com pedidos
  - Não pode criar categorias ou produtos
  - Não pode deletar produtos

- **ADMIN**: Administrador
  - Pode criar categorias
  - Pode criar, listar e deletar produtos
  - Pode interagir com pedidos como STAFF

---

## Endpoints Públicos (sem autenticação)

- `POST /users` - Criar usuário
- `POST /session` - Fazer login

Todos os outros endpoints requerem autenticação via token JWT.

---

**Última atualização:** 28 de Dezembro de 2025
