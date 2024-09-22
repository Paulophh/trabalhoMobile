import { SQLiteDatabase } from "expo-sqlite";

export async function initDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS Tamagotchi (
            ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            hunger INTEGER DEFAULT 100,
            happiness INTEGER DEFAULT 100,
            energy INTEGER DEFAULT 100,
            status INTEGER DEFAULT 1,
            imageUrl TEXT
        );
    `);
}

