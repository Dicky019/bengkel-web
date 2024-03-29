export enum Role {
	Admin = 'admin',
	Motir = 'motir',
	Pengendara = 'pengendara'
}

export interface Meta {
	page_size: number;
	current_page: number;
	last_page: number;
	total: number;
	prev: number | null;
	next: number | null;
}
