import type { PageLoad } from './$types';

export const load = (async (params) => {
    const bookTitle = params.url.searchParams.get('booktitle');
    const author = params.url.searchParams.get('author');
    const isbn = params.url.searchParams.get('isbn');

    return { bookTitle, author, isbn };
}) satisfies PageLoad;