import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';

export type SearchPromise = () => Promise<{ totalCount: number; items: BookSearch | undefined }>;
