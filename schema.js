// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init


/*
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  //url      = env("DATABASE_URL")
}

//criar uma migration: yarn prisma migrate dev
model User {
  id String @id @default(uuid())
  name String
  email String
  password String
  created_At DateTime?@default(now())
  updated_At DateTime?@default(now())

  @@map("users")
}

model Category {
  id String @id @default(uuid())
  name String 
  created_At DateTime?@default(now())
  updated_At DateTime?@default(now())

    @@map("categories")

    products Product[]
}

model Product {
  id String @id @default(uuid())
  name String 
  price String
  description String 
  banner String
  created_At DateTime?@default(now())
  updated_At DateTime?@default(now())

   category Category @relation (fields:[category_id], references: [id])
    @@map("products")

  Items Item[] //Um produto pode estar dentro de varios Items
  category_id String
  //Uma categoria pode estar em varios produtos
}

model Order {
  id String @id @default(uuid())
  table Int // numero da mesa
  status Boolean @default(false)
  draft Boolean @default(true)
  name String? //name eh opcional preencher por isso o '?'
  @@map("Order")

  Items Item[]
}

model Item {
    id String @id @default(uuid())
    amount Int
    created_At DateTime?@default(now())
    updated_At DateTime?@default(now())

  product Product @relation (fields:[product_id], references: [id])
  category Order @relation (fields:[order_id], references: [id])
  
  @@map("items")
 
  product_id String
  order_id String

  //Percepcao: um order pode estar em varios items
}*/