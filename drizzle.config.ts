// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/db/schemas',
	out: './drizzle/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL!
	}
} satisfies Config;
