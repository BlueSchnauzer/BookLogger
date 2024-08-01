import type {
	BookSearchResultListType,
	BookSearchResultType
} from '$lib/client/Application/Interface';
import { BookSearchView } from '$lib/client/Application/Views/BookSearch';
import type { IBookSearchRepository } from '$lib/client/Domain/Repositories/IBookSearch';

/**書誌データの操作を管理するUseCase */
export class BookSearchUseCase<
	ResultListType extends BookSearchResultListType,
	ResultType extends BookSearchResultType<BookSearchResultListType>
> {
	constructor(private readonly repos: IBookSearchRepository<ResultListType>) {}

	/**(あいまい検索)検索条件を指定して書誌データを取得する */
	public async searcyByFuzzyQuery(
		query: string,
		maxResults = 10,
		startIndex = 0
	): Promise<BookSearchView<ResultType>[] | undefined> {
		const response = await this.repos.searchByFuzzyQuery(query, maxResults, startIndex);

		return response.items?.map((item) => new BookSearchView(item)) as BookSearchView<ResultType>[];
	}

	/**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
	public async searchByQueries(
		booktitle: string,
		author: string,
		isbn_13: string,
		maxResults = 10,
		startIndex = 0
	): Promise<BookSearchView<ResultType>[] | undefined> {
		const response = await this.repos.searchByQueries(
			booktitle,
			author,
			isbn_13,
			maxResults,
			startIndex
		);

		return response.items?.map((item) => new BookSearchView(item)) as BookSearchView<ResultType>[];
	}
}
