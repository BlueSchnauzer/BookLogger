import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { bookInfoAPIRoute } from '$lib/client/Shared/Constants/requestUrls';
import type { FetchInterface } from '$lib/client/Feature/Contents/DataManage/interface';

export const deleteBookInfo = async (fetch: FetchInterface, id: Id) => {
	const { ok: isSuccess } = await fetch(bookInfoAPIRoute, {
		method: 'DELETE',
		body: JSON.stringify(id.value),
		headers: { 'Content-type': 'application/json' }
	});

	const message = isSuccess
		? '削除しました'
		: '削除に失敗しました。<br>時間をおいて再度登録してください。';

	return { isSuccess, message };
};
