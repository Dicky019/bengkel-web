// src/lib/server/db.ts
import { schemas } from './schemas';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql, createPool } from '@vercel/postgres';
import { POSTGRES_URL, NODE_ENV } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export const db = drizzle(NODE_ENV === 'development' ? pool : sql, { schema: schemas });
