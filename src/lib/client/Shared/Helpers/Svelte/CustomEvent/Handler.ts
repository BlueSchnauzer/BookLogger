import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
import { bookInfoView } from '$lib/client/Application/Views/BookInfo';
import type {
	deletionBookInfoParameter,
	updateBookInfoParameter
} from '$lib/client/Shared/Helpers/Svelte/CustomEvent/Dispatcher';
import {
	mainToastTarget,
	pushErrorToast,
	pushSuccessToast
} from '$lib/client/Shared/Helpers/Toast';
import _ from 'lodash';

export const handleBookInfosUpdate = (
	items: BookInfoResponseItem[] | undefined,
	parameter: updateBookInfoParameter,
	isBooksRoute = false
) => {
	if (!items) {
		return;
	}

	//純粋にしたいのでコピーするが、コスト高い？
	let copiedItems = _.cloneDeep(items);
	const targetIndex = copiedItems.findIndex((item) =>
		item.entity.id?.equals(parameter.updatedItem.id!)
	);

	if (
		!isBooksRoute &&
		!copiedItems[targetIndex].entity.status.equals(parameter.updatedItem.status)
	) {
		//全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
		copiedItems.splice(targetIndex, 1);
	} else {
		//編集したアイテムを一覧に反映する
		copiedItems[targetIndex].entity = parameter.updatedItem;
		copiedItems[targetIndex].view = bookInfoView(parameter.updatedItem);
	}

	pushSuccessToast(parameter.message, mainToastTarget);

	return copiedItems;
};

export const handleRecentBookInfoUpdate = (
	item: BookInfoResponseItem | undefined,
	parameter: updateBookInfoParameter
) => {
	const result = handleBookInfosUpdate([item!], parameter);
	return result?.[0];
};

export const handleBookInfosDeletion = (
	items: BookInfoResponseItem[] | undefined,
	parameter: deletionBookInfoParameter
) => {
	if (!items) {
		return;
	}

	//一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
	let copiedItems = _.cloneDeep(items);
	const targetIndex = copiedItems.findIndex((item) => item.entity.id?.equals(parameter.deletedId!));

	copiedItems.splice(targetIndex, 1);

	pushSuccessToast(parameter.message, mainToastTarget);

	return copiedItems;
};

export const handleRecentBookInfoDeletion = (
	item: BookInfoResponseItem | undefined,
	parameter: deletionBookInfoParameter
) => {
	const result = handleBookInfosDeletion([item!], parameter);
	return result?.[0];
};

export const handleSuccess = (event: CustomEvent<string>) => {
	pushSuccessToast(event.detail, mainToastTarget);
};

export const handleFailure = (event: CustomEvent<string>) => {
	pushErrorToast(event.detail, mainToastTarget);
};
