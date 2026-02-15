# Projeto: Pizzaria (Backend) — Documento de Contexto

**Resumo:** API REST em TypeScript usando Express.js + Prisma ORM, com arquitetura em camadas (Rotas → Controllers → Services → Prisma/DB). Sistema completo de gerenciamento de pizzaria com autenticação JWT, gestão de categorias/produtos, pedidos com itens variáveis, e controle de permissões (STAFF/ADMIN).

**Stack Tecnológico:** Node.js, TypeScript, Express.js, Prisma ORM, PostgreSQL, JWT, Multer (upload), Zod (validação), bcryptjs (hash de senhas).

**Documentação Adicional:** Para detalhes completos de todos os endpoints com exemplos de requisição/resposta, consulte [endpoints.md](endpoints.md).

---

## 1. Arquitectura (Fluxo de Requisição)

```
Cliente HTTP
    ↓
[Routes] src/routes.ts
    ↓
[Middlewares] isAuthenticated, isAdmin, validateSchema
    ↓
[Controller] handle() - extrai dados de req, chama service
    ↓
[Service] execute() - lógica de negócio, validações
    ↓
[Prisma Client] src/Prisma/index.ts - operações BD
    ↓
[PostgreSQL Database]
    ↓
Service (formata resposta)
    ↓
Controller (res.json())
    ↓
Cliente HTTP
```

**Fluxo Detalhado:**

1. **Routes** ([src/routes.ts](src/routes.ts)) - Define endpoints HTTP e aplica middlewares na sequência correta
2. **Middlewares** - Validação de token JWT, verificação de role, validação de schema Zod
3. **Controllers** - Extraem dados de `req.body` / `req.query` / `req.params`, chamam service
4. **Services** - Implementam lógica de negócio, validações, interação com Prisma
5. **Prisma Client** - ORM que traduz operações para SQL
6. **Resposta** - Service → Controller → HTTP Response (JSON)

**Exemplo Concreto (Criar Usuário):**
- Route: `POST /users` → [`CreateUserController.handle()`](src/controllers/user/CreateUserController.ts)
- Service: [`CreateUserService.execute()`](src/services/user/CreateUserService.ts)
  - Valida dados, faz hash da senha com bcryptjs
  - Cria registro em `users` via Prisma
  - Retorna usuário (sem senha)
- Resposta: JSON com id, name, email, role, timestamps

---

## 2. Organização de Pastas (Estrutura de Diretórios)

```
backend/
├── src/
│   ├── controllers/          # Camada de controle HTTP
│   │   ├── user/
│   │   │   ├── CreateUserController.ts
│   │   │   ├── AuthUserController.ts
│   │   │   └── DetailUserController.ts
│   │   ├── category/
│   │   │   ├── CreateCategoryController.ts
│   │   │   └── ListCategoryController.ts
│   │   ├── product/
│   │   │   ├── CreateProductController.ts
│   │   │   ├── ListProductsController.ts
│   │   │   ├── ListByCategoryController.ts
│   │   │   └── DeleteProductController.ts
│   │   └── order/
│   │       ├── CreateOrderController.ts
│   │       ├── ListOrderController.ts
│   │       ├── DetailOrderController.ts
│   │       ├── AddItemController.ts
│   │       ├── RemoveOrderItemController.ts
│   │       ├── SendOrderController.ts
│   │       ├── FinishOrderController.ts
│   │       └── DeleteOrderController.ts
│   │
│   ├── services/             # Lógica de negócio
│   │   ├── user/
│   │   │   ├── CreateUserService.ts
│   │   │   ├── AuthUserService.ts
│   │   │   └── DetailUserService.ts
│   │   ├── category/
│   │   │   ├── CreateCategoryService.ts
│   │   │   └── ListCategoryService.ts
│   │   ├── product/
│   │   │   ├── CreateProductService.ts
│   │   │   ├── ListProductsService.ts
│   │   │   ├── ListByCategoryService.ts
│   │   │   └── DeleteProductService.ts
│   │   └── order/
│   │       ├── CreateOrderService.ts
│   │       ├── ListOrderService.ts
│   │       ├── DetailOrderService.ts
│   │       ├── AddItemOrderService.ts
│   │       ├── RemoveOrderItemService.ts
│   │       ├── SendOrderService.ts
│   │       ├── FinishOrderService.ts
│   │       └── DeleteOrderService.ts
│   │
│   ├── middlewares/          # Middlewares Express
│   │   ├── isAuthenticated.ts     # Valida JWT
│   │   ├── isAdmin.ts             # Verifica role ADMIN
│   │   └── validateSchema.ts      # Valida com Zod
│   │
│   ├── schemas/              # Schemas de validação Zod
│   │   ├── userSchema.ts
│   │   ├── categorySchema.ts
│   │   ├── productSchema.ts
│   │   └── orderSchema.ts
│   │
│   ├── config/               # Configurações (upload, etc)
│   │   ├── multer.ts         # Config de upload de arquivos
│   │   └── multer2.ts        # Alternativa multer
│   │
│   ├── Prisma/               # Cliente Prisma
│   │   └── index.ts
│   │
│   ├── generated/            # Código gerado por Prisma
│   │   └── prisma/
│   │       ├── client.ts
│   │       ├── models/
│   │       └── ...
│   │
│   ├── @types/               # Type definitions estendidas
│   │   └── express/
│   │       └── index.d.ts    # Estende Request com user_id
│   │
│   ├── routes.ts             # Definição de todas as rotas
│   └── server.ts             # Inicialização Express (main)
│
├── prisma/                   # ORM Prisma
│   ├── schema.prisma         # Modelos de dados
│   └── migrations/           # Histórico de migrações
│       ├── 20251128075746_create_tables/
│       ├── 20251209232434/
│       └── 20251215200712_add_columns_table_order/
│
├── tmp/                      # Pasta de arquivos de upload
├── package.json              # Dependências Node
├── tsconfig.json             # Configuração TypeScript
├── prisma.config.ts          # Config adicional Prisma
├── contexto-projecto.md      # Este documento
├── endpoints.md              # Documentação de endpoints
└── .env                      # Variáveis de ambiente (não versionado)
```

