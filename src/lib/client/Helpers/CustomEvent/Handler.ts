import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
import { bookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type {
	deletionBookInfoParameter,
	updateBookInfoParameter
} from '$lib/client/Helpers/CustomEvent/Dispatcher';
import { mainToastTarget, pushErrorToast, pushSuccessToast } from '$lib/client/Helpers/Toast';
import _ from 'lodash';

export const handleBookInfosUpdate = (
	items: BookInfoResponseItem[],
	paramter: updateBookInfoParameter,
	isBooksRoute = false
) => {
	//純粋にしたいのでコピーするが、コスト高い？
	let copiedItems = _.cloneDeep(items);
	const targetIndex = copiedItems.findIndex((item) =>
		item.entity.id?.equals(paramter.updatedItem.id!)
	);

	if (
		!isBooksRoute &&
		!copiedItems[targetIndex].entity.status.equals(paramter.updatedItem.status)
	) {
		//全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
		copiedItems.splice(targetIndex, 1);
	} else {
		//編集したアイテムを一覧に反映する
		copiedItems[targetIndex].entity = paramter.updatedItem;
		copiedItems[targetIndex].view = bookInfoView(paramter.updatedItem);
	}

	pushSuccessToast(paramter.message, mainToastTarget);

	return copiedItems;
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
