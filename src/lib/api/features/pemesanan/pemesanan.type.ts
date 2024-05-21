import type { z } from 'zod';
import type {
	insertPemesananSchema,
	pacthPemesananSchema,
	pemesananIdSchema,
	updatePemesananSchema,
	pemesananQuerySchema
} from './pemesanan.schema';
import type { pemesananTable } from '$lib/db/schemas/pemesanan';
import type { ClientType } from '$api';

// Types for Pemesanans - used to type API request params and within Components
export type Pemesanan = typeof pemesananTable.$inferSelect;
// export type PemesananRole = Pemesanan['role'];
export type NewPemesananSchema = z.infer<typeof insertPemesananSchema>;
export type UpdatePemesananSchema = z.infer<typeof updatePemesananSchema>;
export type PacthPemesananSchema = z.infer<typeof pacthPemesananSchema>;
export type PemesananId = z.infer<typeof pemesananIdSchema>['id'];

export type PemesanansQuery = z.infer<typeof pemesananQuerySchema>;

type CompleteApiPemesanan = ClientType['api']['pemesanan'];

type Pemesanans = Awaited<ReturnType<CompleteApiPemesanan['$get']>>;

export type CompletePemesanans = Awaited<ReturnType<Pemesanans['json']>>;
