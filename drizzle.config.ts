// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/db/schemas',
	out: './drizzle/migrations',
	driver: 'turso',
	dbCredentials: {
		url: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : 'http://127.0.0.1:8080',
		authToken: process.env.NODE_ENV === 'production' ? process.env.DATABASE_AUTH_TOKEN : undefined
	}
} satisfies Config;
