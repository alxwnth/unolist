import Dexie, { type EntityTable } from 'dexie'

interface Note {
  id: number
  content: string
}

const db = new Dexie('NotesDatabase') as Dexie & {
  notes: EntityTable<Note, 'id'>
}

db.version(1).stores({
  notes: '++id, content',
})

export type { Note }
export { db }
