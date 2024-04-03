import { relations } from 'drizzle-orm';
import { pgTable, varchar, uuid, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { userTable } from './auth';

export const todoTable = pgTable('todo', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	createdAt: timestamp('createdAt', {
		withTimezone: true,
		mode: 'date'
	})
		.notNull()
		.defaultNow(),
	completed: boolean('completed').notNull().default(false),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id)
});

export const todoRelations = relations(todoTable, ({ one }) => ({
	user: one(userTable, {
		fields: [todoTable.userId],
		references: [userTable.id]
	})
}));
