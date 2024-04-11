export async function getImageFile({
	url,
	filename
}: {
	url: string | null;
	filename: string;
}): Promise<File | undefined> {
	try {
		if (!url) {
			return;
		}

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch image. Status code: ${response.status}`);
		}

		const contentType = response.headers.get('content-type');
		if (!contentType) {
			throw new Error('No content type header found in response');
		}

		const buffer = await response.arrayBuffer();
		const file = new File([buffer], filename, { type: contentType });

		return file;
	} catch (error) {
		console.error('Error saving image:', error);
	}
}
