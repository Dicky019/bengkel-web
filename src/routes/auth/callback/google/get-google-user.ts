interface GetGoogleUser {
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

export default async function getUserInfo({
	accessToken,
	fetch
}: GetGoogleUser & {
	fetch(input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>;
}) {
	const googleRes = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
		method: 'GET'
	});

	const googleData = (await googleRes.json()) as GoogleUser;
	return googleData;
}
