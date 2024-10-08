export const getTitleLabel = (title?: string) => (!!title ? title : 'データ無し');

export const joinUpToFiveAuthorNames = (authors?: string[]) => {
	if (!authors) {
		return '';
	}

	//多すぎる場合は短縮
	if (authors.length >= 6) {
		return `${authors.slice(0, 5).join(', ')}...`;
	} else {
		return authors.join(', ');
	}
};

export const joinAuthorNames = (authors?: string[]) => {
	if (!authors) {
		return '';
	}

	return authors.join(', ');
};

export const getPageCountLabel = (pageCount?: number) =>
	!!pageCount ? `${pageCount}ページ` : '0ページ';
