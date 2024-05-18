import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { generateId } from 'lucia';
import { pengendaraTable } from './pengendara';
import { bengkelTable } from './bengkel';

export const pemesananTable = pgTable('pemesanan', {
	id: text('id')
		.primaryKey()
		.$default(() => generateId(40)),
	messagesId: varchar('messages_id').notNull(),
	merek_motor: varchar('merek_motor').notNull(),
	image_motor: varchar('image_motor').notNull(),
	description: varchar('description').notNull(),
	pengendaraId: text('pengendara_id')
		.notNull()
		.references(() => pengendaraTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.unique(),
	bengkelId: text('bengkel_id')
		.notNull()
		.references(() => bengkelTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.unique(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const pemesananRelations = relations(pemesananTable, ({ one }) => ({
	pengendara: one(pengendaraTable, {
		fields: [pemesananTable.pengendaraId],
		references: [pengendaraTable.id]
	}),
	bengkel: one(bengkelTable, {
		fields: [pemesananTable.bengkelId],
		references: [bengkelTable.id]
	})
}));
