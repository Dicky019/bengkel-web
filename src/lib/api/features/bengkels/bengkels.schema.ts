import { bengkelTable } from '$lib/db/schemas/bengkel';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Schema for Bengkels - used to validate API requests
const defaultOmit = { createdAt: true, updatedAt: true, geoId: true } as const;
const baseSchema = createSelectSchema(bengkelTable);

export const insertBengkelSchema = createInsertSchema(bengkelTable)
	.omit({
		...defaultOmit,
		id: true
	})
	.extend({
		lat: z.string(),
		long: z.string()
	});

export const updateBengkelSchema = baseSchema.extend({}).omit(defaultOmit).extend({
	lat: z.string(),
	long: z.string()
});

export const setBengkelSchema = baseSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export const pacthBengkelSchema = updateBengkelSchema.partial();

export const bengkelIdSchema = baseSchema.pick({ id: true });

export const bengkelsQuerySchema = z.object({
	page: z.coerce.number().default(1),
	pageSize: z.coerce.number().default(10),
	name: z.string().optional()
});
