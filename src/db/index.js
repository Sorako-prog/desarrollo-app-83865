import * as SQLite from 'expo-sqlite'

let db

export const initDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('blockbuster.db')
    }
}

export const initSessionTable = async () => {
    await initDatabase()
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            localId TEXT,
            email TEXT
    )`)
}

export const saveSession = async (email, localId) => {
    await initSessionTable()
    await db.runAsync('DELETE FROM session')
    await db.runAsync('INSERT INTO session (localId, email) VALUES (?, ?)', localId, email)
}

export const getSession = async () => {
    await initSessionTable()
    const row = await db.getFirstAsync('SELECT localId, email FROM session ORDER BY id DESC LIMIT 1')
    return row ?? null
}

export const deleteSession = async () => {
    await initSessionTable()
    await db.runAsync('DELETE FROM session')
}