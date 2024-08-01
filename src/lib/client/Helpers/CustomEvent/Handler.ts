import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
import type {
	deletionBookInfoParameter,
	updateBookInfoParameter
} from '$lib/client/Helpers/CustomEvent/Dispatcher';
import { pushErrorToast, pushSuccessToast } from '$lib/client/Helpers/Toast';

export const handleUpdateSuccess = (
	bookInfoViews: BookInfoView[],
	paramter: updateBookInfoParameter,
	isBooksRoute = false
) => {
	//一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
	let copiedViews = [...bookInfoViews];
	let appliedViews: BookInfoView[] = [];
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

	pushSuccessToast(paramter.message);

	return appliedViews;
};

export const handleDeletionSuccess = (
	bookInfoViews: BookInfoView[],
	parameter: deletionBookInfoParameter
) => {
	//一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
	let copiedViews = [...bookInfoViews];
	let appliedViews: BookInfoView[] = [];
	appliedViews = copiedViews.filter((item) => item.id?.equals(parameter.deletedId));

	pushSuccessToast(parameter.message);

	return appliedViews;
};

export const handleFailure = (message: string) => {
	pushErrorToast(message);
};

// const applyChange = (bookInfoViews: BookInfoView[], paramter: updateBookInfoParameter | deletionBookInfoParameter, isBooksRoute: boolean) => {
//   //一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
//   let copiedViews = [...bookInfoViews];
//   let appliedViews: BookInfoView[] = [];

//   //updatedItemがBookInfoViewなので、上手く動くか確認
//   if () {
//     const oldItem = copiedViews.find(item => item.id?.equals(paramter.updatedItem?.id!));

//     if (!isBooksRoute && !oldItem?.status.equals(paramter.updatedItem.status)) {
//       //全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
//       appliedViews = copiedViews.filter(item => item.id?.equals(paramter.updatedItem?.id!));
//     }
//     else {
//       //編集したアイテムを一覧に反映する
//       const index = copiedViews.findIndex(item => item.id?.equals(paramter.updatedItem?.id!));
//       appliedViews = [...copiedViews.slice(0, index), paramter.updatedItem, ...copiedViews.slice(index + 1)];
//     }
//   }
//   if (paramter.deletedId) {
//     //削除したアイテムを一覧からも削除する
//     appliedViews = copiedViews.filter(item => item.id?.equals(paramter.deletedId!));
//   }

//   return appliedViews;
// }
