import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './auth';

export const todoTable = sqliteTable('todo', {
	id: text('id', { length: 100 }).primaryKey(),
	name: text('name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	completed: integer('completed', { mode: 'boolean' }).notNull(),
	userId: text('user_id', { length: 100 })
		.references(() => userTable.id)
		.notNull()
});

export const todoRelations = relations(todoTable, ({ one }) => ({
	user: one(userTable, {
		fields: [todoTable.userId],
		references: [userTable.id]
	})
}));
