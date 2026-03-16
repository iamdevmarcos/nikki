import { and, desc, eq, gte, like, lte, or } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Crypto from "expo-crypto";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../db/client";
import { Note, notes } from "../db/schema";

const HOURS_END = 23;
const MINUTES_END = 59;
const SECONDS_END = 59;
const MS_END = 999;
const GLOBAL_NOTES_LIMIT = 1;

export const useNotes = (selectedDate?: Date) => {
  const [notesList, setNotesList] = useState<Note[]>([]);

  const query = useMemo(() => {
    let q = db.select().from(notes).$dynamic();
    
    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(HOURS_END, MINUTES_END, SECONDS_END, MS_END);

      q = q.where(
        and(
          gte(notes.createdAt, startOfDay),
          lte(notes.createdAt, endOfDay)
        )
      );
    }
    
    return q.orderBy(desc(notes.createdAt));
  }, [selectedDate]);

  const { data } = useLiveQuery(query);

  const { data: globalData } = useLiveQuery(
    db.select({ id: notes.id }).from(notes).limit(GLOBAL_NOTES_LIMIT)
  );
  const hasAnyNotesGlobally = (globalData && globalData.length > 0) || false;

  const { data: allNoteDatesData } = useLiveQuery(
    db.select({ createdAt: notes.createdAt }).from(notes)
  );

  const noteCountsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    if (allNoteDatesData) {
      allNoteDatesData.forEach((note) => {
        const dateStr = note.createdAt.toISOString().split("T")[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      });
    }
    return counts;
  }, [allNoteDatesData]);

  const refreshNotes = useCallback(async () => {
    try {
      let q = db.select().from(notes).$dynamic();
      
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(HOURS_END, MINUTES_END, SECONDS_END, MS_END);

        q = q.where(
          and(
            gte(notes.createdAt, startOfDay),
            lte(notes.createdAt, endOfDay)
          )
        );
      }
      
      const result = await q.orderBy(desc(notes.createdAt));
      setNotesList(result);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (data) {
      setNotesList(data);
    }
  }, [data]);

  const addNote = async (title: string, description: string, date?: Date) => {
    try {
      await db.insert(notes).values({
        id: Crypto.randomUUID(),
        title: title || "",
        content: description || "",
        createdAt: date || new Date(),
        updatedAt: new Date(),
        isSynced: false,
      });
      await refreshNotes();
    } catch (err) {
      console.error("Database insert error:", err);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await db.delete(notes).where(eq(notes.id, id));
      await refreshNotes();
    } catch (err) {
      console.error("Database delete error:", err);
      throw err;
    }
  };

  const updateNote = async (id: string, title: string, content: string, date?: Date) => {
    try {
      await db.update(notes)
        .set({
          title,
          content,
          createdAt: date,
          updatedAt: new Date(),
        })
        .where(eq(notes.id, id));
      await refreshNotes();
    } catch (err) {
      console.error("Database update error:", err);
      throw err;
    }
  };

  const searchNotes = async (query: string) => {
    if (!query.trim()) return [];
    try {
      const result = await db
        .select()
        .from(notes)
        .where(
          or(
            like(notes.title, `%${query}%`),
            like(notes.content, `%${query}%`)
          )
        )
        .orderBy(desc(notes.createdAt));
      return result;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  };

  return {
    notes: notesList,
    addNote,
    deleteNote,
    updateNote,
    searchNotes,
    refreshNotes,
    hasAnyNotesGlobally,
    noteCountsByDate,
  };
};