### Arquivos Principais

**Core:**
- [src/server.ts](src/server.ts) - Inicializa Express, aplica middlewares globais, serve arquivos estáticos
- [src/routes.ts](src/routes.ts) - Define todas as rotas HTTP e aplica middlewares específicos
- [src/Prisma/index.ts](src/Prisma/index.ts) - Exporta instância do Prisma Client

**Controladores (8 funcionalidades principais):**
- **User:** [CreateUserController.ts](src/controllers/user/CreateUserController.ts), [AuthUserController.ts](src/controllers/user/AuthUserController.ts), [DetailUserController.ts](src/controllers/user/DetailUserController.ts)
- **Category:** [CreateCategoryController.ts](src/controllers/category/CreateCategoryController.ts), [ListCategoryController.ts](src/controllers/category/ListCategoryController.ts)
- **Product:** [CreateProductController.ts](src/controllers/product/CreateProductController.ts), [ListProductsController.ts](src/controllers/product/ListProductsController.ts), [ListByCategoryController.ts](src/controllers/product/ListByCategoryController.ts), [DeleteProductController.ts](src/controllers/product/DeleteProductController.ts)
- **Order:** [CreateOrderController.ts](src/controllers/order/CreateOrderController.ts), [ListOrderController.ts](src/controllers/order/ListOrderController.ts), [DetailOrderController.ts](src/controllers/order/DetailOrderController.ts), [AddItemController.ts](src/controllers/order/AddItemController.ts), [RemoveOrderItemController.ts](src/controllers/order/RemoveOrderItemController.ts), [SendOrderController.ts](src/controllers/order/SendOrderController.ts), [FinishOrderController.ts](src/controllers/order/FinishOrderController.ts), [DeleteOrderController.ts](src/controllers/order/DeleteOrderController.ts)

**Services (8 funcionalidades, mesmo padrão):**
- **User:** [CreateUserService.ts](src/services/user/CreateUserService.ts), [AuthUserService.ts](src/services/user/AuthUserService.ts), [DetailUserService.ts](src/services/user/DetailUserService.ts)
- **Category:** [CreateCategoryService.ts](src/services/category/CreateCategoryService.ts), [ListCategoryService.ts](src/services/category/ListCategoryService.ts)
- **Product:** [CreateProductService.ts](src/services/product/CreateProductService.ts), [ListProductsService.ts](src/services/product/ListProductsService.ts), [ListByCategoryService.ts](src/services/product/ListByCategoryService.ts), [DeleteProductService.ts](src/services/product/DeleteProductService.ts)
- **Order:** [CreateOrderService.ts](src/services/order/CreateOrderService.ts), [ListOrderService.ts](src/services/order/ListOrderService.ts), [DetailOrderService.ts](src/services/order/DetailOrderService.ts), [AddItemOrderService.ts](src/services/order/AddItemOrderService.ts), [RemoveOrderItemService.ts](src/services/order/RemoveOrderItemService.ts), [SendOrderService.ts](src/services/order/SendOrderService.ts), [FinishOrderService.ts](src/services/order/FinishOrderService.ts), [DeleteOrderService.ts](src/services/order/DeleteOrderService.ts)

**Middlewares:**
- [isAuthenticated.ts](src/middlewares/isAuthenticated.ts) - Valida JWT e injeta user_id em req
- [isAdmin.ts](src/middlewares/isAdmin.ts) - Verifica se usuário é ADMIN
- [validateSchema.ts](src/middlewares/validateSchema.ts) - Valida request body/query/params com Zod

**Schemas Zod:**
- [userSchema.ts](src/schemas/userSchema.ts) - createUserSchema, authUserSchema
- [categorySchema.ts](src/schemas/categorySchema.ts) - createCategorySchema
- [productSchema.ts](src/schemas/productSchema.ts) - createProductSchema, listProductsSchema, listproductByCategorySchema
- [orderSchema.ts](src/schemas/orderSchema.ts) - createOrderSchema, addItemSchema, removeItemSchema, detailOrderSchema, sendOrderSchema, finishOrderSchema, deleteOrderSchema

**Configurações:**
- [multer.ts](src/config/multer.ts) e [multer2.ts](src/config/multer2.ts) - Configuração de upload de arquivos
- [tsconfig.json](tsconfig.json) - Configuração TypeScript
- [prisma.config.ts](prisma.config.ts) - Configuração adicional Prisma
- [package.json](package.json) - Dependências npm

