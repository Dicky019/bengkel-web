import { userTable } from './schemas/auth';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

import { neon } from '@neondatabase/serverless';
import type { NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
dotenv.config({ path: './.env' });

if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env');

enum Role {
	motir = 'motir',
	pengendara = 'pengendara'
}
enum Provider {
	google = 'google',
	github = 'github'
}

const main = async () => {
	const sql: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL!);

	const db = drizzle(sql);

	const data: (typeof userTable.$inferInsert)[] = [];

	const [isAdmin] = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, 'dicky93darmawan@gmail.com'));

	if (!isAdmin) {
		data.push({
			email: 'dicky93darmawan@gmail.com',
			firstName: 'Dicky',
			lastName: 'Darmawan',
			imageUrl: faker.image.avatar(),
			provider: 'google',
			providerId: faker.database.mongodbObjectId(),
			role: 'admin'
		});
	}

	for (let i = 0; i < 20; i++) {
		data.push({
			email: faker.internet.email(),
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			imageUrl: faker.image.avatar(),
			provider: faker.helpers.enumValue(Provider),
			providerId: faker.database.mongodbObjectId(),
			role: faker.helpers.enumValue(Role)
		});
	}

	console.log('Seed start');
	const startTime = new Date();

	const users = await db.insert(userTable).values(data).returning();
	console.log({ users });

	console.log('Seed done');
	const endTime = new Date();

	const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;

	console.log('Elapsed time (milliseconds):', elapsedTime);
};

main();
