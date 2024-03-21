import { redirect, type RequestEvent } from '@sveltejs/kit';
import { google } from '$lib/auth/oauth';
import { VITE_VERCEL_URL } from '$env/static/private';

// NOTE: this could/probably should be moved over to the API

export async function GET(event: RequestEvent): Promise<Response> {
	const searchParams = event.url.searchParams;

	const code = searchParams.get('code');
	const state = searchParams.get('state');

	if (!code || !state) {
		return Response.json(
			{ error: 'Invalid request' },
			{
				status: 400
			}
		);
	}

	const codeVerifier = event.cookies.get('google_oauth_code_verifier');
	console.log({ codeVerifier });

	if (!codeVerifier) {
		return Response.json(
			{ error: 'Code verifier or saved state is not exists' },
			{
				status: 400
			}
		);
	}

	const { accessToken } = await google.validateAuthorizationCode(code, codeVerifier);

	event.cookies.set('google_access_token', accessToken, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return redirect(302, VITE_VERCEL_URL);
}
