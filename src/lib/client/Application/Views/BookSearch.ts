import { isGAPIResult, type BookSearchResultType } from '$lib/client/Application/Interface';

export class BookSearchView<T extends BookSearchResultType> {
	public readonly title?: string;
	public readonly authors?: string[];
	public readonly publisher?: string;
	public readonly publishDate?: string;
	public readonly pageCount?: number;
	public readonly thumbnail?: string;
	public readonly description?: string;

	constructor(public readonly searchResult: T) {
		if (isGAPIResult(searchResult)) {
			this.title = searchResult.volumeInfo?.title;
			this.authors = searchResult.volumeInfo?.authors;
			this.publisher = searchResult.volumeInfo?.publisher;
			this.publishDate = searchResult.volumeInfo?.publishedDate;
			this.pageCount = searchResult.volumeInfo?.pageCount;
			this.thumbnail = searchResult.volumeInfo?.imageLinks?.thumbnail;
			this.description = searchResult.volumeInfo?.description;
		}
	}

	/**タイトルを取得する(存在しなければ「データ無し」を返す) */
	public getTitleLabel() {
		return this.searchResult.volumeInfo?.title ?? 'データ無し';
	}

	/**著者が複数名いる場合に句点で区切る*/
	public getJoinedAuthorNames = (): string => {
		let authors = this.searchResult.volumeInfo?.authors;
		if (!authors) {
			return '';
		}

		let result: string;
		//多すぎる場合は短縮
		if (authors.length >= 6) {
			result = `${authors.slice(0, 5).join(', ')}...`;
		} else {
			result = authors.join(', ');
		}

		return result;
	};

	public getPageCountLabel() {
		return `${this.pageCount}ページ`;
	}
}
