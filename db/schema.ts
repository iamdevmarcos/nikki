import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
  isSynced: integer("is_synced", {
    mode: "boolean",
  }).default(false),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferSelect;
