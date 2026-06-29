import { openDB } from 'idb'

const DB_NAME    = 'prepzero'
const DB_VERSION = 3
const META_STORE = 'sessions'
const BLOB_STORE = 'audio'

let _db = null

async function db() {
  if (_db) return _db
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(META_STORE)) {
        const s = db.createObjectStore(META_STORE, { keyPath: 'id' })
        s.createIndex('createdAt', 'createdAt')
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE)
      }
    },
  })
  return _db
}

export async function saveSession(session) {
  const d = await db()
  await d.put(META_STORE, session)
}

export async function getAllSessions() {
  const d = await db()
  const all = await d.getAll(META_STORE)
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteSession(id) {
  const d = await db()
  const tx = d.transaction([META_STORE, BLOB_STORE], 'readwrite')
  await Promise.all([
    tx.objectStore(META_STORE).delete(id),
    tx.objectStore(BLOB_STORE).delete(id),
    tx.done,
  ])
}

export async function saveAudioBlob(sessionId, blob) {
  if (!blob) return
  const d = await db()
  await d.put(BLOB_STORE, blob, sessionId)
}

export async function getAudioBlob(sessionId) {
  const d = await db()
  return d.get(BLOB_STORE, sessionId)
}
