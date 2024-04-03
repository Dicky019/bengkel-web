import { relations } from 'drizzle-orm/relations';
import {
	pgEnum,
	pgTable,
	varchar,
	timestamp,
	uuid,
	unique,
	index,
	text
} from 'drizzle-orm/pg-core';
import { generateId } from 'lucia';

export const providerEnum = pgEnum('provider', ['google', 'github']);
export const roleEnum = pgEnum('role', ['admin', 'motir', 'pengendara']);

export const userTable = pgTable(
	'user',
	{
		id: text('id')
			.primaryKey()
			.$default(() => generateId(40)),
		provider: providerEnum('provider'),
		providerId: varchar('provider_id', { length: 255 }),
		firstName: varchar('first_name', { length: 100 }).notNull(),
		lastName: varchar('last_name', { length: 100 }).notNull(),
		imageUrl: varchar('image_url', { length: 255 }),
		email: varchar('email', { length: 100 }).notNull().unique(),
		role: roleEnum('role').notNull(),
		createdAt: timestamp('createdAt', {
			withTimezone: true,
			mode: 'date'
		})
			.notNull()
			.defaultNow()
	},
	(t) => ({
		indexEmail: index().on(t.email),
		indexId: index().on(t.id)
	})
);

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	})
}));

export const userRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable)
}));
