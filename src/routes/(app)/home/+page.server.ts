import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async ({ fetch }) => {
	//直近で読んだ書誌データを取得
	const bookInfos = await fetch('/api/bookinfo?recentbook=true');
	if (!bookInfos.ok) {
		throw error(bookInfos.status);
	}

	//書誌データのhistoryのみを取得
	const history = await fetch('/api/bookinfo?history=true');
	if (!history.ok) {
		throw error(history.status);
	}

	const recentBook: BookInfo[] = await bookInfos.json();
	const pagesWithDate = getPageCountInCurrentWeek(await history.json());

	return { recentBook, pagesWithDate };
}) satisfies PageServerLoad;

const getPageCountInCurrentWeek = (bookInfos: BookInfo[]) => {
	//文字列の日付と、ページ数を持つmapを作成
	const today = new Date();
	const pageMap = new Map<string, number>();
	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		pageMap.set(date.toLocaleDateString('ja-JP'), 0);
	}

	if (!bookInfos) {
		return pageMap;
	}

	//先週の0時0分を取得
	today.setDate(today.getDate() - 6);
	const lastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	//各書誌データのHistoryを確認して1日に読んだページ数を取得
	bookInfos.forEach((bookInfo) => {
		//今週分のhistoryを取得し、日付の重複を排除する(残すのは最大のページ数)
		const historyInCurrentWeek = bookInfo.pageHistory?.filter(
			(item) => new Date(item.date) >= lastDate
		);
		const historyMap = new Map<string, number>();

		historyInCurrentWeek?.forEach((item) => {
			//DBから取ったデータは文字列になっているため変換
			const key = new Date(item.date).toLocaleDateString('ja-JP');
			if (!historyMap.has(key) || historyMap.get(key)! < item.currentPage) {
				historyMap.set(key, item.currentPage);
			}
		});

		if (historyMap.size === 0) {
			return;
		}

		//ページ数を加算する
		historyMap.forEach((value, key) => {
			if (pageMap.has(key)) {
				const orgValue = pageMap.get(key);
				pageMap.set(key, orgValue! + value);
			}
		});
	});

	return pageMap;
};