**Prisma:**
- [prisma/schema.prisma](prisma/schema.prisma) - Definição de modelos e banco de dados
- [prisma/migrations/](prisma/migrations/) - Histórico de migrações do banco

---

## 3. Endpoints Completos (Resumo Executivo)

Para documentação **detalhada de todos os endpoints** com exemplos de requisição/resposta, consulte [endpoints.md](endpoints.md).

### Resumo Rápido (16 Endpoints Totais)

**Usuários (3 endpoints):**
| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | /users | Não | Criar usuário (registro) |
| POST | /session | Não | Fazer login (obter JWT) |
| GET | /me | Sim | Obter dados do usuário autenticado |

**Categorias (2 endpoints):**
| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | /category | Sim (ADMIN) | Criar categoria |
| GET | /category | Sim | Listar categorias |

**Produtos (4 endpoints):**
| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | /product | Sim (ADMIN) | Criar produto com upload de imagem |
| GET | /products | Sim | Listar produtos (com filtro disabled) |
| GET | /category/product | Sim | Listar produtos por categoria |
| DELETE | /product | Sim (ADMIN) | Deletar produto |

**Pedidos (7 endpoints):**
| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | /order | Sim | Criar pedido |
| GET | /orders | Sim | Listar pedidos |
| GET | /order/detail | Sim | Obter detalhes do pedido |
| POST | /order/add | Sim | Adicionar item ao pedido |
| DELETE | /order/item/remove | Sim | Remover item do pedido |
| PUT | /order/send | Sim | Enviar pedido para produção |
| PUT | /order/finish | Sim | Finalizar pedido |
| DELETE | /order | Sim | Deletar pedido |

**Total: 16 endpoints (14 autenticados + 2 públicos)**

### Detalhes por Funcionalidade

**Usuários - CreateUser:**
- Route: `POST /users`
- Middlewares: `validateSchema(createUserSchema)`
- Controller: [CreateUserController.handle()](src/controllers/user/CreateUserController.ts)
- Service: [CreateUserService.execute()](src/services/user/CreateUserService.ts)
- Body: `{ name, email, password }`
- Validações: name (min 3), email (válido), password (min 6)
- Resposta: Usuário criado com role STAFF
- Erros: 400 (validação), 409 (email duplicado)

**Usuários - Auth (Login):**
- Route: `POST /session`
- Middlewares: `validateSchema(authUserSchema)`
- Controller: [AuthUserController.handle()](src/controllers/user/AuthUserController.ts)
- Service: [AuthUserService.execute()](src/services/user/AuthUserService.ts)
- Body: `{ email, password }`
- Resposta: `{ id, name, email, role, token: JWT }`
- Erros: 400 (validação), 401 (credenciais inválidas)

**Usuários - DetailUser:**
- Route: `GET /me`
- Middlewares: `isAuthenticated`
- Controller: [DetailUserController.handle()](src/controllers/user/DetailUserController.ts)
- Service: [DetailUserService.execute()](src/services/user/DetailUserService.ts)
- Resposta: Dados completos do usuário autenticado
- Erros: 401 (sem token)

**Categorias - Create:**
- Route: `POST /category`
- Middlewares: `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`
- Controller: [CreateCategoryController.handle()](src/controllers/category/CreateCategoryController.ts)
- Service: [CreateCategoryService.execute()](src/services/category/CreateCategoryService.ts)
- Body: `{ name }`
- Validações: name (min 2)
- Resposta: Categoria criada
- Erros: 400 (validação), 401 (sem token), 403 (não admin)

**Categorias - List:**
- Route: `GET /category`
- Middlewares: `isAuthenticated`
- Controller: [ListCategoryController.handle()](src/controllers/category/ListCategoryController.ts)
- Service: [ListCategoryService.execute()](src/services/category/ListCategoryService.ts)
- Resposta: Array de categorias ordenado por data decrescente
- Erros: 401 (sem token)

**Produtos - Create:**
- Route: `POST /product`
- Middlewares: `isAuthenticated`, `isAdmin`, `upload.single('file')`, `validateSchema(createProductSchema)`
- Controller: [CreateProductController.handle()](src/controllers/product/CreateProductController.ts)
- Service: [CreateProductService.execute()](src/services/product/CreateProductService.ts)
- Body: `{ name, price, description, category_id }` + file (Multer)
- Validações: name (min 1), price (min 1), description (min 1), category_id (min 1), file obrigatório
- Resposta: Produto criado com URL do banner
- Erros: 400 (validação), 401 (sem token), 403 (não admin)

**Produtos - List:**
- Route: `GET /products`
- Middlewares: `isAuthenticated`, `validateSchema(listProductsSchema)`
- Controller: [ListProductsController.handle()](src/controllers/product/ListProductsController.ts)
- Service: [ListProductsService.execute()](src/services/product/ListProductsService.ts)
- Query: `disabled=true|false` (opcional, padrão: false)
- Resposta: Array de produtos filtrado por disabled
- Erros: 400 (query inválida), 401 (sem token)

**Produtos - List by Category:**
- Route: `GET /category/product`
- Middlewares: `isAuthenticated`, `validateSchema(listproductByCategorySchema)`
- Controller: [ListByCategoryController.handle()](src/controllers/product/ListByCategoryController.ts)
- Service: [ListByCategoryService.execute()](src/services/product/ListByCategoryService.ts)
- Query: `category_id=<uuid>` (obrigatório)
- Resposta: Array de produtos da categoria específica
- Erros: 400 (category_id ausente), 401 (sem token)

