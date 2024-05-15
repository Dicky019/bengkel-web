import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { userTable } from './auth';
import { generateId } from 'lucia';

export const pengendaraTable = pgTable('pengendara', {
	id: text('id')
		.primaryKey()
		.$default(() => generateId(40)),
	noTelephone: varchar('no_telephone').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' })
		.unique(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const pengendaraRelations = relations(pengendaraTable, ({ one }) => ({
	user: one(userTable, {
		fields: [pengendaraTable.userId],
		references: [userTable.id]
	})
}));
