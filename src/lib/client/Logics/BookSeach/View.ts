import type { BookSearch } from '$lib/client/Application/Interface/BookSearch';

export const bookSearchView = (bookSearch: BookSearch) => {
	/**タイトルを取得する(存在しなければ「データ無し」を返す) */
	const titleLabel = () => {
		return !!bookSearch.title ? bookSearch.title : 'データ無し';
	};

	/**著者が複数名いる場合に句点で区切る*/
	const joinUpToFiveAuthorNames = () => {
		let authors = bookSearch.authors;
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

	const joinAuthorNames = () => {
		if (!bookSearch.authors) {
			return '';
		}

		return bookSearch.authors.join(', ');
	};

	const pageCountLabel = () => {
		return !!bookSearch.pageCount ? `${bookSearch.pageCount}ページ` : '0ページ';
	};

	return { titleLabel, joinUpToFiveAuthorNames, joinAuthorNames, pageCountLabel };
};