**Produtos - Delete:**
- Route: `DELETE /product`
- Middlewares: `isAuthenticated`, `isAdmin`
- Controller: [DeleteProductController.handle()](src/controllers/product/DeleteProductController.ts)
- Service: [DeleteProductService.execute()](src/services/product/DeleteProductService.ts)
- Body: `{ product_id }`
- Resposta: Confirma deleção
- Erros: 401 (sem token), 403 (não admin), 404 (produto não existe)

**Pedidos - Create:**
- Route: `POST /order`
- Middlewares: `isAuthenticated`, `validateSchema(createOrderSchema)`
- Controller: [CreateOrderController.handle()](src/controllers/order/CreateOrderController.ts)
- Service: [CreateOrderService.execute()](src/services/order/CreateOrderService.ts)
- Body: `{ table }`
- Validações: table (número, min 1)
- Resposta: Pedido criado em draft mode
- Erros: 400 (validação), 401 (sem token)

**Pedidos - List:**
- Route: `GET /orders`
- Middlewares: `isAuthenticated`
- Controller: [ListOrderController.handle()](src/controllers/order/ListOrderController.ts)
- Service: [ListOrderService.execute()](src/services/order/ListOrderService.ts)
- Resposta: Array de todos os pedidos
- Erros: 401 (sem token)

**Pedidos - Detail:**
- Route: `GET /order/detail`
- Middlewares: `isAuthenticated`, `validateSchema(detailOrderSchema)`
- Controller: [DetailOrderController.handle()](src/controllers/order/DetailOrderController.ts)
- Service: [DetailOrderService.execute()](src/services/order/DetailOrderService.ts)
- Query: `order_id=<uuid>` (obrigatório)
- Resposta: Pedido com array de Items e detalhes dos produtos
- Erros: 400 (order_id inválido), 401 (sem token), 404 (pedido não existe)

**Pedidos - Add Item:**
- Route: `POST /order/add`
- Middlewares: `isAuthenticated`, `validateSchema(addItemSchema)`
- Controller: [AddItemController.handle()](src/controllers/order/AddItemController.ts)
- Service: [AddItemOrderService.execute()](src/services/order/AddItemOrderService.ts)
- Body: `{ order_id, product_id, amount }`
- Validações: order_id (min 1), product_id (min 1), amount (positivo, min 1)
- Resposta: Item adicionado/atualizado
- Erros: 400 (validação), 401 (sem token), 404 (produto ou pedido não existe)

**Pedidos - Remove Item:**
- Route: `DELETE /order/item/remove`
- Middlewares: `isAuthenticated`, `validateSchema(removeItemSchema)`
- Controller: [RemoveOrderItemController.handle()](src/controllers/order/RemoveOrderItemController.ts)
- Service: [RemoveOrderItemService.execute()](src/services/order/RemoveOrderItemService.ts)
- Query: `item_id=<uuid>` (obrigatório)
- Resposta: Item removido
- Erros: 400 (item_id inválido), 401 (sem token), 404 (item não existe)

**Pedidos - Send (Enviar para Produção):**
- Route: `PUT /order/send`
- Middlewares: `isAuthenticated`, `validateSchema(sendOrderSchema)`
- Controller: [SendOrderController.handle()](src/controllers/order/SendOrderController.ts)
- Service: [SendOrderService.execute()](src/services/order/SendOrderService.ts)
- Body: `{ order_id, name }`
- Validações: order_id (min 1), name (min 1)
- Efeito: Muda draft=true para draft=false, adiciona nome
- Resposta: Pedido atualizado
- Erros: 400 (validação), 401 (sem token), 404 (pedido não existe)

**Pedidos - Finish:**
- Route: `PUT /order/finish`
- Middlewares: `isAuthenticated`, `validateSchema(finishOrderSchema)`
- Controller: [FinishOrderController.handle()](src/controllers/order/FinishOrderController.ts)
- Service: [FinishOrderService.execute()](src/services/order/FinishOrderService.ts)
- Body: `{ order_id }`
- Validações: order_id (min 1)
- Efeito: Muda status=false para status=true
- Resposta: Pedido finalizado
- Erros: 400 (validação), 401 (sem token), 404 (pedido não existe)

**Pedidos - Delete:**
- Route: `DELETE /order`
- Middlewares: `isAuthenticated`, `validateSchema(deleteOrderSchema)`
- Controller: [DeleteOrderController.handle()](src/controllers/order/DeleteOrderController.ts)
- Service: [DeleteOrderService.execute()](src/services/order/DeleteOrderService.ts)
- Query: `order_id=<uuid>` (obrigatório)
- Efeito: Remove pedido e todos seus items (CASCADE)
- Resposta: Confirma deleção
- Erros: 400 (order_id inválido), 401 (sem token), 404 (pedido não existe)

---

## 4. Modelagem do Banco (Prisma Schema)
Definida em: [prisma/schema.prisma](prisma/schema.prisma). O Prisma mapeia modelos TypeScript para tabelas PostgreSQL com migrações automáticas.

**Enums:**
- `Role` { STAFF, ADMIN } — Define permissões de usuário

**Modelos (5 tabelas):**

