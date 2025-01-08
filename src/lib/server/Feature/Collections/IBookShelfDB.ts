import type { id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { OrderFilters } from '$lib/client/Feature/Contents/interface';
import type { BookShelfDBModel } from './MongoDB/BookShelfModel';

export interface IBookShelfDBRepositories {
	getBookShelf(id: id): Promise<BookShelfDBModel | undefined>;
	getBookShelves(options: { query?: string; order?: OrderFilters }): Promise<BookShelfDBModel[]>;
	insert(bookShelf: BookShelfDBModel): Promise<Response>;
	update(bookShelf: BookShelfDBModel): Promise<Response>;
	delete(id: id): Promise<Response>;
}
