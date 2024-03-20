import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google } from '$lib/auth/oauth';
import { generateState, generateCodeVerifier } from 'arctic';

export const GET: RequestHandler = async (event) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();

	event.cookies.set('google_oauth_code_verifier', codeVerifier, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	const authorizationURL = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email']
	});

	redirect(302, authorizationURL.toString());
};
