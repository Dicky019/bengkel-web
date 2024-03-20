import { redirect, type RequestEvent } from '@sveltejs/kit';
import { lucia } from '$lib/auth';
import { env } from '$env/dynamic/private';
import getGoogleUser from './get-google-user';
import { google } from '$lib/auth/oauth';
import oauthLogin from './db-transaction-user';

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
	const savedState = event.cookies.get('google_oauth_state');

	if (!codeVerifier || !savedState) {
		return Response.json(
			{ error: 'Code verifier or saved state is not exists' },
			{
				status: 400
			}
		);
	}

	if (savedState !== state) {
		return Response.json(
			{
				error: 'State does not match'
			},
			{
				status: 400
			}
		);
	}

	const { accessToken } = await google.validateAuthorizationCode(code, codeVerifier);
	const googleData = await getGoogleUser({
		accessToken,
		fetch: event.fetch
	});

	const dbTransactionUserAuth = await oauthLogin({
		email: googleData.email,
		provider: 'google',
		providerId: googleData.id,
		firstName: googleData.given_name,
		lastName: googleData.family_name,
		imageUrl: googleData.picture
	});

	const session = await lucia.createSession(dbTransactionUserAuth.id, {
		expiresIn: 60 * 60 * 24 * 30
	});
	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	event.cookies.delete('state', { path: '.' });
	event.cookies.delete('codeVerifier', { path: '.' });

	return redirect(302, new URL('/', env.VITE_VERCEL_URL));
}
