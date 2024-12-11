export const APIRouteURLs = {
	auth: '/api/auth',
	bookInfo: '/api/bookinfo',
	bookInfoRecent: '/api/bookinfo/recent',
	bookInfoHistory: '/api/bookinfo/history'
} as const;

export const HomeURLs = {
	home: '/home'
} as const;

export const BooksURLs = {
	books: '/books',
	wish: '/books/wish',
	reading: '/books/reading',
	complete: '/books/complete'
} as const;

export const SearchURLs = {
	search: '/search'
} as const;