1. **User** (Usuários)
   ```prisma
   model User {
     id        String @id @default(uuid())
     name      String
     email     String @unique
     role      Role @default(STAFF)
     password  String
     created_At DateTime? @default(now())
     updated_At DateTime? @default(now())
   }
   ```
   - `id`: UUID único
   - `email`: Único, usado para login
   - `role`: STAFF (padrão) ou ADMIN
   - `password`: Hash bcryptjs
   - Timestamps para auditoria

2. **Category** (Categorias de Produtos)
   ```prisma
   model Category {
     id        String @id @default(uuid())
     name      String
     created_At DateTime? @default(now())
     updated_At DateTime? @default(now())
     products  Product[] // Relação um-para-muitos
   }
   ```
   - Uma categoria pode ter múltiplos produtos
   - Identifica tipos de pizza (Doces, Salgadas, etc.)

3. **Product** (Produtos)
   ```prisma
   model Product {
     id          String @id @default(uuid())
     name        String
     price       Int // Em centavos (ex: 4550 = R$ 45,50)
     description String
     banner      String // URL da imagem
     disabled    Boolean @default(false)
     category_id String
     category    Category @relation(fields: [category_id], references: [id], onDelete: Cascade)
     Items       Item[] // Relação um-para-muitos
     created_At DateTime? @default(now())
     updated_At DateTime? @default(now())
   }
   ```
   - `price`: Armazenado em centavos (Int)
   - `disabled`: Controla se produto está ativo
   - `banner`: URL da imagem do produto
   - Relacionamento com Category (muitos produtos → uma categoria)
   - Relacionamento com Item (um produto → múltiplos itens de pedidos)

4. **Order** (Pedidos)
   ```prisma
   model Order {
     id        String @id @default(uuid())
     table     Int // Número da mesa
     status    Boolean @default(false) // false: pendente, true: pronto
     draft     Boolean @default(true) // true: edição, false: enviado
     name      String? // Nome do cliente (opcional)
     Items     Item[] // Relação um-para-muitos
     created_At DateTime? @default(now())
     updated_At DateTime? @default(now())
   }
   ```
   - `table`: Número da mesa (1, 2, 3, ...)
   - `status`: false = pendente, true = pronto
   - `draft`: true = em edição, false = em produção
   - `name`: Nome do cliente ou responsável da mesa

5. **Item** (Itens do Pedido)
   ```prisma
   model Item {
     id         String @id @default(uuid())
     amount     Int // Quantidade do produto
     product_id String
     order_id   String
     product    Product @relation(fields: [product_id], references: [id], onDelete: Cascade)
     order      Order @relation(fields: [order_id], references: [id], onDelete: Cascade)
     created_At DateTime? @default(now())
     updated_At DateTime? @default(now())
   }
   ```
   - Representa cada produto adicionado a um pedido
   - Relacionamento muitos-para-muitos (via tabela Item)
   - `amount`: Quantidade do produto neste item

**Relacionamentos Principais:**
```
User (1) ←→ (∞) Order ❌ Nota: atualmente não há relação direta
Category (1) ←→ (∞) Product
Product (1) ←→ (∞) Item
Order (1) ←→ (∞) Item
```

**Migrations:**
- [20251128075746_create_tables](prisma/migrations/20251128075746_create_tables/migration.sql) - Criação inicial de tabelas
- [20251209232434](prisma/migrations/20251209232434/migration.sql) - Alteração adicional
- [20251215200712_add_columns_table_order](prisma/migrations/20251215200712_add_columns_table_order/migration.sql) - Adição de colunas em Order

**Prisma Client:**
- Gerado em: [src/generated/prisma/](src/generated/prisma/)
- Exportado em: [src/Prisma/index.ts](src/Prisma/index.ts)
- Usado em: Todos os Services para operações CRUD

---

## 5. Validação com Zod (Schemas)
Schemas Zod usados via middleware `validateSchema` ([src/middlewares/validateSchema.ts](src/middlewares/validateSchema.ts)). Zod valida estrutura, tipos e regras de negócio de body/query/params antes de chegar ao controller.

**User Schemas** ([src/schemas/userSchema.ts](src/schemas/userSchema.ts)):
```typescript
// Criação de usuário
createUserSchema: {
  body: {
    name:     string (min 3, obrigatório)
    email:    string (email válido, obrigatório)
    password: string (min 6, obrigatório)
  }
}

// Autenticação (login)
authUserSchema: {
  body: {
    email:    string (email válido, obrigatório)
    password: string (obrigatório)
  }
}
```

**Category Schemas** ([src/schemas/categorySchema.ts](src/schemas/categorySchema.ts)):
```typescript
// Criação de categoria
createCategorySchema: {
  body: {
    name: string (min 2, obrigatório)
  }
}
```

**Product Schemas** ([src/schemas/productSchema.ts](src/schemas/productSchema.ts)):
```typescript
// Criação de produto
createProductSchema: {
  body: {
    name:        string (min 1, obrigatório)
    price:       string (min 1, obrigatório) ← convertido em controller
    description: string (min 1, obrigatório)
    category_id: string (UUID, min 1, obrigatório)
  }
}

// Listagem de produtos
listProductsSchema: {
  query: {
    disabled: string ("true"/"false", opcional, padrão "false")
             → convertido para boolean
  }
}

// Listagem por categoria
listproductByCategorySchema: {
  query: {
    category_id: string (UUID, min 1, obrigatório)
  }
}
```

