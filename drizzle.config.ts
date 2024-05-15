// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/db/schemas',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.POSTGRES_URL!
	}
} satisfies Config;
