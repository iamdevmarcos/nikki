import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "../db/client";
import { notes } from "../db/schema";

export const useNotes = () => {
  const { data } = useLiveQuery(
    db.select().from(notes).orderBy(notes.createdAt),
  );

  const addNote = async (title: string, description: string) => {
    await db.insert(notes).values({
      id: crypto.randomUUID(),
      title,
      content: description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return {
    notes: data,
    addNote,
  }; 
};
