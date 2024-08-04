import { BookInfoUseCase } from '$lib/client/Application/UseCases/BookInfo';
import { BookInfoEntityResource } from '$lib/client/Infrastructure/MongoDB/BookInfoEntityResource';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const repos = new BookInfoEntityResource(fetch);
	const usecase = new BookInfoUseCase(repos);
	const views = await usecase.get();
	console.log('bookinfo views', views);

	return { views };
}) satisfies PageLoad;
