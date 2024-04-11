import { API_KEY, CLOUD_API_KEY } from '$env/static/private';

const myHeaders = new Headers();
myHeaders.append('Authorization', 'Basic ' + CLOUD_API_KEY);

interface UploadFile {
	asset_id: string;
	public_id: string;
	version: number;
	version_id: string;
	signature: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	tags: any[];
	bytes: number;
	type: string;
	etag: string;
	placeholder: boolean;
	url: string;
	secure_url: string;
	folder: string;
	existing: boolean;
	original_filename: string;
}

interface UploadError {
	error: Error;
}

interface Error {
	message: string;
}

export function isUploadFile(result: UploadFile | UploadError): result is UploadFile {
	return (result as UploadFile).url !== undefined;
}

export async function uploadImage(file: File, options: { public_id: string; folder: string }) {
	const formdata = new FormData();
	formdata.append('file', file, '[PROXY]');
	formdata.append('upload_preset', 'ml_default');
	formdata.append('public_id', options.public_id);
	formdata.append('api_key', API_KEY);
	formdata.append('folder', options.folder);

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: formdata
	};

	const result = await fetch(
		'https://api.cloudinary.com/v1_1/dha34yfz4/image/upload',
		requestOptions
	);

	if (result.ok) {
		return (await result.json()) as UploadFile;
	}

	return (await result.json()) as UploadError;
}

export async function deleteImage(image: string) {
	const formdata = new FormData();
	formdata.append('public_ids[]', image);

	const requestOptions = {
		method: 'DELETE',
		headers: myHeaders,
		body: formdata
	};

	await fetch('https://api.cloudinary.com/v1_1/dha34yfz4/resources/image/upload/', requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.error(error));
}

export async function deleteImages(images: string[]) {
	const formdata = new FormData();
	images.forEach((imageId) => {
		formdata.append('public_ids[]', imageId);
	});

	const requestOptions = {
		method: 'DELETE',
		headers: myHeaders,
		body: formdata
	};

	await fetch('https://api.cloudinary.com/v1_1/dha34yfz4/resources/image/upload/', requestOptions)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.error(error));
}
