import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, text, index } from 'drizzle-orm/pg-core';
import { userTable } from './auth';
import { generateId } from 'lucia';

export const bengkelTable = pgTable(
	'bengkel',
	{
		id: text('id')
			.primaryKey()
			.$default(() => generateId(40)),
		name: varchar('name', { length: 100 }).notNull(),
		alamat: varchar('alamat').notNull(),
		noTelephone: varchar('no_telephone', { length: 20 }).notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id)
			.unique(),
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow()
	},
	(t) => ({
		indexEmail: index().on(t.name)
	})
);

export const bengkelRelations = relations(bengkelTable, ({ one }) => ({
	user: one(userTable, {
		fields: [bengkelTable.userId],
		references: [userTable.id]
	})
}));
