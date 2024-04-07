import type { z } from 'zod';
import type {
	insertPengendaraSchema,
	pacthPengendaraSchema,
	pengendataIdSchema,
	setPengendaraSchema,
	updatePengendaraSchema
} from './pengendara.schema';
import type { pengendaraTable } from '$lib/db/schemas/pengendara';

// Types for Pengendaras - used to type API request params and within Components
export type Pengendara = typeof pengendaraTable.$inferSelect;
// export type PengendaraRole = Pengendara['role'];
export type NewPengendaraSchema = z.infer<typeof insertPengendaraSchema>;
export type UpdatePengendaraSchema = z.infer<typeof updatePengendaraSchema>;
export type SetPengendaraSchema = z.infer<typeof setPengendaraSchema>;
export type PacthPengendaraSchema = z.infer<typeof pacthPengendaraSchema>;
export type PengendaraId = z.infer<typeof pengendataIdSchema>['id'];
