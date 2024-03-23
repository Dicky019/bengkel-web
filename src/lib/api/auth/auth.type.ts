import type { z } from 'zod';
import type { authLoginSchema } from './auth.schema';

export interface GetGoogleUser {
	accessToken: string;
}

export interface GoogleUser {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

export type LoginSchema = z.infer<typeof authLoginSchema>;
