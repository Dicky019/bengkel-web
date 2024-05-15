// src/lib/server/db.ts
import { schemas } from './schemas';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql, createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export const db = drizzle(process.env.NODE_ENV === 'development' ? pool : sql, { schema: schemas });
