import { relations } from 'drizzle-orm/relations';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { todoTable } from './todo';
import { sql } from 'drizzle-orm';
import { generateId } from 'lucia';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

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
		.default(sql`(CURRENT_TIMESTAMP)`)
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

// Schema for Users - used to validate API requests
const defaultOmit = { id: true, userId: true, createdAt: true } as const;
const baseSchema = createSelectSchema(userTable);

const insertUserSchema = createInsertSchema(userTable).omit({ ...defaultOmit });
const LoginUserSchemaAdmin = insertUserSchema.pick({ providerId: true, email: true });

export const updateUserSchema = baseSchema.extend({}).omit({
	...defaultOmit,
	provider: true,
	providerId: true
});

export const pacthUserSchema = updateUserSchema.partial();

export const UserIdSchema = baseSchema.pick({ id: true });

// Types for Users - used to type API request params and within Components
export type User = typeof userTable.$inferSelect;
export type UserRole = User['role'];
export type NewUserSchema = z.infer<typeof insertUserSchema>;
export type NewUserSchemaAdmin = z.infer<typeof LoginUserSchemaAdmin>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type PacthUserSchema = z.infer<typeof pacthUserSchema>;
export type UserId = z.infer<typeof UserIdSchema>['id'];
