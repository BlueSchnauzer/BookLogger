import {
	isGAPIResult,
	type BookSearchResultListType,
	type BookSearchResultType
} from '$lib/client/Application/Interface';

export class BookSearchView<T extends BookSearchResultType<BookSearchResultListType>> {
	public readonly keyId?: string;
	public readonly title?: string;
	public readonly authors?: string[];
	public readonly publisher?: string;
	public readonly publishedDate?: string;
	public readonly pageCount?: number;
	public readonly thumbnail?: string;
	public readonly description?: string;

	constructor(public readonly searchResult: T) {
		if (isGAPIResult(searchResult)) {
			this.keyId = searchResult.id!;
			this.title = searchResult.volumeInfo?.title;
			this.authors = searchResult.volumeInfo?.authors;
			this.publisher = searchResult.volumeInfo?.publisher;
			this.publishedDate = searchResult.volumeInfo?.publishedDate;
			this.pageCount = searchResult.volumeInfo?.pageCount;
			this.thumbnail = searchResult.volumeInfo?.imageLinks?.thumbnail;
			this.description = searchResult.volumeInfo?.description;
		}
	}

	/**タイトルを取得する(存在しなければ「データ無し」を返す) */
	get titleLabel() {
		return !!this.title ? this.title : 'データ無し';
	}

	/**著者が複数名いる場合に句点で区切る*/
	get joinUpToFiveAuthorNames() {
		let authors = this.authors;
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
	}

	get joinAuthorNames() {
		if (!this.authors) {
			return '';
		}

		return this.authors.join(', ');
	}

	get pageCountLabel() {
		return !!this.pageCount ? `${this.pageCount}ページ` : '0ページ';
	}
}
