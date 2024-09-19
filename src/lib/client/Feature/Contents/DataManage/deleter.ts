import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { APIRouteURLs } from '$lib/client/Shared/Constants/urls';
import type { FetchInterface } from '$lib/client/Shared/interface';

export const deleteBookInfo = async (fetch: FetchInterface, id: Id) => {
	const { ok: isSuccess } = await fetch(APIRouteURLs.bookInfo, {
		method: 'DELETE',
		body: JSON.stringify(id.value),
		headers: { 'Content-type': 'application/json' }
	});

	const message = isSuccess
		? '削除しました'
		: '削除に失敗しました。<br>時間をおいて再度登録してください。';

	return { isSuccess, message };
};
