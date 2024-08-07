import type { pageHistoryValidation } from '$lib/client/Application/Interface';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { convertInputDateToDate, getCurrentDateString } from '$lib/client/Helpers/Date';
import { modalToastTarget } from '$lib/client/Helpers/Toast';
import { pushToast } from '$lib/utils/toast';
import { validateReadingCount, validateReadingDate } from '$lib/utils/validation';

export const bookInfoOperations = (bookInfo: BookInfo) => {
	const addPageHistory = (readingDate: string, readingCount: number): pageHistoryValidation => {
		const isValidDate = validateReadingDate(readingDate);
		const isValidCount = validateReadingCount(readingCount, bookInfo.pageCount);
		if (!isValidDate || !isValidCount) {
			const errorMessage = !isValidDate
				? '日付が未入力です'
				: `ページ数は1～${bookInfo.pageCount}ページで入力してください`;
			return { isError: true, errorMessage };
		}

		const item = new PageHistory({
			date: convertInputDateToDate(readingDate),
			pageCount: readingCount
		});

		if (bookInfo.pageHistories && bookInfo.pageHistories.length) {
			bookInfo.pageHistories.push(item);
			bookInfo.pageHistories = bookInfo.pageHistories;
		} else {
			bookInfo.pageHistories = [item];
		}

		if (bookInfo.status.value === 'wish' && bookInfo.pageHistories.length === 1) {
			bookInfo.status = new Status('reading');
			pushToast('ステータスを「読んでいる本」に変更しました。', modalToastTarget);
		} else if (bookInfo.status.value !== 'complete' && readingCount === bookInfo.pageCount) {
			bookInfo.status = new Status('complete');
			pushToast('ステータスを「読み終わった本」に変更しました。', modalToastTarget);
		}

		return { isError: false };
	};

	const deletePageHistory = (id?: string) => {
		if (!id || !bookInfo.pageHistories?.length) {
			return;
		}

		bookInfo.pageHistories = bookInfo.pageHistories?.filter((item) => item.value.id !== id);
	};

	const addPageHistoryWhenComplete = () => {
		if (bookInfo.status.value !== 'complete' || hasCompleteHistory(bookInfo)) {
			return;
		}
		addPageHistory(getCurrentDateString(), bookInfo.pageCount);

		pushToast('最後のページまでの読んだ記録を追加しました。', modalToastTarget);
	};

	return { addPageHistory, deletePageHistory, addPageHistoryWhenComplete };
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
