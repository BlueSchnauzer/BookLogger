import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { bookInfoAPIRoute } from '$lib/client/Shared/Constants/requestUrls';
import type { FetchInterface } from '$lib/client/Shared/interface';

export const updateBookInfo = async (
	fetch: FetchInterface,
	bookInfo: BookInfo,
	beforeStatus: status
) => {
	const isCompleteReading = beforeStatus !== 'complete' && bookInfo.status.value === 'complete';

	const { ok: isSuccess } = await fetch(bookInfoAPIRoute, {
		method: 'PUT',
		body: JSON.stringify({ bookInfo, isCompleteReading }),
		headers: { 'Content-type': 'application/json' }
	});

	const message = isSuccess
		? '更新しました。'
		: '更新に失敗しました。<br>時間をおいてから再度お試しください。';

	return { isSuccess, message };
};
