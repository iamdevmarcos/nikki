import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

const expoDb = SQLite.openDatabaseSync("nikki.db");

export const db = drizzle(expoDb);
