import { getHistory, getRecentBookInfo } from '$lib/client/Feature/Contents/DataManage/fetcher';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const recentBookInfo = await getRecentBookInfo(fetch);
	const historyMap = await getHistory(fetch);

	return { recentBookInfo, historyMap };
}) satisfies PageLoad;
