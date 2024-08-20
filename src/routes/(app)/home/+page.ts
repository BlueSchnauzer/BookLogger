import { getHomeBookInfoUseCases } from '$lib/client/Application/UseCases/BookInfo';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	//直近で読んだ書誌データを取得
	const homeInfoUseCase = getHomeBookInfoUseCases(fetch);
	const recentItem = await homeInfoUseCase.getRecent();
	const historyMap = await homeInfoUseCase.getHistory();

	return { recentItem, historyMap };
}) satisfies PageLoad;
