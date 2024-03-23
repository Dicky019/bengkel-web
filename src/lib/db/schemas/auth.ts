import { relations } from 'drizzle-orm/relations';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { todoTable } from './todo';
import { generateId } from 'lucia';

export const userTable = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => generateId(40)),
	provider: text('provider', { enum: ['google', 'github'] }).notNull(),
	providerId: text('provider_id', { length: 255 }).notNull(),
	firstName: text('first_name', { length: 100 }).notNull(),
	lastName: text('last_name', { length: 100 }).notNull(),
	imageUrl: text('image_url', { length: 255 }).notNull().unique(),
	email: text('email', { length: 100 }).notNull().unique(),
	role: text('role', { enum: ['admin', 'motir', 'pengendara'] }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull()
});

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull()
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	})
}));

export const userRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable),
	todos: many(todoTable)
}));
