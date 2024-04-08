import type { z } from 'zod';
import type {
	insertBengkelSchema,
	pacthBengkelSchema,
	bengkelIdSchema,
	setBengkelSchema,
	updateBengkelSchema,
	bengkelsQuerySchema
} from './bengkel.schema';
import type { bengkelTable } from '$lib/db/schemas/bengkel';

// Types for Bengkels - used to type API request params and within Components
export type Bengkel = typeof bengkelTable.$inferSelect;
// export type BengkelRole = Bengkel['role'];
export type NewBengkelSchema = z.infer<typeof insertBengkelSchema>;
export type UpdateBengkelSchema = z.infer<typeof updateBengkelSchema>;
export type SetBengkelSchema = z.infer<typeof setBengkelSchema>;
export type PacthBengkelSchema = z.infer<typeof pacthBengkelSchema>;
export type BengkelId = z.infer<typeof bengkelIdSchema>['id'];

export type BengkelsQuery = z.infer<typeof bengkelsQuerySchema>;
