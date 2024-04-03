// src/lib/server/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { auth, todo } from './schemas';
import { DATABASE_URL } from '$env/static/private';
import { Pool, type NeonQueryFunction, neon } from '@neondatabase/serverless';

// const client = createClient({
// 	url: DATABASE_URL,
// 	authToken: DATABASE_AUTH_TOKEN
// });

const sql: NeonQueryFunction<boolean, boolean> = neon(DATABASE_URL);

export const db = drizzle(sql, { schema: { ...auth, ...todo } });
