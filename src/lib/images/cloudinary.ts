// "use server";
import { v2 as cloudinary } from 'cloudinary';
import { CLOUD_NAME, API_KEY, API_SECRET } from '$env/static/private';

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: API_SECRET,
	secure: true
});

// cloudinary.config({
//   cloud_name: 'dha34yfz4',
//   api_key: '992755154279736',
//   api_secret: 'ucd42SPaljGvUVk49dR-NKcRFCc'
// });

export async function uploadImage(image: string, options: { public_id: string; folder: string }) {
	// const file = await dataUrlToFile(image, newProduct.name);
	const result = await cloudinary.uploader.upload(image, {
		...options,
		resource_type: 'auto',
		use_filename: true
	});
	return result.url;
}

export async function deleteImage(image: string) {
	// const file = await dataUrlToFile(image, newProduct.name);
	return await cloudinary.uploader.destroy(image);
}
