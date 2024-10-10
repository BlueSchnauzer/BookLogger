import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import { PageHistory } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import { convertInputDateToDate, getCurrentDateString } from '$lib/client/Shared/Helpers/Date';
import { pushToast, modalToastTarget } from '$lib/client/Shared/Helpers/Toast';
import { validateReadingCount, validateReadingDate } from '$lib/client/Shared/Utils/Validation';
import { get, writable } from 'svelte/store';

export const bookInfoStore = (bookInfo: BookInfo) => {
	const store = writable(bookInfo);
	const { subscribe, update } = store;

	const addPageHistory = (readingDate: string, readingCount: number) => {
		const currentData = get(store);

		const isValidDate = validateReadingDate(readingDate);
		const isValidCount = validateReadingCount(readingCount, currentData.pageCount);
		if (!isValidDate || !isValidCount) {
			const errorMessage = !isValidDate
				? '日付が未入力です'
				: `ページ数は1～${currentData.pageCount}ページで入力してください`;
			return { isError: true, errorMessage };
		}

		//これはうまくいくのか？
		update((bookInfo) => {
			const item = new PageHistory({
				date: convertInputDateToDate(readingDate),
				pageCount: readingCount
			});

			const pageHistories = bookInfo.pageHistories ? [...bookInfo.pageHistories, item] : [item];

			let status = bookInfo.status;
			if (bookInfo.status.value === 'wish' && pageHistories.length === 1) {
				status = new Status('reading');
				pushToast('ステータスを「読んでいる本」に変更しました。', modalToastTarget);
			} else if (bookInfo.status.value !== 'complete' && readingCount === bookInfo.pageCount) {
				status = new Status('complete');
				pushToast('ステータスを「読み終わった本」に変更しました。', modalToastTarget);
			}

			return { ...bookInfo, pageHistories, status };
		});

		return { isError: false };
	};

	const deletePageHistory = (id?: string) => {
		update((bookInfo) => {
			if (!id || !bookInfo.pageHistories?.length) {
				return bookInfo;
			}

			return {
				...bookInfo,
				pageHistories: bookInfo.pageHistories?.filter((item) => item.value.id !== id)
			};
		});
	};

	const addPageHistoryWhenComplete = () => {
		const currentData = get(store);
		if (currentData.status.value !== 'complete' || hasCompleteHistory(currentData)) {
			return;
		}

		addPageHistory(getCurrentDateString(), currentData.pageCount);

		pushToast('最後のページまでの読んだ記録を追加しました。', modalToastTarget);
	};

	return { subscribe, addPageHistory, deletePageHistory, addPageHistoryWhenComplete };
};

const hasCompleteHistory = (bookInfo: BookInfo) => {
	if (!bookInfo.pageHistories?.length) {
		return false;
	}

	let result = false;
	bookInfo.pageHistories?.forEach((item) => {
		if (item.value.pageCount === bookInfo.pageCount) {
			result = true;
		}
	});

	return result;
};
