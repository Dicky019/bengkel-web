import { userTable } from '$lib/db/schemas/auth';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '$lib/utils/index';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Schema for Users - used to validate API requests
const defaultOmit = { id: true, createdAt: true } as const;
const baseSchema = createSelectSchema(userTable);

export const imageSchema = z
	.instanceof(File)
	.refine((file) => file.size < MAX_FILE_SIZE, 'File size must be less than 2MB')
	.refine(
		(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
		'Only .jpg, .jpeg, .png and .webp formats are supported.'
	)
	.optional();

export const insertUserSchema = createInsertSchema(userTable).omit({ ...defaultOmit });

export const userSchema = createInsertSchema(userTable)
	.extend({
		image: imageSchema
	})
	.omit({ ...defaultOmit, provider: true, providerId: true, createdAt: true, imageUrl: true });

export const updateUserSchema = insertUserSchema.extend({
	id: z.string()
});

export const userIdSchema = baseSchema.pick({ id: true });
export const userIdsSchema = z.object({
	usersIds: z.array(baseSchema.pick({ id: true }))
});

export const usersQuerySchema = z.object({
	page: z.coerce.number().default(1),
	pageSize: z.coerce.number().default(10),
	email: z.string().optional()
});
