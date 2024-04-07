import { pengendaraTable } from '$lib/db/schemas/pengendara';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Schema for Pengendaras - used to validate API requests
const defaultOmit = { id: true, createdAt: true, updatedAt: true } as const;
const baseSchema = createSelectSchema(pengendaraTable);

export const insertPengendaraSchema = createInsertSchema(pengendaraTable).omit({ ...defaultOmit });

export const updatePengendaraSchema = baseSchema.extend({}).omit({
	createdAt: true,
	updatedAt: true
});

export const setPengendaraSchema = baseSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
});

export const pacthPengendaraSchema = updatePengendaraSchema.partial();

export const pengendataIdSchema = baseSchema.pick({ id: true });
