import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type {
	deletionBookInfoParameter,
	updateBookInfoParameter
} from '$lib/client/Helpers/CustomEvent/Dispatcher';
import { mainToastTarget, pushErrorToast, pushSuccessToast } from '$lib/client/Helpers/Toast';

export const handleBookInfosUpdate = (
	bookInfos: BookInfo[],
	paramter: updateBookInfoParameter,
	isBooksRoute = false
) => {
	//一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
	let copiedViews = [...bookInfos];
	let appliedViews: BookInfo[] = [];
	const oldItem = copiedViews.find((item) => item.id?.equals(paramter.updatedItem.id!));

	if (!isBooksRoute && !oldItem?.status.equals(paramter.updatedItem.status)) {
		//全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
		appliedViews = copiedViews.filter((item) => item.id?.equals(paramter.updatedItem.id!));
	} else {
		//編集したアイテムを一覧に反映する
		const index = copiedViews.findIndex((item) => item.id?.equals(paramter.updatedItem.id!));
		appliedViews = [
			...copiedViews.slice(0, index),
			paramter.updatedItem,
			...copiedViews.slice(index + 1)
		];
	}

	pushSuccessToast(paramter.message, mainToastTarget);

	return appliedViews;
};

export const handleBookInfosDeletion = (
	bookInfos: BookInfo[],
	parameter: deletionBookInfoParameter
) => {
	//一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
	let copiedViews = [...bookInfos];
	let appliedViews: BookInfo[] = [];
	appliedViews = copiedViews.filter((item) => !item.id?.equals(parameter.deletedId));

	pushSuccessToast(parameter.message, mainToastTarget);

	return appliedViews;
};

export const handleSuccess = (event: CustomEvent<string>) => {
	pushSuccessToast(event.detail, mainToastTarget);
};

export const handleFailure = (event: CustomEvent<string>) => {
	pushErrorToast(event.detail, mainToastTarget);
};
