import { getWishBookInfoUseCase } from '$lib/client/Application/UseCases/BookInfo';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const usecase = getWishBookInfoUseCase(fetch);
	const result = await usecase.get();

	return { items: result.items };
}) satisfies PageLoad;