**Order Schemas** ([src/schemas/orderSchema.ts](src/schemas/orderSchema.ts)):
```typescript
// Criação de pedido
createOrderSchema: {
  body: {
    table: number (min 1, obrigatório)
  }
}

// Adicionar item ao pedido
addItemSchema: {
  body: {
    order_id:   string (UUID, min 1, obrigatório)
    product_id: string (UUID, min 1, obrigatório)
    amount:     number (min 1, positivo, obrigatório)
  }
}

// Remover item do pedido
removeItemSchema: {
  query: {
    item_id: string (UUID, min 1, obrigatório)
  }
}

// Detalhar pedido
detailOrderSchema: {
  query: {
    order_id: string (UUID, min 1, obrigatório)
  }
}

// Enviar pedido para produção
sendOrderSchema: {
  body: {
    order_id: string (UUID, min 1, obrigatório)
    name:     string (min 1, obrigatório)
  }
}

// Finalizar pedido
finishOrderSchema: {
  body: {
    order_id: string (UUID, min 1, obrigatório)
  }
}

// Deletar pedido
deleteOrderSchema: {
  query: {
    order_id: string (UUID, min 1, obrigatório)
  }
}
```

**Middleware validateSchema** ([src/middlewares/validateSchema.ts](src/middlewares/validateSchema.ts)):
- Executa `schema.parseAsync({ body, query, params })`
- Em caso de erro, retorna 400 com detalhes dos erros Zod (path, message, code)
- Passa adiante se validação sucede

---

## 6. Middlewares Principais
**isAuthenticated** ([src/middlewares/isAuthenticated.ts](src/middlewares/isAuthenticated.ts))
- **Propósito:** Valida JWT e injeta user_id no request
- **Implementação:**
  1. Lê header `Authorization: Bearer <token>`
  2. Extrai token da string (remove "Bearer ")
  3. Valida token com `jwt.verify(token, process.env.JWT_SECRET)`
  4. Extrai `sub` (ID do usuário) do payload
  5. Injeta em `(req as any).user_id = sub`
  6. Passa controle ao próximo middleware/controller
- **Erros:**
  - 401 Unauthorized: Token ausente, inválido, expirado ou JWT_SECRET incorreto

**isAdmin** ([src/middlewares/isAdmin.ts](src/middlewares/isAdmin.ts))
- **Propósito:** Verifica se usuário é administrador
- **Implementação:**
  1. Lê `(req as any).user_id` injetado por `isAuthenticated`
  2. Consulta usuário via Prisma: `prisma.user.findUnique({ where: { id: user_id } })`
  3. Verifica se `user.role === "ADMIN"`
  4. Se sim, passa controle adiante
  5. Se não, retorna 403 Forbidden
- **Dependência:** Deve vir após `isAuthenticated` na sequência de middlewares
- **Erros:**
  - 403 Forbidden: Usuário não é administrador
  - 400 Bad Request: Usuário não encontrado ou sem autenticação

**validateSchema** ([src/middlewares/validateSchema.ts](src/middlewares/validateSchema.ts))
- **Propósito:** Valida estrutura e conteúdo de requisição com schemas Zod
- **Implementação:**
  1. Recebe schema Zod como parâmetro: `validateSchema(createUserSchema)`
  2. Chama `schema.parseAsync({ body: req.body, query: req.query, params: req.params })`
  3. Se sucesso: passa controle ao próximo middleware/controller
  4. Se erro: retorna 400 Bad Request com array de erros Zod (path, message, code)
- **Posicionamento:** Pode vir antes ou depois de `isAuthenticated` dependendo se precisa de autenticação
- **Erros:**
  - 400 Bad Request: Validação falhou com detalhes dos campos inválidos

**Sequência Típica de Middlewares em uma Rota:**
```typescript
router.post('/order', 
  isAuthenticated,              // 1. Valida JWT, injeta user_id
  validateSchema(createOrderSchema),  // 2. Valida body
  new CreateOrderController().handle   // 3. Executa controller
)

router.post('/product',
  isAuthenticated,              // 1. Valida JWT
  isAdmin,                       // 2. Verifica role ADMIN
  upload.single('file'),        // 3. Processa upload Multer
  validateSchema(createProductSchema),  // 4. Valida dados
  new CreateProductController().handle   // 5. Executa controller
)
```

**Tipo Estendido para Express Request:**
Arquivo: [src/@types/express/index.d.ts](src/@types/express/index.d.ts)
- Estende interface `Express.Request` com propriedade `user_id?: string`
- Permite TypeScript reconhecer `(req as any).user_id` sem erros
- Configurado no `tsconfig.json` com `"typeRoots": ["./node_modules/@types", "./src/@types"]`

---

## 7. Configurações Importantes
**Multer (Upload de Arquivos):**
- Arquivo config: [src/config/multer.ts](src/config/multer.ts) e [src/config/multer2.ts](src/config/multer2.ts)
- Usado em: `POST /product` para upload de banner
- Configuração: 
  - Salva arquivos em pasta `tmp/` com timestamp como nome
  - Filtros: aceita apenas imagens (MIME types)
  - Campo de form: `file` (single file)
