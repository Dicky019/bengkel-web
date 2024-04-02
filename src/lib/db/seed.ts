import { drizzle } from 'drizzle-orm/libsql';
import { userTable } from './schemas/auth';
import { faker } from '@faker-js/faker';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
dotenv.config({ path: './.env' });

// if (!('DATABASE_URL' in process.env)) throw new Error('DATABASE_URL not found on .env');
// if (!('DATABASE_AUTH_TOKEN' in process.env))
// 	throw new Error('DATABASE_AUTH_TOKEN not found on .env');

enum Role {
	motir = 'motir',
	pengendara = 'pengendara'
}
enum Provider {
	google = 'google',
	github = 'github'
}

const main = async () => {
	const client = createClient({
		url: 'http://127.0.0.1:8080'
		// authToken: process.env.DATABASE_AUTH_TOKEN!
	});

	const db = drizzle(client);
	const data: (typeof userTable.$inferInsert)[] = [];

	const isAdmin = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, 'dicky93darmawan@gmail.com'))
		.get();

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

	console.log('Seed start', new Date());
	const users = await db.insert(userTable).values(data).returning();
	console.log({ users });

	console.log('Seed done');
};

main();
