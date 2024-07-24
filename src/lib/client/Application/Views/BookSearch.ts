import type { books_v1 } from "googleapis";

export class BookSearchView {
	constructor(public readonly booksVolume: books_v1.Schema$Volume) { }

	/**タイトルを取得する(存在しなければ「データ無し」を返す) */
	public getTitleLabel() {
		return this.booksVolume.volumeInfo?.title ?? 'データ無し';
	}

	/**著者が複数名いる場合に句点で区切る*/
	public joinAuthorNames = (): string => {
		let authors = this.booksVolume.volumeInfo?.authors;
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