- Middleware: `upload.single('file')` cria `req.file` com propriedades:
  - `filename`: Nome do arquivo salvo
  - `path`: Caminho relativo
  - `mimetype`: Tipo MIME (image/jpeg, etc.)
- Resposta: Multer gera URL do banner como `http://localhost:3000/files/[filename]`

**Servindo Arquivos Estáticos:**
- Em [src/server.ts](src/server.ts): `app.use('/files', express.static('tmp'))`
- Permite acessar arquivos via GET `/files/*`

**Autenticação JWT:**
- Secret: `process.env.JWT_SECRET` (deve estar em `.env`)
- Usado em:
  - [isAuthenticated.ts](src/middlewares/isAuthenticated.ts) - Validação de token
  - [AuthUserService.ts](src/services/user/AuthUserService.ts) - Geração de token
- Biblioteca: `jsonwebtoken` (v9.0.2)
- Payload do token: `{ sub: user_id, iat: timestamp }`

**Hash de Senhas:**
- Biblioteca: `bcryptjs` (v3.0.3)
- Usado em: [CreateUserService.ts](src/services/user/CreateUserService.ts) e [AuthUserService.ts](src/services/user/AuthUserService.ts)
- Processo:
  1. Criação: `bcryptjs.hash(password, 10)` → cria hash com salt 10
  2. Verificação: `bcryptjs.compare(inputPassword, storedHash)` → compara

**Variáveis de Ambiente (.env):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria"
JWT_SECRET="sua_chave_super_secreta_aqui"
NODE_ENV="development"
PORT=3000
```

**TypeScript Config** ([tsconfig.json](tsconfig.json)):
- Target: ES2020 ou similar
- Module: commonjs
- Strict mode ativado
- typeRoots: `["./node_modules/@types", "./src/@types"]` para reconhecer tipos estendidos
- outDir: `./dist/` (compilado)

**Prisma Config** ([prisma.config.ts](prisma.config.ts)):
- Define cliente Prisma e banco de dados
- Migrations automáticas via `prisma migrate dev`

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

---

## 8. Dependências e Versões (package.json)
Arquivo: [package.json](package.json)

**Dependências de Runtime:**
| Pacote | Versão | Propósito |
|--------|--------|----------|
| `@prisma/client` | ^6.19.0 | ORM para operações de banco de dados |
| `express` | ^5.1.0 | Framework web HTTP |
| `typescript` | ^5.9.3 | Compilador TypeScript |
| `jsonwebtoken` | ^9.0.2 | Geração e validação de JWT |
| `bcryptjs` | ^3.0.3 | Hash de senhas |
| `zod` | ^4.1.13 | Validação de schemas (tipo-safe) |
| `multer` | ^2.0.2 | Middleware para upload de arquivos |
| `cors` | ^2.8.5 | Middleware CORS |
| `dotenv` | ^17.2.3 | Carregamento de variáveis de ambiente |

**Dependências de Desenvolvimento:**
| Pacote | Versão | Propósito |
|--------|--------|----------|
| `prisma` | ^6.19.0 | CLI e gerador de código Prisma |
| `ts-node-dev` | ^2.0.0 | Execução e recarregamento de TypeScript |
| `@types/express` | ^5.0.5 | Type definitions para Express |
| `@types/node` | ^24.10.1 | Type definitions para Node.js |
| `@types/multer` | * | Type definitions para Multer |

**Compatibilidade:**
- Node.js: 18.x ou superior (recomendado 20.x+)
- npm: 9.x ou superior
- PostgreSQL: 12.x ou superior

---

## 9. Fluxos de Negócio Principais

### Fluxo 1: Autenticação e Criação de Usuário

```
Cliente → POST /users { name, email, password }
  ↓ validateSchema(createUserSchema)
  ↓ CreateUserController.handle()
  ↓ CreateUserService.execute()
    - Hash senha com bcryptjs
    - Valida email único
    - Cria user em banco (role = STAFF)
  ↓ Controller retorna usuário (sem senha)
  ← JSON { id, name, email, role, created_At, updated_At }

Cliente → POST /session { email, password }
  ↓ validateSchema(authUserSchema)
  ↓ AuthUserController.handle()
  ↓ AuthUserService.execute()
    - Busca usuário por email
    - Valida password com bcryptjs
    - Gera JWT com jwt.sign({ sub: user_id })
  ↓ Controller retorna usuário + token
  ← JSON { auth: { id, name, email, role, token: "JWT..." } }
```

### Fluxo 2: Criar Produto (Requer Admin)

```
Cliente → POST /product { name, price, description, category_id, file }
  ↓ isAuthenticated (valida JWT)
  ↓ isAdmin (verifica role = ADMIN)
  ↓ upload.single('file') (Multer processa arquivo)
  ↓ validateSchema(createProductSchema)
  ↓ CreateProductController.handle()
  ↓ CreateProductService.execute()
    - Valida categoria existe
    - Processa image via Multer (salva em tmp/)
    - Converte price string → Int (em centavos)
    - Cria product em banco
  ↓ Controller retorna produto com URL do banner
  ← JSON { id, name, price, description, banner: "http://...", ... }
```

### Fluxo 3: Criar e Gerenciar Pedido

```
Cliente → POST /order { table }
  ↓ isAuthenticated
  ↓ validateSchema(createOrderSchema)
  ↓ CreateOrderController.handle()
  ↓ CreateOrderService.execute()
    - Cria order com status=false, draft=true
  ← JSON { id, table, status, draft, name: null, ... }

