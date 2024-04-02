import { userTable } from '$lib/db/schemas/auth';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Schema for Users - used to validate API requests
const defaultOmit = { id: true, userId: true, createdAt: true } as const;
const baseSchema = createSelectSchema(userTable);

export const insertUserSchema = createInsertSchema(userTable).omit({ ...defaultOmit });

export const updateUserSchema = baseSchema.extend({}).omit({
	provider: true,
	providerId: true,
	createdAt: true
});

export const pacthUserSchema = updateUserSchema.partial();

export const userIdSchema = baseSchema.pick({ id: true });
export const userIdsSchema = z.object({
	usersIds: z.array(baseSchema.pick({ id: true }))
});

export const usersQuerySchema = z.object({
	page: z.coerce.number().default(1),
	pageSize: z.coerce.number().default(10),
	email: z.string().optional()
});
