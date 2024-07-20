import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { bookInfoDispatchParameter } from "$lib/client/Utils/customEvent/dispatcher";
import { pushSuccessToast, pushErrorToast } from "$lib/client/Utils/toast";
import { BookInfoView } from "$lib/client/Application/Views/BookInfo";

export const handleSuccess = (bookInfoViews: BookInfoView[], detail: bookInfoDispatchParameter, target: string, isBooksRoute = false) => {
  const appliedItems = applyChange(bookInfoViews, detail, isBooksRoute);
  pushSuccessToast(detail.message, target);

  return appliedItems;
}

export const handleFailure = (message: string, target: string) => {
  pushErrorToast(message, target);
}

const applyChange = (bookInfoViews: BookInfoView[], detail: bookInfoDispatchParameter, isBooksRoute: boolean) => {
  //一旦、viewの中身を取り出して新しく操作する、上手くいくか確認
  let copiedViews = [...bookInfoViews];
  let appliedViews: BookInfoView[] = [];

  //updatedItemがBookInfoViewなので、上手く動くか確認
  if (detail.updatedItem) {
    const oldItem = copiedViews.find(item => item.id?.equals(detail.updatedItem?.id!));

    if (!isBooksRoute && !oldItem?.status.equals(detail.updatedItem.status)) {
      //全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
      appliedViews = copiedViews.filter(item => item.id?.equals(detail.updatedItem?.id!));
    }
    else {
      //編集したアイテムを一覧に反映する
      const index = copiedViews.findIndex(item => item.id?.equals(detail.updatedItem?.id!));
      appliedViews = [...copiedViews.slice(0, index), detail.updatedItem, ...copiedViews.slice(index + 1)];
    }
  }
  if (detail.deletedId) {
    //削除したアイテムを一覧からも削除する
    appliedViews = copiedViews.filter(item => item.id?.equals(detail.deletedId!));
  }

  return appliedViews;
}