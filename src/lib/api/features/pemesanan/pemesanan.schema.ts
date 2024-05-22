import { pemesananTable } from '$lib/db/schemas/pemesanan';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Schema for Pemesanans - used to validate API requests
const defaultOmit = { createdAt: true, updatedAt: true } as const;
const baseSchema = createSelectSchema(pemesananTable);

export const insertPemesananSchema = createInsertSchema(pemesananTable)
	.omit({
		...defaultOmit,
		id: true
	})
	.extend({
		lat: z.string(),
		long: z.string()
	});

export const updatePemesananSchema = baseSchema.extend({}).omit(defaultOmit).extend({
	lat: z.string(),
	long: z.string()
});

export const pacthPemesananSchema = updatePemesananSchema.partial();

export const pemesananIdSchema = baseSchema.pick({ id: true });

export const pemesananQuerySchema = z.object({
	page: z.coerce.number().default(1),
	pageSize: z.coerce.number().default(10),
	name: z.string().optional(),
	id: z.string().optional(),
	role: z.enum(['bengkel', 'pengendara']).optional()
});
