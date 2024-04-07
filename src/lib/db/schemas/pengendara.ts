import { relations } from 'drizzle-orm';
import { pgTable, varchar, uuid, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { userTable } from './auth';

export const pengendaraTable = pgTable('pengendara', {
	id: uuid('id').primaryKey().defaultRandom(),
	noTelephone: varchar('no_telephone').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const pengendaraRelations = relations(pengendaraTable, ({ one }) => ({
	user: one(userTable, {
		fields: [pengendaraTable.userId],
		references: [userTable.id]
	})
}));
