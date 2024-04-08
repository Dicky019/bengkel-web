// src/lib/server/db.ts
import { auth, todo, pengendara } from './schemas';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

export const db = drizzle(sql, { schema: { ...auth, ...todo, ...pengendara } });