Cliente → POST /order/add { order_id, product_id, amount }
  ↓ isAuthenticated
  ↓ validateSchema(addItemSchema)
  ↓ AddItemController.handle()
  ↓ AddItemOrderService.execute()
    - Valida order e product existem
    - Se item já existe: atualiza amount
    - Se não existe: cria novo item
  ← JSON { id, amount, product_id, order_id, ... }

Cliente → GET /order/detail?order_id=...
  ↓ isAuthenticated
  ↓ validateSchema(detailOrderSchema)
  ↓ DetailOrderController.handle()
  ↓ DetailOrderService.execute()
    - Busca order com todos Items relacionados
    - Inclui dados completos de cada Product
  ← JSON { id, table, status, draft, name, Items: [ ... ] }

Cliente → PUT /order/send { order_id, name }
  ↓ isAuthenticated
  ↓ validateSchema(sendOrderSchema)
  ↓ SendOrderController.handle()
  ↓ SendOrderService.execute()
    - Atualiza order: draft=false, name=provided
    - Envia para produção
  ← JSON { id, table, status, draft: false, name, ... }

Cliente → PUT /order/finish { order_id }
  ↓ isAuthenticated
  ↓ validateSchema(finishOrderSchema)
  ↓ FinishOrderController.handle()
  ↓ FinishOrderService.execute()
    - Atualiza order: status=true
    - Marca como pronto
  ← JSON { id, table, status: true, draft: false, ... }
```

### Fluxo 4: Listar Produtos com Filtros

```
Cliente → GET /products?disabled=false
  ↓ isAuthenticated
  ↓ validateSchema(listProductsSchema)
  ↓ ListProductsController.handle()
  ↓ ListProductsService.execute()
    - Query param disabled transformado em boolean
    - Busca products onde disabled = parametro
  ← JSON [ { id, name, price, banner, disabled: false, ... }, ... ]

Cliente → GET /category/product?category_id=...
  ↓ isAuthenticated
  ↓ validateSchema(listproductByCategorySchema)
  ↓ ListByCategoryController.handle()
  ↓ ListByCategoryService.execute()
    - Busca products filtrando por category_id
  ← JSON [ { id, name, price, category_id, ... }, ... ]
```

---

## 10. Padrões e Convenções de Código

**Nomenclatura:**
- Controllers: `[Ação][Entidade]Controller.ts` (ex: CreateUserController)
- Services: `[Ação][Entidade]Service.ts` (ex: CreateUserService)
- Schemas: `[entidade]Schema.ts` (ex: userSchema)
- Middlewares: `[validacao].ts` (ex: isAuthenticated)

**Padrão de Controller:**
```typescript
class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body
    const service = new CreateUserService()
    const result = await service.execute({ name, email, password })
    return res.json(result)
  }
}
```

**Padrão de Service:**
```typescript
class CreateUserService {
  async execute({ name, email, password }: IRequest): Promise<IResponse> {
    // Validações
    if (!email || !password) throw new Error("...")
    
    // Operações
    const hashedPassword = await bcryptjs.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "STAFF" }
    })
    
    // Retorno (sem senha)
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
```

**Tratamento de Erros:**
- Services lançam `throw new Error("mensagem")` para erros
- Controllers capturam e retornam via `res.status(400).json({ error: "..." })`
- Middlewares interrompem a cadeia retornando response direto

**Type Safety:**
- Todas as funções recebem/retornam tipos TypeScript
- Interfaces para request/response de cada serviço
- Prisma gera tipos automaticamente

---

## 11. Observações e Recomendações

**Segurança:**
- ✅ Senhas com hash bcryptjs (salt 10)
- ✅ JWT para autenticação stateless
- ✅ Validação Zod em todas as rotas
- ✅ Verificação de role (ADMIN/STAFF)
- ⚠️ **TODO:** Implementar rate limiting
- ⚠️ **TODO:** HTTPS em produção
- ⚠️ **TODO:** Sanitização adicional de inputs

**Performance:**
- Prisma com índices automáticos (recomendado adicionar mais para email, category_id)
- Considerar paginação para endpoints de listagem (GET /products, GET /orders)
- Cache de categorias (mudam pouco)

**Qualidade de Código:**
- ⚠️ **TODO:** Tratamento de erros centralizado (middleware de erro global)
- ⚠️ **TODO:** Logging estruturado (Winston, Morgan)
- ⚠️ **TODO:** Testes unitários e integração (Jest)
- ⚠️ **TODO:** Documentação API com Swagger/OpenAPI

**Banco de Dados:**
- Relacionamento User → Order está ausente (pode ser adicionado)
- Considerar adicionar campos: `deleted_at` para soft deletes
- Validar índices em chaves estrangeiras (category_id, product_id, order_id)

**Escalabilidade:**
- Arquitetura em camadas está pronta para crescimento
- Pode adicionar camada de repository para abstrair Prisma
- Considerar queue (Bull, RabbitMQ) para operações assíncronas

---

## 12. Documentação Adicional

Para detalhes completos e exemplos de requisições/respostas, consulte:
- 📄 [endpoints.md](endpoints.md) - Documentação detalhada de todos os 16 endpoints

---

**Última atualização:** 28 de Dezembro de 2025