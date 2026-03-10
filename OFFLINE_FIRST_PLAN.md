# 📝 Plano de Implementação: Offline-First com SQLite + Drizzle

Este documento detalha o passo a passo para implementar a persistência de dados local no Nikki, utilizando **SQLite** (via `expo-sqlite`) e **Drizzle ORM**.

---

## 🏗️ Stack Tecnológica
- **Banco de Dados:** SQLite (nativo do dispositivo).
- **ORM:** Drizzle ORM (TypeScript-first, leve e performático).
- **Migrations:** Drizzle Kit.

---

## �️ Detalhamento dos Arquivos

### 1. Definição do Schema (`db/schema.ts`)
Este arquivo define a estrutura das suas tabelas.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(), // Gerado via crypto.randomUUID()
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  isSynced: integer('is_synced', { mode: 'boolean' }).default(false),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
```

### 2. Configuração do Cliente (`db/client.ts`)
Inicializa a conexão com o banco de dados SQLite do Expo.

```typescript
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

const expoDb = SQLite.openDatabaseSync('nikki.db');
export const db = drizzle(expoDb);
```

### 3. Configuração do Drizzle Kit (`drizzle.config.ts`)
Arquivo na raiz do projeto para gerenciar as migrações e o Studio.

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
  dbCredentials: {
    url: 'sqlite.db', // Arquivo local usado apenas pelo Studio no seu computador
  },
} satisfies Config;
```

### 4. Execução de Migrations (App Entry - `app/_layout.tsx`)
As migrações precisam ser aplicadas assim que o app carrega.

```typescript
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './db/migrations/migrations';
import { db } from './db/client';

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <View><Text>Erro ao carregar banco de dados: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Configurando banco de dados...</Text></View>;
  }

  return <Stack />; // Seu layout normal aqui
}
```

### 5. Hook de Acesso aos Dados (`hooks/useNotes.ts`)
Um exemplo simples de como buscar os dados.

```typescript
import { db } from '@/db/client';
import { notes } from '@/db/schema';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

export const useNotes = () => {
  // O drizzle fornece hooks que reagem a mudanças no banco automaticamente
  const { data } = useLiveQuery(db.select().from(notes).orderBy(notes.createdAt));
  
  const addNote = async (title: string, content: string) => {
    await db.insert(notes).values({
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return { notes: data, addNote };
};
```

---

## 🛠️ Fluxo de Trabalho de Desenvolvimento

1. **Alterou o Schema?**
   Rode `npx drizzle-kit generate` para gerar o novo arquivo SQL em `/db/migrations`.
2. **Nova Migration gerada?**
   O app irá detectar e aplicar automaticamente no próximo refresh (graças ao `useMigrations`).
3. **Quer ver os dados?**
   Use `npx drizzle-kit studio` para uma interface web.
