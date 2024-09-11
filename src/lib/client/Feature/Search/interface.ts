import type { BookSearch } from '$lib/client/Domain/Entities/BookSearch';

export type SearchPromise = () => Promise<{ totalCount: number; items: BookSearch }>;
