const BooksRouteURLs = {
	route: '/api/bookinfo',
	wish: '/api/bookinfo/wish',
	reading: '/api/bookinfo/reading',
	complete: '/api/bookinfo/complete',
	recent: '/api/bookinfo/recent',
	history: '/api/bookinfo/history'
};

export const APIRouteURLs = {
	auth: '/api/auth',
	bookInfo: BooksRouteURLs
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
