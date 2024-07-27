import type { books_v1 } from "googleapis";
import type { BookSearchResultType } from "$lib/client/Application/Interface";

export class BookSearchView<T extends BookSearchResultType> {
	constructor(public readonly searchResult: T) { }

	/**タイトルを取得する(存在しなければ「データ無し」を返す) */
	public getTitleLabel() {
		return this.searchResult.volumeInfo?.title ?? 'データ無し';
	}

	/**著者が複数名いる場合に句点で区切る*/
	public joinAuthorNames = (): string => {
		let authors = this.searchResult.volumeInfo?.authors;
		if (!authors) { return ''; }

		let result: string;
		//多すぎる場合は短縮
		if (authors.length >= 6) {
			result = `${authors.slice(0, 5).join(', ')}...`;
		} else {
			result = authors.join(', ');
		}

		return result;
	};
}