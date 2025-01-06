import type { id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { OrderFilters } from '$lib/client/Feature/Contents/interface';
import type { IBookShelfDBRepositories } from '../IBookShelfDB';
import type { BookShelfDBModel } from './BookShelfModel';

export class BookShelfMongoDBResource implements IBookShelfDBRepositories {
	getBookShelf(id: id): Promise<BookShelfDBModel | undefined> {
		throw new Error('Method not implemented.');
	}

	getBookShelves(
		page: number,
		options: { query?: string; order?: OrderFilters }
	): Promise<{ lastPageCount: number; totalCount: number; bookShelfDBModels: BookShelfDBModel[] }> {
		throw new Error('Method not implemented.');
	}

	insert(bookShelf: BookShelfDBModel): Promise<Response> {
		throw new Error('Method not implemented.');
	}

	update(bookShelf: BookShelfDBModel): Promise<Response> {
		throw new Error('Method not implemented.');
	}

	delete(id: id): Promise<Response> {
		throw new Error('Method not implemented.');
	}
}
